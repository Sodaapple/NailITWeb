var scop = {
    //從layout的js取得login ingo //
    // loginId: 0, // 目前登入者Id
    // loginAccount: "", // 目前登入者帳號
    // loginNickname: "", // 目前登入者暱稱
    bodyArea: null, // for closing right click menu
    chattingMembersMenu: null, //  for chattingMembers right click menu
    chattingMsgsMenu: null, // for chattingMsg right click menu
    messageid: 0, // 目前開啟context menu的訊息Id
    memberid: 0, // 目前開啟context menu的人員Id
    chattingMembers: [], // 有聊天記錄的人員清單, for 人員list過濾篩選器
    currentChatMemId: 0, // 目前聊天對象Id
    loadingTime: null // 近期更新聊天室時間
}
//#region Function
//#region Action
var showPicModal = function(obj){
    let imgPic = document.createElement("img");
    imgPic.src = $(obj).prop("src");
    imgPic.classList.add("mw-100");
    $("#pictureBody").empty();
    $(imgPic).appendTo("#pictureBody");
    $("#pictureModal").modal("show");
}
var showRevokeBlock = async function (obj) {
    if (!checkLogin()) return;
    // get blacklistid
    let blackid = $(obj).parent().data("blackid");
    // call api (deleteBlacklist)
    let result = await deleteBlacklist(blackid);
    if (!!result) {
        // remove the blacklist option
        $(obj).parent().remove();
        // showChatMember() reload cahtting member
        showChatMember();

        if ($("#blacklistBody").children().length == 0) {
            $("#blacklistBody").append('<div class="d-flex justify-content-center">目前黑名單沒有資料</div>');
        }
    }
}
var showBlacklist = function () {
    if (!checkLogin()) return;
    // show black list modal
    $("#blacklistModal").modal("show");
}
var showAddBlack = async function () {
    if (!checkLogin()) return;
    // create black model 
    let blacklist = new MessageBlacklistTable({
        blacklistBuilder: navScop.loginId,
        blacklistTarget: scop.memberid
    });
    // call api (postBlacklist)
    let result = await postBlacklist(blacklist);
    if (!!result) {
        // remove member from display
        $(`div[data-memberid='${scop.memberid}']`).remove();
        // remove from scop, for filter
        chattingMembersSplice(scop.memberid);
        // if chatting area show the member's message
        if (scop.memberid == scop.currentChatMemId) {
            $("#chattingMain").addClass("d-none");
        }
    }
}
// search member searchChatMember
var showSearchChatMember = async function () {
    let searchChatMember = $("#searchChatMember").val().trim();
    let searchMembers = scop.chattingMembers;
    if (searchChatMember != "") {
        searchMembers = scop.chattingMembers.
            filter(x => x.memberAccount.toUpperCase().indexOf(searchChatMember.toUpperCase()) > -1
                || x.memberNickname.toUpperCase().indexOf(searchChatMember.toUpperCase()) > -1);
    }
    $("#chattingMembers").empty();
    await renderChatMember(searchMembers);
    // system notic can't be add in blacklist, so there is a not()
    BindingMemberRightMenu($(".data-memberid").not("div[data-memberid='0']"));

}
// Checking for new messages 
var showNewMsg = async function () {
    // call api (getNewMsg)
    let result = await getNewMsg((new Date(scop.loadingTime).toISOString()));
    if (!!result && result.length > 0) {
        // Reload ChatMembers 對話人員目錄
        showChatMember();
        // If the person i'm chatting with, send new message.
        if (result.findIndex(x => x.memberId == scop.currentChatMemId) > -1) {
            // update message, get the new message, read the member's message
            // call api for unread message (putMsgRead)
            let result2 = await putMsgRead(scop.currentChatMemId);
            if (!!result2 && result2.length > 0) {
                // show messages
                for (const message of result2) {
                    // print Date
                    let messageDate = message.messageTime.YYYYMMDD(8);
                    if (messageDate != new Date().YYYYMMDD()) {
                        let messageDateHTML = `
                            <div class="my-3 d-flex justify-content-center">
                                <span class="px-3 bg-secondary text-white rounded">${messageDate}</span>
                            </div>`;
                        $("#chattingArea").append(messageDateHTML).slideDown();
                    }
                    renderMessage(message, true); // true means add with slidDown
                }
                // update chatting members, remove unread red mark
                $(`div[data-memberid='${scop.currentChatMemId}']`).children()[2].remove();
            }

        }
    }
}
// Revoking chosen message
var showRevokeMsg = async function () {
    if (!checkLogin()) return;
    // call api (putMsgRevoke)
    let result = await putMsgRevoke(scop.messageid);
    if (!!result) {
        // update message
        $(`div[data-messageid='${scop.messageid}']`).children(":first").children(":first").replaceWith(`<span class="rounded px-3 py-2" style="border: 4px solid black;">訊息已收回</span>`);
    }
}
// Enter specific person while enter into chatting page
var showPersonAtEntry = async function (findMemberId) {
    if (findMemberId != -1) {
        // 有帶入人員，移除無訊息文字
        $("#noChattingMember").remove();
        // chech if member already existed. Not exist, then append new chattingMember
        if (scop.chattingMembers.findIndex(x => x.memberId == findMemberId) == -1) {
            // append new chattingMember
            let chatMemberHTML = `
                <div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2 w-100" data-memberid="${findMemberId}" onclick="showSingleMemberMsg(this)">
                    <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                        style="aspect-ratio:1;color: #fff;width:35px">
                        <div class="font-weight-bold">
                            ${$("#findMemberAccount").val()[0].toUpperCase()}
                        </div>
                    </div>
                    <div class="pl-1 pl-sm-4">
                        <div class="font-weight-bold">${$("#findMemberNickname").val()}</div>
                        <div></div>
                    </div>
                </div>`;
            $("#chattingMembers").prepend(chatMemberHTML);
            // add into scop.chattingMembers
            scop.chattingMembers.push({
                memberId: findMemberId,
                messageContent: "",
                messageTime: new Date(),
                unreadCount: 0,
                msgTimeDiff: "",
                memberAccount: $("#findMemberAccount"),
                memberNickname: $("#findMemberNickname")
            });
        }
        // show the conversation with the member
        showSingleMemberMsg($(`div[data-memberid='${findMemberId}']`));
    }
}
// Showing my conversation with chosen member
var showSingleMemberMsg = async function (obj) {
    if (!checkLogin()) return;
    // chosen css
    $(`div[data-memberid='${scop.currentChatMemId}']`).removeClass("chosen");
    $(obj).addClass("chosen");
    // get member info
    scop.currentChatMemId = $(obj).data("memberid");
    avatar.innerText = $(obj).children()[0].innerText;
    member.innerText = $(obj).children()[1].childNodes[1].innerText;
    // call api for read message (getSingleMemberMsg)
    let result = await getSingleMemberMsg(scop.currentChatMemId);
    if (!!result) {
        chattingMain.classList.remove("d-none");
        sendMsgArea.classList.add("d-flex");
        sendMsgArea.classList.remove("d-none");
        emptySendMsgArea.classList.add("d-none");
        // can't send message to system, hide sendMsgArea
        if (scop.currentChatMemId == 0) {
            sendMsgArea.classList.add("d-none");
            sendMsgArea.classList.remove("d-flex");
            emptySendMsgArea.classList.remove("d-none");
        }
        chattingArea.innerHTML = "";
        // show messages
        let messageDate;
        for (const message of result) {
            // print Date
            if (messageDate != message.messageTime.YYYYMMDD(8)) {
                messageDate = message.messageTime.YYYYMMDD(8);
                let messageDateHTML = `
                    <div class="my-3 d-flex justify-content-center">
                        <span class="px-3 bg-secondary text-white rounded">${messageDate}</span>
                    </div>`;
                $("#chattingArea").append(messageDateHTML)
            }
            await renderMessage(message);
        }
        BindingMsgRightMenu($(".myMessage"));
        // Scroll to bottom of message 
        setTimeout(() => {
            ShowChattingBottom();
        }, "80")
    }
    // call api for unread message (putMsgRead)
    let result2 = await putMsgRead(scop.currentChatMemId);
    if (!!result2 && result2.length > 0) {
        let messageDateHTML = `
            <div id="unreadStart" class="my-3 d-flex justify-content-center">
                <span class="px-3 bg-secondary text-white rounded">以下為尚未讀取的訊息</span>
            </div>`;
        $("#chattingArea").append(messageDateHTML)
        // show messages
        let messageDate;
        for (const message of result2) {
            // print Date
            if (messageDate != message.messageTime.YYYYMMDD(8)) {
                messageDate = message.messageTime.YYYYMMDD(8);
                let messageDateHTML = `
                    <div class="my-3 d-flex justify-content-center">
                        <span class="px-3 bg-secondary text-white rounded">${messageDate}</span>
                    </div>`;
                $("#chattingArea").append(messageDateHTML)
            }
            renderMessage(message);
        }
        // update chatting members, remove unread
        $(`div[data-memberid='${scop.currentChatMemId}']`).children()[2].remove();
        scrolltoId("unreadStart");
    }
}
// Sending image(s) message
var showMyNewImg = async function (obj) {
    if (!checkLogin()) return;
    // get file
    let files = $(obj).prop('files');
    let message = new MessageTable({
        messageSender: navScop.loginId,
        messageReceiver: scop.currentChatMemId
    });
    let formdata = new FormData();
    // call api (postMsgImage), get new message
    for (let index = 0; index < files.length; index++) {
        formdata.append(`file${index}`, files[index]);
    }
    formdata.append("message", JSON.stringify(message));
    let result = await postMsgImage(formdata);
    if (!!result) {
        // show new message
        for (const message of result) {
            await renderMessage(message, true);
            BindingMsgRightMenu($(`div[data-messageid="${message.messageId}"]`));
        }
        // update chatting members
        await renderTheChatMember(result[result.length-1]);
        BindingMemberRightMenu([$("#chattingMembers").children()[0]]); // first one
        // update scop.chattingMembers, for fliter
        updateThechattingMember(result[result.length-1]);
    }
}
// Sending message
var showMyNewMsg = async function () {
    if (!checkLogin()) return;
    if (!draftMessage.innerHTML.trim()) {
        return;
    }
    content = await elmDataURLToLink(draftMessage.innerHTML);
    // get value from textarea
    let message = new MessageTable({
        messageSender: navScop.loginId,
        messageReceiver: scop.currentChatMemId,
        messageContent: content,
    });
    // call api (postMessage) 因為postMessage與系統功能名稱重複，改為postTheMessage
    let result = await postTheMessage(message);
    if (!!result) {
        // clear textarea
        draftMessage.innerHTML = "";
        // show new message
        result.messageTime = new Date(result.messageTime).addHours(-8);
        await renderMessage(result, true);
        let lastMessage = $("#chattingArea").children()[$("#chattingArea").children().length - 1];
        BindingMsgRightMenu([lastMessage]); // last one
        // update chatting members
        await renderTheChatMember(result);
        BindingMemberRightMenu([$("#chattingMembers").children()[0]]); // first one
        // update scop.chattingMembers, for fliter
        updateThechattingMember(result);
        // after updating, check if someone should be chosen.
        if (scop.currentChatMemId > 0) {            
            $(`div[data-memberid='${scop.currentChatMemId}']`).addClass("chosen");
        }
    }
}
var showChatMember = async function () {
    // call api (getMembersMsg)
    let result = await getMembersMsg();
    if (!!result) {
        // show chatting members        
        await renderChatMember(result);
        // system notic can't be add in blacklist, so there is a not()
        BindingMemberRightMenu($(".data-memberid").not("div[data-memberid='0']"));
        scop.chattingMembers = result;
        // record latest loading time        
        scop.loadingTime = new Date();
        // after updating, check if someone should be chosen.
        if (scop.currentChatMemId > 0) {            
            $(`div[data-memberid='${scop.currentChatMemId}']`).addClass("chosen");
        }
    }
}
//#endregion

