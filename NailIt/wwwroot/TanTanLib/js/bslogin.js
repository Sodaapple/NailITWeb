var mydata3 = new Vue({
    el: "#mydata3",
    data: {
        myID: "", pswd: "",
        login: [{ account: "", password: "" }],

    }
})

//登入
function plzlogin() {
    console.log(mydata3.myID);
    console.log(mydata3.pswd);
    mydata3.login[0].account = mydata3.myID;
    mydata3.login[0].password = mydata3.pswd;

    console.log(mydata3.login[0]);
    $.ajax({
        type: "post",
        async: false,
        url: "/api/Letmeinqq/post",
        contentType: "application/json",
        data: JSON.stringify(mydata3.login[0]),
        success: function (e) {
            mydata3.name = e;
            console.log(e);

            if (mydata3.name == "-1") {
                alert("帳號密碼錯誤");
            } else {

                window.location = "/TanTanLib/html/backstage-report.html"


            }
        }

    });
}