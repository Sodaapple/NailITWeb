
stander();

function stander() {
    birthSet();// 生日最大值為今天以前
    acInput.addEventListener("keyup",acTest);//帳號只能輸入大小寫英文字母、數字或底線
    pwInput.addEventListener("keyup", pwTest);//密碼只能輸入大小寫英文字母、數字或底線
    pwInput2.addEventListener("keyup", pwCheck);//密碼確認必須與密碼一樣
    nameInput.addEventListener("keyup", nameTest);//姓名只能是中文字
    phoneInput.addEventListener("keyup", phoneTest);//電話必須為09開頭且共10字
    questionInput.addEventListener("keyup", questionTest);//不得為空
    answerInput.addEventListener("keyup", answerTest);//不得為空
}
function birthSet() { // 生日最大值為今天以前
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    if (month < 10)
        birthInput.max = year + "-" + "0" + month + "-" + day;
    else
        birthInput.max = year + "-" + month + "-" + day;
}
function acTest() {//帳號只能輸入大小寫英文字母、數字或底線
    var acReg = /^\w+$/;
    var acInputDes = document.getElementById("acInputDes");
    acInputDes.style.color = (!acReg.test(acInput.value) || acInput.value.length < 8) ? "red" : "black";
}
function pwTest() {//帳號只能輸入大小寫英文字母、數字或底線
    var pwReg = /^\w+$/;
    pwInputDes.style.color = (!pwReg.test(pwInput.value) || pwInput.value.length < 8) ? "red" : "black";
}
function pwCheck() {//密碼確認需要跟密碼一致
    pwInput2Des.style.color = pwInput2.value == pwInput.value ? "black" : "red";
}
function nameTest() {//姓名只能輸入中文字
    var nameReg = /[\u4e00-\u9Fa5]+/g;
    var nowValue = nameInput.value;
    var matchValue = nowValue.match(nameReg);
    nameInputDes.style.color = (nowValue == matchValue )? "black" : "red";
}
function phoneTest() {//電話必須為09開頭，共10字
    var phoneReg = /^09[0-9]{8}$/;
    phoneInputDes.style.color = phoneReg.test(phoneInput.value) ? "black" : "red";
}
function questionTest() {//問題不得為空
    questionInputDes.style.color = (!questionInput == "") ? "black" : "red";
}
function answerTest() {//答案不得為空
    answerInputDes.style.color = (!answerInput == "") ? "black" : "red";
}
function genderValue() {//性別：1為男生0為女生
    if (MemberGender.value == "1")
        return true;
    else
        return false;
}
function birthValue() {//生日未填則為null
    if (birthInput.value == "")
        return null;
    else
        return birthInput.value;
}
function nickValue() {//暱稱沒填則自動帶入姓名
    if (nickInput.value == "")
        return nameInput.value;
    else
        return nickInput.value;
}
function RegisterPost() { //呼叫post api 的方法
    if (pwInput2Des.style.color == "red" || pwInputDes.style.color == "red" || acInputDes.style.color == "red" ||
        nameInputDes.style.color == "red" || phoneInputDes.style.color == "red" || questionInputDes.style.color == "red" ||
        answerInputDes.style.color=="red"
        ) {//有欄位不符合格式
       
        toastr.warning("請輸入正確資訊");
    }
    else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        
        var raw = JSON.stringify({
            "MemberAccount": acInput.value,
            "MemberPassword": pwInput.value,
            "MemberName": nameInput.value,
            "MemberNickname": nickValue(),
            "MemberGender": genderValue(),
            "MemberPhone": phoneInput.value,
            "MemberBirth": birthValue(),
            "MemberEmail": null,
            "MemberScore": null,
            "MemberManicurist": false,
            "MemberLogincredit": null,
            "MemberReportpoint": 0,
            "MemberBanned": null,
            "member_Verify": null,
            "member_Question": questionInput.value,
            "member_Answer": answerInput.value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://localhost:44308/api/YueMember", requestOptions)
            .then(response => response.text())
            .then(function (result) {
                if ("true" != result)
                    toastr.warning("帳號重複了呦");
                else {
                    setTimeout(() => { window.location.replace("/Yuelogin.html") }, 3000);
                    toastr.success("註冊成功，三秒後將會跳轉頁面");
                }
            })
            .catch(error => console.log('error', error));
    }
}