//#region render updates
// 渲染黑名單
var renderBlacklist = function (blacklist) {
    if (blacklist.length == 0) {
        $("#blacklistBody").append('<div class="d-flex justify-content-center">目前黑名單沒有資料</div>');
        return;
    }

    for (const black of blacklist) {
        let blackHTML = `
            <div class="d-flex justify-content-between" data-blackid="${black.blacklistId}">
                <div>${black.memberNickname}(${black.memberAccount})</div>
                <button class="btn btn-light" onclick="showRevokeBlock(this)">解除</button>
            </div>`;
        $("#blacklistBody").append(blackHTML);
    }
}
// 渲染人員對話記錄
var renderMessage = async function (message, slide) {
    let messageHTML = "";
    // the message sent by other
    if (message.messageSender != navScop.loginId) {
        // text message
        if (message.messageContent.indexOf("<img") == -1) {
            messageHTML = `
                <div class="mb-1" data-messageid="${message.messageId}">
                    <div class="d-flex">
                        <span class="bg-secondary text-white rounded px-3 py-2">${message.messageContent}</span>                    
                        <span class="col-2 px-2 align-self-end">${message.messageTime.HHmm(8)}</span>
                    </div>
                </div>`;
        }
        // image message
        else {
            messageHTML = `
                <div class="mb-1" data-messageid="${message.messageId}" style="display: flex;">
                    <div class="d-flex">
                        <span class="bg-secondary text-white rounded px-1 py-1">${message.messageContent}</span>
                        <span class="col-2 px-2 align-self-end">${message.messageTime.HHmm(8)}</span>
                    </div>
                </div>`;
        }
    }
    // the message sent by me
    else {
        // text message
        if (message.messageContent.indexOf("<img") == -1) {
            messageHTML = `
                <div class="myMessage mb-1" data-messageid="${message.messageId}">
                    <div class="d-flex flex-row-reverse">
                        <span class="rounded px-3 py-2" style="border: 4px solid black;">${message.messageContent}</span>
                        <span class="col-2 px-2 align-self-end" style="text-align:right">${message.messageTime.HHmm(8)}</span>
                    </div>
                </div>`;
        }
        // copy paste image
        else if (typeof message.messageTime == "object") {
            messageHTML = `
                <div class="myMessage mb-1" data-messageid="${message.messageId}">
                    <div class="d-flex flex-row-reverse">
                        <span class="rounded" style="border: 4px solid black;">${message.messageContent}</span>
                        <span class="col-2 px-2 align-self-end" style="text-align:right">${message.messageTime.HHmm(8)}</span>
                    </div>
                </div>`;
        }
        // image message, 純圖片, myNewImg 此回傳的日期格式為字串與其他回傳的不同
        else {
            messageHTML = `
                <div class="myMessage mb-1" data-messageid="${message.messageId}">
                    <div class="d-flex flex-row-reverse">
                        <span class="rounded" style="border: 4px solid black;">${message.messageContent}</span>
                        <span class="col-2 px-2 align-self-end" style="text-align:right">${message.messageTime.indexOf("Z") != -1 ? message.messageTime.HHmm() : message.messageTime.HHmm(8)}</span>
                    </div>
                </div>`;
        }
    }
    // append with slideDown
    if (slide) {
        // add a temp space to show slideDown
        var newElm = document.createElement("div");
        newElm.innerHTML = messageHTML;
        htmlHeight = getNodeHeight(newElm) + "px";
        await $(`<div id='tempMsg'style='height:${htmlHeight}'></div>`).appendTo("#chattingArea")
        await ShowChattingBottom();
        await delay(3);
        await $(messageHTML).css("display", "none").appendTo("#chattingArea").slideDown();
        $("#tempMsg").remove();
        await delay(600);

        return;
    }

    $("#chattingArea").append(messageHTML);
}
// 更新對話記錄人員list
var renderTheChatMember = async function () {
    // remove old memder msg
    $(`div[data-memberid="${scop.currentChatMemId}"]`).remove();
    // prepend new one
    let chatMemberHTML = `
        <div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2 w-100" data-memberid="${scop.currentChatMemId}" onclick="showSingleMemberMsg(this)">
            <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                style="aspect-ratio:1;color: #fff;width:35px">
                <div class="font-weight-bold">
                    ${avatar.innerText}
                </div>
            </div>
            <div class="pl-1 pl-sm-4">
                <div class="font-weight-bold">${member.innerText}</div>
                <div>1秒前</div>
            </div>
        </div>`;
    $("#chattingMembers").prepend(chatMemberHTML);
}
// 渲染對話記錄人員list
var renderChatMember = async function (chatMembers) {
    if (chatMembers.length == 0) {
        $("#chattingMembers").append('<div id="noChattingMember" class="py-5 d-flex justify-content-center">目前尚無通知記錄</div>');
        return;
    }

    $("#chattingMembers").empty();
    for (const chatMember of chatMembers) {
        let chatMemberHTML = `
        <div class="data-memberid cursor-pointer d-flex align-items-center px-3 py-2 w-100" data-memberid="${chatMember.memberId}" onclick="showSingleMemberMsg(this)">
            <div class="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
                style="aspect-ratio:1;color: #fff;width:35px">
                <div class="font-weight-bold">
                    ${chatMember.memberAccount[0].toUpperCase()}
                </div>
            </div>
            <div class="pl-1 pl-sm-4">
                <div class="font-weight-bold">${chatMember.memberNickname}</div>
                <div>${chatMember.msgTimeDiff}</div>
            </div>`;
        if (chatMember.unreadCount > 0)
            chatMemberHTML += `    
            <div class="bg-danger rounded-circle text-center"style="aspect-ratio:1;color:#fff;margin-left:auto;width:24px">
                ${chatMember.unreadCount}
            </div>
        </div>`;
        $("#chattingMembers").prepend(chatMemberHTML);
    }
}
//#endregion

