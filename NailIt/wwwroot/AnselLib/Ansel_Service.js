// 前後Server相同
function getHost() {
    var url = window.location.href;
    var arr = url.split("/");
    return arr[0] + "//" + arr[2]
}
const apiServer = getHost();

// 前後Server不同，指定Server
//const apiServer = "https://localhost:44308";

//#region fetch api
// If "status" attribute can be found in return, it's not a success response.
async function fetchGet(uri) {
    let res = await fetch(`${apiServer}${uri}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.json();
}
async function fetchPost(uri, value) {
    let res = await fetch(`${apiServer}${uri}`, {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.json();
}
async function fetchPut(uri, value) {
    let res = await fetch(`${apiServer}${uri}`, {
        method: 'PUT',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res; //回傳NoContent
}
async function fetchDelete(uri) {
    let res = await fetch(`${apiServer}${uri}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res; //回傳NoContent
}
async function fetchPostMul(uri, value) {
    let res = await fetch(`${apiServer}${uri}`, {
        method: 'POST',
        body: value, //fetch傳遞form data，不用特別設定headers下的Content-Type
    });
    return res.json();
}
//#endregion

//#region Api Service
class SocialService {
    static getCodes(code) {
        return fetchGet(`/api/Social/GetCodeTable/${code}`);
    }
    static uploadImage(data) {
        return fetchPostMul(`/api/Social/UploadImage`, data);
    }
    static postSocialReport(data) {
        return fetchPost(`/api/Social/PostSocialReport`, data);
    }
}
class ArticleService {
    static getArticlesWithKeyword(boardSort, page, order, searchValue) {
        return fetchGet(`/api/ArticleTables/${boardSort}/${page}/${order}/${searchValue}`);
    }
    static getArticles(boardSort, page, order) {
        return fetchGet(`/api/ArticleTables/${boardSort}/${page}/${order}`);
    }
    static postArticle(data) {
        return fetchPost(`/api/ArticleTables`, data);
    }
    static putArticle(id, data) {
        return fetchPut(`/api/ArticleTables/${id}`, data);
    }
    static deleteArticle(id) {
        return fetchDelete(`/api/ArticleTables/${id}`);
    }
}
class ArticleSocialService {
    static getMyArticlesWithKeyword(articleAuthorID, page, order, searchValue) {
        return fetchGet(`/api/ArticleSocial/GetMyArticles/${articleAuthorID}/${page}/${order}/${searchValue}`);
    }
    static getMyArticles(articleAuthorID, page, order) {
        return fetchGet(`/api/ArticleSocial/GetMyArticles/${articleAuthorID}/${page}/${order}`);
    }
}
class ArticleLikeService {
    static postArticleLike(data) {
        return fetchPost(`/api/ArticleLikeTables`, data);
    }
    static deleteArticleLike(articleId, memberId) {
        return fetchDelete(`/api/ArticleLikeTables/${articleId}/${memberId}`);
    }
}
class BlacklistService {
    static getBlacklist() {
        return fetchGet(`/api/Blacklist`);
    }
    static postBlacklist(data) {
        return fetchPost(`/api/Blacklist`, data);
    }
    static deleteBlacklist(blackId) {
        return fetchDelete(`/api/Blacklist/${blackId}`);
    }
}
class ChatService {
    static getMembersMsg() {
        return fetchGet(`/api/Chat/GetMembersMsg`);
    }
    static getSingleMemberMsg(memberId) {
        return fetchGet(`/api/Chat/GetSingleMemberMsg/${memberId}`);
    }
    static getNewMsg(updateTime) {
        return fetchGet(`/api/Chat/GetNewMsg/${updateTime}`);
    }
    static putMsgRead(senderId) {
        return fetchPut(`/api/Chat/PutMsgRead/${senderId}`);
    }
    static putMsgRevoke(id) {
        return fetchPut(`/api/Chat/PutMsgRevoke/${id}`);
    }
    static postMessage(data) {
        return fetchPost(`/api/Chat/PostMessage`, data);
    }
    static uploadImage(data) {
        return fetchPostMul(`/api/Chat/UploadImage`, data);
    }
    static postMsgImage(data) {
        return fetchPostMul(`/api/Chat/PostMsgImage`, data);
    }
}
class ReplyService {
    static getReplies(id) {
        return fetchGet(`/api/ReplyTables/${id}`);
    }
    static postReply(data) {
        return fetchPost(`/api/ReplyTables`, data);
    }
    static deleteReply(id) {
        return fetchDelete(`/api/ReplyTables/${id}`);
    }
}
class ReplyLikeService {
    static postReplyLike(data) {
        return fetchPost(`/api/ReplyLikeTables`, data);
    }
    static deleteReplyLike(replyId, memberId) {
        return fetchDelete(`/api/ReplyLikeTables/${replyId}/${memberId}`);
    }
}
//#endregion


//#region Model Schemas

// setup Model Schemas
function isUndefined(obj) {
    return obj == undefined;
}
function initialNum(value) {
    return isUndefined(value) ? 0 : value;
}
function initialStr(value) {
    return isUndefined(value) ? "" : value;
}
function initialDate(value) {
    return isUndefined(value) ? new Date() : value;
}
function initialBool(value) {
    return isUndefined(value) ? false : value;
}

class ArticleTable {
    constructor(data) {
        this.articleId = initialNum(data.articleId);
        this.articleBoardC = initialStr(data.articleBoardC);
        this.articleAuthor = initialNum(data.articleAuthor);
        this.articleTitle = initialStr(data.articleTitle);
        this.articleReplyCount = initialNum(data.articleReplyCount);
        this.articleLikesCount = initialNum(data.articleLikesCount);
        this.articleBuildTime = initialDate(data.articleBuildTime);
        this.articleLastEdit = initialDate(data.articleLastEdit);
        this.articleContent = initialStr(data.articleContent);
    }
}
class ArticleLikeTable {
    constructor(data) {
        this.articleLikeId = initialNum(data.articleLikeId);
        this.articleId = initialNum(data.articleId);
        this.memberId = initialNum(data.memberId);
    }
}
class ArticlePicTable {
    constructor(data) {
        this.artclePicId = initialNum(data.artclePicId);
        this.articleId = initialNum(data.articleId);
        this.articlePicPath = initialStr(data.articlePicPath);
    }
}
class MessageBlacklistTable {
    constructor(data) {
        this.blacklistId = initialNum(data.blacklistId);
        this.blacklistBuilder = initialNum(data.blacklistBuilder);
        this.blacklistTarget = initialNum(data.blacklistTarget);
    }
}
class MessageTable {
    constructor(data) {
        this.messageId = initialNum(data.messageId);
        this.messageSender = initialNum(data.messageSender);
        this.messageReceiver = initialNum(data.messageReceiver);
        this.messageContent = initialStr(data.messageContent);
        this.messageTime = initialDate(data.messageTime);
        this.messageRead = initialBool(data.messageRead);
    }
}
class ReplyTable {
    constructor(data) {
        this.replyId = initialNum(data.replyId);
        this.articleId = initialNum(data.articleId);
        this.memberId = initialNum(data.memberId);
        this.replyContent = initialStr(data.replyContent);
        this.replyBuildTime = initialDate(data.replyBuildTime);
        this.replyLastEdit = initialDate(data.replyLastEdit);
        this.replyLikesCount = initialNum(data.replyLikesCount);
    }
}
class ReplyLikeTable {
    constructor(data) {
        this.replyLikeId = initialNum(data.replyLikeId);
        this.replyId = initialNum(data.replyId);
        this.memberId = initialNum(data.memberId);
    }
}
class ReportTable {
    constructor(data) {
        this.reportId = initialNum(data.reportId);
        this.reportBuilder = initialNum(data.reportBuilder);
        this.reportTarget = initialNum(data.reportTarget);
        this.reportItem = initialNum(data.reportItem);
        this.reportPlaceC = initialStr(data.reportPlaceC);
        this.reportReasonC = initialStr(data.reportReasonC);
        this.reportContent = initialStr(data.reportContent);
        this.reportBuildTime = initialDate(data.reportBuildTime);
        this.reportCheckTime = initialDate(data.reportCheckTime);
        this.managerId = initialNum(data.managerId);
        this.reportResult = initialBool(data.reportResult);
    }
}
//#endregion