//#region call API
var getBlacklist = async function () {
    // call api get related data
    let res = await BlacklistService.getBlacklist();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of user's blacklist configs
    return res;
}
var postBlacklist = async function (blacklist) {
    // call api get related data
    let res = await BlacklistService.postBlacklist(blacklist);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return the new blacklist config
    return res;
}
var deleteBlacklist = async function (blackId) {
    // call api get related data
    let res = await BlacklistService.deleteBlacklist(blackId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var getMembersMsg = async function () {
    // call api get related data
    let res = await ChatService.getMembersMsg();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var getSingleMemberMsg = async function (memberId) {
    // call api get related data
    let res = await ChatService.getSingleMemberMsg(memberId);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var getNewMsg = async function (updateTime) {
    // call api get related data
    let res = await ChatService.getNewMsg(updateTime);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of member msg for update member msg
    return res;
}
var putMsgRead = async function (senderId) {
    // call api get related data
    let res = (await ChatService.putMsgRead(senderId)).json();
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of message for displaying the message
    return res;
}
var putMsgRevoke = async function (messageId) {
    // call api get related data
    let res = await ChatService.putMsgRevoke(messageId);
    if (!res.status.toString().startsWith("2")) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    return true;
}
var postTheMessage = async function (message) {
    // call api get related data
    let res = await ChatService.postMessage(message);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the message
    return res;
}
var uploadImage = async function (formdata) {
    // call api get related data
    let res = await ChatService.uploadImage(formdata);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return list of image url.
    return res;
}
var postMsgImage = async function (imageFiles) {
    // call api get related data
    let res = await ChatService.postMsgImage(imageFiles);
    if (res.status != undefined) { alert(`[${res.status}]後端執行異常，請聯絡系統人員，感謝!`); return false; }
    // return built model for displaying the message
    return res;
}
//#endregion

//#region Custom tool function
// Check if login ?
var checkLogin = function () {
    if (navScop.loginId == -1) {
        alert("請先登入!");
        return false;
    }
    return true;
}
function updateThechattingMember(chatMember) {
    let chattingMember = chattingMembersSplice(scop.currentChatMemId);
    chattingMember.messageContent = chatMember.messageContent;
    chattingMember.messageTime = chatMember.messageTime;
    chattingMember.msgTimeDiff = "1秒前";
    scop.chattingMembers.push(chattingMember);
}
function chattingMembersSplice(memberid) {
    let index = scop.chattingMembers.findIndex(x => x.memberId == memberid);
    let chattingMember = scop.chattingMembers[index];
    scop.chattingMembers.splice(index, 1);
    return chattingMember;
}
function scrolltoId(id) {
    let access = document.getElementById(id);
    access.scrollIntoView();
    document.documentElement.scrollTop = 0; // 外層scroll
}
// Save dataURL image. Replace image src dataURL to url link.
async function elmDataURLToLink(html) {
    let divEltment = document.createElement("div");
    divEltment.innerHTML = `<div>${html}</div>`;
    let imgTags = divEltment.getElementsByTagName("img");

    let imageURLs = []; // 回復的image url link
    let index = 0;
    let formdata = new FormData();

    // create image file with base64 which in article content.
    for (const imgTag of imgTags) {
        // if it's base64.
        if (imgTag.src.startsWith("data")) {
            let file = await urlToFile(imgTag.src, `lab.png${index}`, 'image/png');
            formdata.append(`file${index}`, file);
            index++;
        }
    }
    if (index > 0) {
        index = 0;
        // call api save image, return url
        let result = await uploadImage(formdata);
        if (!!result) {
            imageURLs = result;
        }
        // html <img> change base64 to backend link.
        // 傳送包含class或style設定的img兩個以上，backend會出現"Unexpected token 'M'"的錯誤，最後使用CSS檔統一設定
        for (const imgTag of imgTags) {
            if (imgTag.src.startsWith("data")) {
                let urlImg = document.createElement("img");
                urlImg.src = imageURLs[index];
                urlImg.setAttribute("onclick", "showPicModal(this)");
                imgTag.before(urlImg);
                imgTag.remove();
                index++;
            }
        }
    }

    return divEltment.childNodes[0].innerHTML;
}
// Context menu for chattingArea
function BindingMsgRightMenu(chattingMsgArea) {
    let bodyArea = document.querySelector("body");
    const chattingMembersMenu = scop.chattingMembersMenu;
    const chattingMsgsMenu = scop.chattingMsgsMenu;
    // var chattingMsgArea = documenchattingMsgAreachattingMsgAreat.getElementsByClassName("data-messageid");
    for (const itemValue of chattingMsgArea) {
        itemValue.childNodes[1].childNodes[1].addEventListener("contextmenu", (e) => {
            e.preventDefault();
            // get the message id
            scop.messageid = $(e.currentTarget).parent().parent().data("messageid");
            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMsgsMenu);

            chattingMsgsMenu.style.top = `${normalizedY}px`;
            chattingMsgsMenu.style.left = `${normalizedX}px`;

            chattingMsgsMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMsgsMenu.classList.add("visible");
            }, "50");
        });
    }
}
// Context menu for chattingMembers
function BindingMemberRightMenu(chattingMembersArea) {
    let bodyArea = document.querySelector("body");
    const chattingMembersMenu = scop.chattingMembersMenu;
    const chattingMsgsMenu = scop.chattingMsgsMenu;
    // var chattingMembersArea = document.getElementsByClassName("data-memberid");
    for (const itemValue of chattingMembersArea) {
        itemValue.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            // get the member id
            scop.memberid = $(e.currentTarget).data("memberid");
            const { clientX: mouseX, clientY: mouseY } = e;
            const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY, bodyArea, chattingMembersMenu);

            chattingMembersMenu.style.top = `${normalizedY}px`;
            chattingMembersMenu.style.left = `${normalizedX}px`;

            chattingMsgsMenu.classList.remove("visible");
            chattingMembersMenu.classList.remove("visible");
            setTimeout(() => {
                chattingMembersMenu.classList.add("visible");
            }, "50");
        });
    }
}
const normalizePozition = (mouseX, mouseY, area, contextMenu) => {
    // compute what is the mouse position relative to the container element (scope)
    const {
        left: scopOffsetX,
        top: scopeOffsetY
    } = area.getBoundingClientRect();

    const scopeX = mouseX - scopOffsetX;
    const scopeY = mouseY - scopeOffsetY;

    // check if the element will go out of bounds
    const outOfBoundsOnX =
        scopeX + contextMenu.clientWidth > area.clientWidth;

    const outOfBoundsOnY =
        scopeY + contextMenu.clientHeight > area.clientHeight;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    // normalize on X
    if (outOfBoundsOnX) {
        normalizedX =
            scopOffsetX + area.clientWidth - contextMenu.clientWidth;
    }

    // normalize on Y
    if (outOfBoundsOnY) {
        normalizedY =
            scopeOffsetY + area.clientHeight - contextMenu.clientHeight;
    }

    return { normalizedX, normalizedY };
}
async function ShowChattingBottom() {
    let chattingArea = document.querySelector('#chattingArea');
    chattingArea.scrollTop = chattingArea.scrollHeight - chattingArea.clientHeight;
}
//#endregion

//#endregion

document.addEventListener("DOMContentLoaded", async function () {
    // $('#blacklist').modal({
    //     show: true, // 預設開啟modal
    // })

    // 是否需要把backend的session設定到frontend ?
    // navScop.loginId = $("#loginId").val();
    // navScop.loginAccount = $("#loginAccount").val();
    // navScop.loginNickname = $("#loginNickname").val();
    // console.log(navScop.loginId, navScop.loginAccount, navScop.loginNickname);
    // $("#findMemberId").val();
    // $("#findMemberAccount").val();
    // $("#findMemberNickname").val();

    //#region Event Binding
    // Initial blacklistModal show setting
    $('#blacklistModal').on('show.bs.modal', async function (e) {
        $("#blacklistBody").empty();
        let result = await getBlacklist();
        if (!!result) {
            renderBlacklist(result);
        }
    });

    // Mousedown insert image at article editor. Don't preventDefault focus, or upload file can't find the plase to insert. 
    // Don't use onclick, focus already set on mouse down.
    $("#btnPostImage").on("mousedown", function (e) {
        document.getElementById('postImage').click();
        e.preventDefault();
    })

    // Setup event for right clicke context menu
    let bodyArea = document.querySelector("body");
    const chattingMembersMenu = document.getElementById("chattingMembersMenu");
    const chattingMsgsMenu = document.getElementById("chattingAreaMenu");
    // hide context menu while not click on specific area
    bodyArea.addEventListener("click", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    // hide context menu while scrolling
    document.addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    document.getElementById("chattingArea").addEventListener("scroll", (e) => {
        chattingMembersMenu.classList.remove("visible");
        chattingMsgsMenu.classList.remove("visible");
    });
    scop.chattingMembersMenu = chattingMembersMenu;
    scop.chattingMsgsMenu = chattingMsgsMenu;

    //#endregion


    // Page Initial
    // 載入人員對話目錄
    await showChatMember();
    // 確認有無指定對話人員，進入聊天室，-1為沒有指定
    await showPersonAtEntry($("#findMemberId").val());
    // Check new message per 3 sec
    setInterval(showNewMsg, 3 * 1000);
});