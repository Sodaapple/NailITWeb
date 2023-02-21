var mydata = new Vue({
    el: "#mydata",
    data: {
        //1.審核-----------------------------------------------------------------------------------------------------------------------------------------------------
        report: [{}],
        //[{"reportId":1,"reportBuilder":1,"reportTarget":2,"reportItem":111012801,"reportPlaceC":"D3","reportReasonC":"G2","reportContent":"邪惡","reportBuildTime":"2023-01-18 20:28","reportCheckTime":"","managerId":null,"reportResult":null,"codeUseIn":"D3","codeRepresent":"設計師主頁","memberName":"田美麗","managerName":null}]
        reportput: [{ "reportResult": true, "reportId": "", "reportCheckTime": "", "managerId": "1" }],
        repertget: [{ "dateS": "1900-01-01", "dateE": "3000-01-01", "reportP": "X0", "reportR": true, "reportRN": "nu" }],
        reportnum: "", reportpage: "",
        onereport: [{}],
        syscode: [{}],
        reportmodel: "",
        AAA: [],
        //2.通知-----------------------------------------------------------------------------------------------------------------------------------------------------
        notice: [{}],
        //{ "noticeId": 1, "noticeScope": 2, "noticeTitle": "聖誕節快樂！", "noticeContent": "祝全體會員聖誕節快樂！", "noticeBuildTime": "2023-01-25T11:44:59.453", "noticePushTime": "2023-01-25T11:44:59.453", "noticeState": true },
        onenotice: [{}],
        noticenum: "", noticepage: "",
        noticemodel: "",
        //新增通知
        noticetitle: [],
        noticetext: [],
        noticescope: [],
        noticetime: [],
        //增加通知
        nownotice: "",
        noticepost: [{
            "noticeScope": 0, "noticeTitle": "HAHAHA", "noticeContent": "HAHAHA",
            "noticeBuildTime": "2023-01-25T15:41:38.329Z", "noticePushTime": "2023-01-25T15:4", "noticeState": false, "noticeManagerId": 1
        }],
        //增加通知是否read那TABLE
        noticereadpost: [{ "noticeId": 5, "noticeReadMember": 2, "noticeReadRead": false }],
        //普通會員有哪些 memberId member_Manicurist ==0 是沒開通
        //memberId
        nocheckmember: [{}],
        //美甲師會員有哪些 member_ID member_Manicurist == 1是開通 
        checkmember: [{}],
        //篩選
        noticeget: [{ "NdataS": "1900-01-01", "NdataE": "3000-01-01", "NoiceMem": 3, "NoiceState": true, "NoiceStateN": "NOPE" }],
        //3.訂單-----------------------------------------------------------------------------------------------------------------------------------------------------
        order: [{}],
        order2: [{}],
        //[{
        //    "orderId": 1, "memberId": 1, "manicuristId": 2, "planId": 1, "orderPrice": 2500.0000, "orderDeposit": 200.0000,
        //    "orderPartC": "C1", "orderRemovalC": "B2", "orderType": true, "orderItem": 1, "orderItemName": "繽紛雪人",
        //    "orderOrderTime": "2023-01-17T00:00:00", "orderAcceptTime": null, "orderDoneTime": null, "orderCompleteTime": null,
        //    "orderStateC": "A0", "orderCancelTime": null
        //},
        ordernum: "", orderpage: "",
        ordermodel: "",
        oneorder: [{}],
        //篩選
        orderget: [{ "OdataS": "1900-01-01", "OdataE": "3000-01-01", "orderStateC": "AA", "orderId": 0 }],
        //4.會員-----------------------------------------------------------------------------------------------------------------------------------------------------
        member: [{}],
        membernum: "", memberpage: "",
        membermodel: "",
        onemember: [{}],
        memget: [{ "memberId": 0, "memberManicurist": "nope", "memberStatus": 0 }],
        //5.管理員-----------------------------------------------------------------------------------------------------------------------------------------------------
        manager: [{}],
        managernum: "", managerpage: "",
        managermodel: "",
        onemanager: [{}],
        managerput: [{ "managerId": 1, "managerPassword": "1234", "managerName": "string11", "managerPurview": 1 }],
        nowmanagerId: "",
        managerpost: [{ "managerAccount": "", "managerPassword": "", "managerName": "", "managerPurview": "", "managerBuildTime": "" }],
        managerget: [{ "managerId": 0, "managerName": "$", "managerPurview": 3 }],
        //登入--------------------------
        loginmame: "",
        loginid: "",
        //---------------------
        pageNum: 1.
    }
})

//GET訂單資料表
var pageNum = 0;
var urlorderresult = "1900-01-01/3000-01-01/AA/0";
var urlmemresult = "0/nope/0"

//登出-------------------------------------------------------------------------------------------------------------------------------------
function plzlogout() {
    $.ajax({
        type: "delete",
        async: false,
        url: "/api/Letmeinqq/delete",
        contentType: "application/json",
        success: function (e) {
            mydata.name = e;
            console.log(e);
            window.location = "/TanTanLib/html/bslogin.html"

        }


    });
}

//取得名字
function myfunction1() {
    $.ajax({
        type: "get",
        async: false,
        url: "/api/Letmeinqq/Logintext",
        success: function (e) {
            mydata.loginmame = e.ManagerName;
            mydata.loginid = e.ManagerId;

            console.log(e);
        }
    })
    /* console.log(HttpContext.User);*/
    //if (HttpContext.User.Identity.IsAuthenticated) {
    //    //这里通过Httpcontext.Use.cla可我们个Act中储到cooke的所有
    //    //claims键值对都读出来,比如我们刚才定义的UserName的值wangdacui就在这里读取出来了
    //
    //    //var userId = HttpContext.User.Claims.First();
    //    //var userName = HttpContext.User.Claims.Where(User => User.Type == "userName").First();
    //    //var roleId = HttpContext.User.Claims.Where(User => User.Type == "roleId ").First();
    //    //console.log(userId)
    //}
}

myfunction1();


////3.訂單--------------------------------------------------------------------------------------------------------------------------------
//GET訂單資料表
$.ajax({
    type: "get",
    url: "/api/OrderTables2",
    success: function (e) {
        mydata.order = e;
        console.log(e);
        //訂單總項目 跟 訂單頁數
        mydata.ordernum = e.length;
        if (mydata.ordernum >= 5) {
            if (mydata.ordernum / 5 <= 0) {
                mydata.orderpage = 1;
            } else {
                mydata.orderpage = Math.ceil(mydata.ordernum / 5);
            }

        } else {
            mydata.orderpage = 1
        };
        mydata.pageNum = 1;
    }
})
//GET take skip
$.ajax({
    type: "get",
    url: "/api/OrderTables2/2/0",
    success: function (e) {
        mydata.order2 = e;
        console.log(e);
    }
})
//GET單一訂單資料表
function revieworder(e) {
    mydata.ordermodel = e.value;
    console.log(mydata.ordermodel);

    $.ajax({
        type: "get",
        url: "/api/OrderTables2/" + mydata.ordermodel,
        success: function (e) {
            mydata.oneorder = e;
            console.log(e);

        }
    })

}
//GET訂單篩選
function selorder() {
    pageNum = 0;
    mydata.orderpage = 0;
    mydata.pageNum = 0;
    // orderget: [{ "OdataS": "1900-01-01", "OdataE": "3000-01-01", "orderStateC": "AA", "orderId": 0 }]
    var OdataS = $("#orderdatestart").val();
    var OdataE = $("#orderdateend").val();
    //value="0">一般會員,value="1">店家／設計師,value="2">全體
    var orderStateC = $("#orderstate").val();
    //value="3" selected>請選擇狀態,value="0">未通知,value="1">已通知
    var orderId = $("#orderId").val();
    console.log(OdataS);
    console.log(OdataE);
    console.log(orderStateC);
    console.log(orderId);

    //開始時間
    if (OdataS == "") {
        mydata.orderget[0].OdataS = "1900-01-01";
    } else {
        mydata.orderget[0].OdataS = OdataS
    }
    console.log(mydata.orderget[0].OdataS)

    //結束時間
    if (OdataE == "") {
        mydata.orderget[0].OdataE = "3000-01-01";
    } else {
        mydata.orderget[0].OdataE = OdataE
    }
    console.log(mydata.orderget[0].OdataE)
    //訂單狀態
    if (orderStateC == "AA") {
        mydata.orderget[0].orderStateC = "AA";
    } else {
        mydata.orderget[0].orderStateC = orderStateC;
    }
    console.log(mydata.orderget[0].orderStateC)

    //訂單編號
    if (orderId == "") {
        mydata.orderget[0].orderId = 0;
    } else {
        mydata.orderget[0].orderId = orderId;
    }

    urlorderresult = mydata.orderget[0].OdataS + "/" + mydata.orderget[0].OdataE + "/" + mydata.orderget[0].orderStateC + "/" + mydata.orderget[0].orderId;
    console.log(urlorderresult)

    $.ajax({
        type: "get",
        async: false,
        url: "/api/OrderTables2/condition/" + urlorderresult,
        success: function (e) {
            mydata.order2 = e;
            //console.log(e);
            //訂單總項目 跟 訂單頁數
            mydata.ordernum = e.length;
            if (mydata.ordernum > 5) {
                if (mydata.ordernum / 5 <= 0) {
                    mydata.orderpage = 1;
                } else {
                    mydata.orderpage = Math.ceil(mydata.ordernum / 5);
                }

            } else {
                mydata.orderpage = 1
            };
            mydata.pageNum = 1;
        }
    })

    //GET訂單篩選有skip take
    $.ajax({
        type: "get",
        async: false,
        url: "/api/OrderTables2/condition/" + urlorderresult + "/0",
        success: function (e) {
            mydata.order2 = e;
            console.log(e);
            mydata.pageNum = 1;
        }
    })
    console.log(mydata.orderpage)
    if (mydata.orderpage == 1) {
        $('#uporder').css('text-decoration-line', 'none');
        $('#uporder').attr("disabled", 'disabled')
        $('#uporder').css('color', 'gray');
        $('#nextorder').css('text-decoration-line', 'none');
        $('#nextorder').attr("disabled", 'disabled')
        $('#nextorder').css('color', 'gray');
    } else {
        $('#uporder').css('text-decoration-line', 'none');
        $('#uporder').attr("disabled", 'disabled')
        $('#uporder').css('color', 'gray');
        $('#nextorder').css('text-decoration-line', 'underline');
        $('#nextorder').attr('disabled', 'able');
        $('#nextorder').css('color', 'black');
    }
    mydata.orderget[0].OdataS = "1900-01-01";
    mydata.orderget[0].OdataE = "3000-01-01";
    mydata.orderget[0].orderStateC = "AA";
    mydata.orderget[0].orderId = 0;

}
/*下一頁*/
function nextorder() {

    if (mydata.orderpage <= pageNum + 1) {
        pageNum = pageNum;

    } else {
        pageNum++;
        mydata.pageNum = pageNum + 1;
    }

    console.log(pageNum)

    if (pageNum == mydata.orderpage - 1) {
        $('#nextorder').css('text-decoration-line', 'none');
        $('#nextorder').attr('disabled', 'disabled');
        $('#nextorder').css('color', 'gray');
        $('#uporder').css('text-decoration-line', 'underline');
        $('#uporder').attr('disabled', 'able');
        $('#uporder').css('color', 'black');
    } else if (pageNum + 1 > 0) {
        $('#uporder').css('text-decoration-line', 'underline');
        $('#uporder').attr('disabled', 'able');
        $('#uporder').css('color', 'black');
    }
    else if (pageNum == 0) {
        $('#uporder').css('text-decoration-line', 'none');
        $('#uporder').attr("disabled", 'disabled')

    }

    //如果最後一頁，那麼安建就鎖定。

    //$.ajax({
    //    type: "get",
    //    url: "/api/OrderTables2/2/" + pageNum,
    //    success: function (e) {
    //        mydata.order2 = e;
    //        console.log(e);
    //    }
    //})
    console.log(urlorderresult)
    $.ajax({
        type: "get",
        async: false,
        url: "/api/OrderTables2/condition/" + urlorderresult + "/" + pageNum,
        success: function (e) {
            mydata.order2 = e;
            console.log(e);

        }
    })
}
/*上一頁*/
function uporder() {

    console.log(pageNum)

    if (pageNum == 0) {
        pageNum = 0;
        mydata.pageNum = pageNum + 1;
    } else {
        pageNum--;
    }
    mydata.pageNum = pageNum + 1;

    if (pageNum == 0) {
        $('#uporder').css('text-decoration-line', 'none');
        $('#uporder').attr("disabled", 'disabled')
        $('#uporder').css('color', 'gray');
        $('#nextorder').css('text-decoration-line', 'underline');
        $('#nextorder').attr('disabled', 'able');
        $('#nextorder').css('color', 'black');
    } else if (pageNum > 1) {
        $('#uporder').css('text-decoration-line', 'underline');
        $('#uporder').attr('disabled', 'able');
        $('#nextorder').css('text-decoration-line', 'underline');
        $('#nextorder').attr('disabled', 'able');
        $('#nextorder').css('color', 'black');
    }

    console.log(pageNum)

    $.ajax({
        type: "get",
        async: false,
        url: "/api/OrderTables2/condition/" + urlorderresult + "/" + pageNum,
        success: function (e) {
            mydata.order2 = e;
            console.log(e);

        }
    })
}


////5.管理員--------------------------------------------------------------------------------------------------------------------------------
//GET 篩選會員資料表
function selman() {
    // managerget: [{ "managerId": 0, "managerName": "$", "managerPurview": 3 }],
    var managerId = $("#managerid").val();
    var managerName = $("#managername").val();
    //value="0">一般會員,value="1">店家／設計師,value="2">全體
    var managerPurview = $("#managerlimit").val();

    console.log(managerId);
    console.log(managerName);
    console.log(managerPurview);

    //會員編號
    if (managerId == "") {
        mydata.managerget[0].managerId = 0;
    } else {
        mydata.managerget[0].managerId = managerId;
    }
    //會員類型
    if (managerName == "") {
        mydata.managerget[0].managerName = "$";
    } else {
        mydata.managerget[0].managerName = managerName;
    }
    //會員狀態
    mydata.managerget[0].managerPurview = managerPurview;

    var urlmanresult = mydata.managerget[0].managerId + "/" + mydata.managerget[0].managerName + "/" + mydata.managerget[0].managerPurview;
    console.log(urlmanresult)

    $.ajax({
        type: "get",
        url: "/api/ManagerTables/condition/" + urlmanresult,
        success: function (e) {
            mydata.manager = e;
            console.log(e);
            //員工總項目 跟 訂單頁數
            mydata.managernum = e.length;
            if (mydata.managernum >= 5) {
                mydata.managerpage = Math.ceil(mydata.managernum / 5)
            } else {
                mydata.managerpage = 1
            };
        }
    })

    mydata.managerget[0].managerId = 0;
    mydata.managerget[0].managerName = "$";
    mydata.managerget[0].managerPurview = 3;
}

//獲得最新的managerId
function addmanmem() {
    //新增日期
    $("#addmandate").prop('value', notdate);

    //員工編號
    var managerdata = mydata.manager;
    var nowmanagerId = mydata.manager[(managerdata.length - 1)].managerId;
    mydata.nowmanagerId = nowmanagerId + 1;
}

//POST 會員資料表
function savemanager() {
    //新增日期
    var addnotdate = new Date();
    mydata.managerpost[0].managerBuildTime = addnotdate;
    console.log(mydata.managerpost[0]);
    $.ajax({
        type: "post",
        async: false,
        url: "/api/ManagerTables",
        contentType: "application/json",
        data: JSON.stringify(mydata.managerpost[0]),
        success: function () {
            window.location = "/TanTanLib/html/backstage-manager.html"
        }

    });

}

//PUT 會員資料表
function putmanager(e) {
    mydata.managermodel = e.value;
    console.log(mydata.managermodel);
    mydata.managerput[0].managerId = mydata.managermodel;
    mydata.managerput[0].managerPassword = mydata.onemanager[0].managerPassword;
    mydata.managerput[0].managerName = mydata.onemanager[0].managerName;
    mydata.managerput[0].managerPurview = mydata.onemanager[0].managerPurview;
    console.log(mydata.managerput[0]);
    $.ajax({
        type: "put",
        url: "/api/ManagerTables/put/" + mydata.managermodel,
        contentType: "application/json",
        data: JSON.stringify(mydata.managerput[0]),
        success: function () {
            window.location = "/TanTanLib/html/backstage-manager.html"
        }
    })
}

//GET會員資料表
$.ajax({
    type: "get",
    url: "/api/ManagerTables",
    success: function (e) {
        mydata.manager = e;
        console.log(e);

        //訂單總項目 跟 訂單頁數
        mydata.managernum = e.length;
        if (mydata.managernum >= 5) {
            mydata.managerpage = Math.ceil(mydata.managernum / 5)
        } else {
            mydata.managerpage = 1
        };
    }
})

//DELETE會員資料表
function delmanmem(e) {
    mydata.managermodel = e.value;
    console.log(mydata.managermodel);

    $.ajax({
        type: "delete",
        url: "/api/ManagerTables/" + mydata.managermodel,
        success: function () {
            window.location = "/TanTanLib/html/backstage-manager.html"
        }
    })
}

//GET單一會員資料表
function reviewman(e) {
    mydata.managermodel = e.value;
    console.log(mydata.managermodel);
    $.ajax({
        type: "get",
        url: "/api/ManagerTables/oneget/" + mydata.managermodel,
        success: function (e) {
            mydata.onemanager = e;
            console.log(e);
        }

    })
}


////4.會員--------------------------------------------------------------------------------------------------------------------------------


//GET會員資料表
$.ajax({
    type: "get",
    url: "/api/MemberTables2",
    success: function (e) {
        mydata.member = e;
        console.log(e);


        //訂單總項目 跟 訂單頁數
        mydata.membernum = e.length;
        if (mydata.membernum >= 5) {
            mydata.memberpage = Math.ceil(mydata.membernum / 5)
        } else {
            mydata.memberpage = 1
        };
    }
})

//GET會員 take skip
$.ajax({
    type: "get",
    url: "/api/MemberTables2/2/0",
    success: function (e) {
        mydata.member = e;
        console.log(e);
    }
})

//GET 篩選會員資料表
function selmem() {
    // memget: [{ "memberId": 0, "memberManicurist": "nope", "memberStatus": 0}],
    var memberId = $("#memid").val();
    var memberManicurist = $("#memtype").val();
    //value="0">一般會員,value="1">店家／設計師,value="2">全體
    var memberStatus = $("#memstate").val();

    console.log(memberId);
    console.log(memberManicurist);
    console.log(memberStatus);

    //會員編號
    if (memberId == "") {
        mydata.memget[0].memberId = 0;
    } else {
        mydata.memget[0].memberId = memberId;
    }
    //會員類型
    if (memberManicurist == "nope") {
        mydata.memget[0].memberManicurist = "nope";
    } else {
        mydata.memget[0].memberManicurist = memberManicurist;
    }
    //會員狀態
    mydata.memget[0].memberStatus = memberStatus;

    var urlmemresult = mydata.memget[0].memberId + "/" + mydata.memget[0].memberManicurist + "/" + mydata.memget[0].memberStatus;
    console.log(urlmemresult)

    $.ajax({
        type: "get",
        async: false,
        url: "/api/MemberTables2/condition/" + urlmemresult,
        success: function (e) {
            mydata.member = e;
            console.log(e);
            //訂單總項目 跟 訂單頁數
            mydata.membernum = e.length;
            if (mydata.membernum >= 5) {
                mydata.memberpage = Math.ceil(mydata.membernum / 5)
            } else {
                mydata.memberpage = 1
            };
            mydata.pageNum = 1;
        }
    })

    //GET訂單篩選有skip take
    $.ajax({
        type: "get",
        async: false,
        url: "/api/MemberTables2/condition/" + urlmemresult + "/0",
        success: function (e) {
            mydata.member = e;
            console.log(e);
            mydata.pageNum = 1;
        }
    })
    console.log(mydata.memberpage)
    if (mydata.memberpage == 1) {
        $('#upmem').css('text-decoration-line', 'none');
        $('#upmem').attr("disabled", 'disabled')
        $('#upmem').css('color', 'gray');
        $('#nextmem').css('text-decoration-line', 'none');
        $('#nextmem').attr("disabled", 'disabled')
        $('#nextmem').css('color', 'gray');
    } else {
        $('#upmem').css('text-decoration-line', 'none');
        $('#upmem').attr("disabled", 'disabled')
        $('#upmem').css('color', 'gray');
        $('#nextmem').css('text-decoration-line', 'underline');
        $('#nextmem').attr('disabled', 'able');
        $('#nextmem').css('color', 'black');
    }

    mydata.memget[0].memberId = 0;
    mydata.memget[0].memberManicurist = "nope";
    mydata.memget[0].urlmemresult = 0;
}

/*下一頁*/
function nextmem() {

    if (mydata.memberpage <= pageNum + 1) {
        pageNum = pageNum;

    } else {
        pageNum++;
        mydata.pageNum = pageNum + 1;
    }

    console.log(pageNum)

    if (pageNum == mydata.memberpage - 1) {
        $('#nextmem').css('text-decoration-line', 'none');
        $('#nextmem').attr('disabled', 'disabled');
        $('#nextmem').css('color', 'gray');
        $('#upmem').css('text-decoration-line', 'underline');
        $('#upmem').attr('disabled', 'able');
        $('#upmem').css('color', 'black');
    } else if (pageNum + 1 > 0) {
        $('#upmem').css('text-decoration-line', 'underline');
        $('#upmem').attr('disabled', 'able');
        $('#upmem').css('color', 'black');
    }
    else if (pageNum == 0) {
        $('#upmem').css('text-decoration-line', 'none');
        $('#upmem').attr("disabled", 'disabled')

    }

    //如果最後一頁，那麼安建就鎖定。

    console.log(urlmemresult)
    $.ajax({
        type: "get",
        async: false,
        url: "/api/MemberTables2/condition/" + urlmemresult + "/" + pageNum,
        success: function (e) {
            mydata.member = e;
            console.log(e);
        }
    })


}
//GET單一會員資料表
function reviewmem(e) {
    mydata.membermodel = e.value;
    console.log(mydata.membermodel);
    $.ajax({
        type: "get",
        url: "/api/MemberTables2/" + mydata.membermodel,
        success: function (e) {
            mydata.onemember = e;
            console.log(e);
            //是否已停權
            if (mydata.onemember[0].memberReportpoint >= 20) {
                mydata.onemember[0].memberBan = "已停權"
            } else if (mydata.onemember[0].memberReportpoint < 20) {
                mydata.member[0].memberBan = "使用中"
            }
            if (mydata.onemember[0].memberReportId != "－") {
                var y = "";
                for (x in mydata.onemember) {
                    y += mydata.onemember[x].memberReportId + "、";
                    console.log(mydata.onemember[x].memberReportId);
                }
                var str = y.substring(0, y.length - 1)
                mydata.onemember[0].memberReportId = str;
                console.log(mydata.onemember[0].memberReportId);


            }
        }
    })
}




////1.審核--------------------------------------------------------------------------------------------------------------------------------
//GET審核資料表
$.ajax({
    type: "get",
    url: "/api/ReportTables",
    success: function (e) {
        mydata.report = e;
        console.log(e);

        //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].reportResult == 1) {
                mydata.report[i].reportResult = "審核通過";
                mydata.AAA[i] = false;

            } else if (e[i].reportResult == 0) {
                mydata.report[i].reportResult = "審核不通過";
                mydata.AAA[i] = false;

            } else {
                mydata.report[i].reportResult = "待審核";
                mydata.AAA[i] = true;
            }

        };

        //審核總項目 跟 審核頁數
        mydata.reportnum = e.length;
        if (mydata.reportnum >= 5) {
            mydata.reportpage = Math.ceil(mydata.reportnum / 5)
        } else {
            mydata.reportpage = 1
        };

    }

})

//GET條件審核資料
function seaselrep() {
    //repertget: [{ "dateS": "1900-01-01", "dateE": "3000-01-01", "reportP": "1", "reportR": true,"reportRN":""}],
    var dataS = $("#datestart").val();
    var dataE = $("#dateend").val();
    var reportP = $("#reptype").val();
    var reportR = $("#repres").val();
    var reportRN = "nu";
    console.log(dataS);
    console.log(dataE);
    console.log(reportP);
    console.log(reportR);
    console.log(reportRN);


    if (reportR == "0") {
        mydata.repertget[0].reportR = false;
        mydata.repertget[0].reportRN = "nuu";
    } else if (reportR == "1") {
        mydata.repertget[0].reportR = true;
        mydata.repertget[0].reportRN = "nuu";
    } else if (reportR == "NULL") {
        mydata.repertget[0].reportRN = "wait";
        reportRN = "wait";
    }

    console.log(mydata.repertget[0].reportRN)
    //[HttpGet("condition/{dateS}/{dateE}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")]

    //沒條件
    if (dataS == "" && dataE == "" && reportP == "" && reportR == "" && reportRN == "nu") {

        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }

    //1.a.有檢舉時間 | 檢舉類型 | 審核狀態 、 b.有檢舉時間|檢舉類型 、 c.有檢舉時間|審核狀態、 d.有檢舉時間

    ////1-a.有檢舉時間 | 檢舉類型 | 審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]  2023-01-01/2023-01-23/D0/true
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportR.length == 1) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----2023-01-01/2023-01-23/D0/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportRN.length > 3) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;

    }
    ////1-b.有檢舉時間|檢舉類型
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]   2023-01-01/2023-01-23/D0
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 1 && reportR.length == 0) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }

    ////1-c.有檢舉時間|審核狀態  XX
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")]  ---reportP 不在乎 //2023-01-01/2023-01-23/1/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length == 1 && reportR.length > 1 && reportRN.length > 3) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]  ---reportP 不在乎   2023-01-01/2023-01-23/D0/true
    else if (dataS.length > 0 && dataE.length > 0 && reportP.length == 1 && reportR.length > 2) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR;

    }
    ////1-d.有檢舉時間
    //[HttpGet("condition/{dateS}/{dateE}")]        2023-01-01/2023-01-23
    if (dataS.length > 0 && dataE.length > 0) {
        mydata.repertget[0].dateS = dataS;
        mydata.repertget[0].dateE = dataE;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }


    //2.a.有檢舉類型|審核狀態 b.有檢舉類型
    ////1-a.有檢舉類型|審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]    1900-01-01/3000-01-01/D0/true
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 0 && reportR.length == 1) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----reportR 不在乎  1900-01-01/3000-01-01/D0/true/null
    if (dataS.length > 0 && dataE.length > 0 && reportP.length > 0 && reportRN.length > 3) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    ////1-b.有檢舉類型
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}")]   1900-01-01/3000-01-01/D0
    if (reportP.length > 0) {
        mydata.repertget[0].reportP = reportP;
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }

    //3.有審核狀態
    //[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]   1900-01-01/3000-01-01/1/true
    if (reportR.length == 1) {
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }
    //XX
    ////[HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")] ----reportR 不在乎 1900-01-01/3000-01-01/1/true/null
    if (reportR.length > 1) {
        var urlresult = mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR + "/" + mydata.repertget[0].reportRN;
    }


    console.log(urlresult);

    $.ajax({
        type: "get",
        url: "/api/ReportTables/condition/" + urlresult,
        //url: "api/ReportTables/condition/{dateS}/{dateE}/{reportP}/{reportR}",
        //url:  mydata.repertget[0].dateS + "/" + mydata.repertget[0].dateE + "/" + mydata.repertget[0].reportP + "/" + mydata.repertget[0].reportR,
        success: function (e) {
            //把資料填回去
            mydata.report = e;
            console.log(e);

            for (let i = 0; i < e.length; i++) {
                if (e[i].reportResult == 1) {
                    mydata.report[i].reportResult = "審核通過";
                    mydata.AAA[i] = false;

                } else if (e[i].reportResult == 0) {
                    mydata.report[i].reportResult = "審核不通過";
                    mydata.AAA[i] = false;

                } else {
                    mydata.report[i].reportResult = "待審核";
                    mydata.AAA[i] = true;
                }

            };

            mydata.reportnum = e.length;
            if (mydata.reportnum >= 5) {
                mydata.reportpage = Math.ceil(mydata.reportnum / 5)
            } else {
                mydata.reportpage = 1
            };



        }

    })

    mydata.repertget[0].dateS = "1900-01-01";
    mydata.repertget[0].dateE = "3000-01-01";
    mydata.repertget[0].reportP = "X0";
    mydata.repertget[0].reportR = true;
    mydata.repertget[0].reportRN = "nu";
}


//GET單一審核資料 //reviewreport1
function reviewreport1(e) {
    console.log(e.value)
    mydata.reportmodel = e.value;

    $.ajax({
        type: "get",
        url: "/api/ReportTables/get/" + mydata.reportmodel,
        success: function (e) {
            mydata.onereport = e;
            //< !--審核狀態NULL=待審核, TRUE = 審核通過, FLASE = 審核不通-- >
            if (mydata.onereport[0].reportResult == 1) {
                mydata.onereport[0].reportResult = "審核通過";
            } else if (mydata.onereport[0].reportResult == 0) {
                mydata.onereport[0].reportResult = "審核不通過"
            } else {
                mydata.onereport[0].reportResult = "待審核"
            }
        }
    })

};

//為了PUT的function
function BackVal(e) {
    console.log(e);
    console.log(e.value);
    if (e.value == "true") {

        mydata.reportput[0].reportResult = true;
    } else if (e.value == "false") {
        mydata.reportput[0].reportResult = false;
    }
    console.log(mydata.reportput[0].reportResult);
}

//PUT單一審核資料
function changereviewreport(e) {

    var now = new Date().toISOString(); //待改進 要加八小時 台灣時間
    console.log(now);
    mydata.reportput[0].reportId = mydata.reportmodel;
    mydata.reportput[0].reportCheckTime = now;
    mydata.reportput[0].managerId = mydata.loginid;
    console.log(mydata.reportput[0]);
    $.ajax({
        type: "put",
        url: "/api/ReportTables/put/" + mydata.reportmodel,
        contentType: "application/json",
        data: JSON.stringify(mydata.reportput[0]),
        success: function () {
            window.location = "/TanTanLib/html/backstage-report.html"

        }

    })

}


//GET 代號資料表
$.ajax({
    type: "get",
    url: "/api/CodeTables",
    success: function (e) {
        mydata.syscode = e;
        //console.log(e);
    }
})

////2.系統通知--------------------------------------------------------------------------------------------------------------------------------
//GET 系統通知資料表
$.ajax({
    type: "get",
    url: "/api/NoticeTables",
    success: function (e) {
        mydata.notice = e;
        console.log(e);

        ////< !--通知狀態-- >
        for (let i = 0; i < e.length; i++) {
            if (e[i].noticeState == true) {
                mydata.notice[i].noticeState = "已通知";

            } else if (e[i].noticeState == false) {
                mydata.notice[i].noticeState = "未通知";

            }

        };
        ////< !--通知對象 >
        for (let i = 0; i < e.length; i++) {
            if (e[i].noticeScope == 0) {
                mydata.notice[i].noticeScope = "一般會員";

            } else if (e[i].noticeScope == 1) {
                mydata.notice[i].noticeScope = "店家 / 美甲師";

            } else if (e[i].noticeScope == 2) {
                mydata.notice[i].noticeScope = "全體";
            }

        };

        ////審核總項目 跟 審核頁數
        mydata.noticenum = e.length;
        if (mydata.noticenum >= 5) {
            mydata.noticepage = Math.ceil(mydata.noticenum / 5)
        } else {
            mydata.noticepage = 1
        };

    }

})

//DELETE 系統通知資料表
function delnotice(e) {
    mydata.noticemodel = e.value;
    $.ajax({
        type: "delete",
        url: "/api/NoticeTables/delete/" + mydata.noticemodel,
        success: function () {
            window.location = "/TanTanLib/html/backstage-notice.html"

        }
    })
}

//GET 系統通知單一系統通知資料 //reviewnotice
function reviewnotice(e) {
    //console.log(e.value)
    mydata.noticemodel = e.value;

    $.ajax({
        type: "get",
        url: "/api/NoticeTables/" + mydata.noticemodel,
        success: function (e) {
            mydata.onenotice = e;
            ////< !--通知狀態-- >
            for (let i = 0; i < e.length; i++) {
                if (e[0].noticeState == true) {
                    mydata.onenotice[0].noticeState = "已通知";

                } else if (e[0].noticeState == false) {
                    mydata.onenotice[0].noticeState = "未通知";

                }

            };
            ////< !--通知對象 >
            for (let i = 0; i < e.length; i++) {
                if (e[0].noticeScope == 0) {
                    mydata.onenotice[0].noticeScope = "一般會員";

                } else if (e[0].noticeScope == 1) {
                    mydata.onenotice[0].noticeScope = "店家 / 美甲師";

                } else if (e[0].noticeScope == 2) {
                    mydata.onenotice[0].noticeScope = "全體會員";
                }

            };

        }
    })

};

//系統通知單一系統通知建立時間
function addnoticedate() {

    $("#adddate").prop('value', notdate);
    var noticedata = mydata.notice;
    var nownoticId = mydata.notice[(noticedata.length - 1)].noticeId;
    mydata.nownotice = nownoticId + 1;

}

//POST 系統通知單一系統通知資料
function savenotice() {
    //1.回傳到noticetable
    var addnotdate = new Date();
    mydata.noticepost[0].noticeScope = mydata.noticescope;
    mydata.noticepost[0].noticeTitle = mydata.noticetitle;
    mydata.noticepost[0].noticeContent = mydata.noticetext;
    mydata.noticepost[0].noticeBuildTime = addnotdate;
    mydata.noticepost[0].noticePushTime = mydata.noticetime + ":00.000";
    mydata.noticepost[0].noticeState = false;
    mydata.noticepost[0].noticeManagerId = mydata.loginid;

    $.ajax({
        type: "post",
        async: false,
        url: "/api/NoticeTables/post",
        contentType: "application/json",
        data: JSON.stringify(mydata.noticepost[0]),
        success: function () {
            window.location = "/TanTanLib/html/backstage-notice.html"

        }
    })

    //2. 回傳到noticeread
    //前期提要
    //noticereadpost: [{ "notice_ID": "", "noticeRead_Member": "", "noticeRead_Read": 0 }],

    //NoticeRead_Table
    //noticeRead_ID notice_ID noticeRead_Member noticeRead_Read(0已讀 )
    //            1         1                0                0
    //            2         1                1                0
    //2-0. noticeRead_ID：不用進去
    //2-1. notice_ID：獲得最新的noticeId+1
    var noticedata = mydata.notice;
    var nownoticId = mydata.notice[(noticedata.length - 1)].noticeId;
    console.log(nownoticId);
    //var noticedata = mydata.notice;
    //var nownoticId = mydata.notice[(noticedata.length - 1)].noticeId;
    //console.log(nownoticId);

    //2-3. noticeRead_Read：固定都是"0";一開始設定好了不用設定。

    //for 迴圈獲得member 看mydata.noticepost[0].noticeScope 是選哪個 where就要哪個
    //noticeScope 0只對會員，1只對美甲師，2對所有用戶。
    //for迴圈裡面包POST NOTICE READ

    //2-2. noticeRead_Member
    //獲得會員
    $.ajax({
        type: "get",
        async: false,
        url: "/api/MemberTables2/nocheck",
        success: function (e) {

            console.log('mydata.nocheckmember OK');
        }
    });
    //獲得美甲師
    $.ajax({
        type: "get",
        async: false,
        url: "/api/MemberTables2/check",
        success: function (e) {
            console.log('mydata.checkmember OK');
        }
    });
    console.log(mydata.noticepost[0])
    if (mydata.noticepost[0].noticeScope == 0) {
        for (var i = 0; i < mydata.nocheckmember.length; i++) {
            mydata.noticereadpost[0].noticeId = nownoticId + 1;
            mydata.noticereadpost[0].noticeReadMember = mydata.nocheckmember[i].memberId;
            console.log(mydata.noticereadpost[0])
            $.ajax({
                type: "post",
                url: "/api/NoticeReadTables",
                contentType: "application/json",
                data: JSON.stringify(mydata.noticereadpost[0]),
                success: function () {
                    window.location = "/TanTanLib/html/backstage-notice.html"
                }
            })
        }

    }
    else if (mydata.noticepost[0].noticeScope == 1) {
        for (var i = 0; i < mydata.checkmember.length; i++) {
            mydata.noticereadpost[0].noticeId = nownoticId + 1;
            mydata.noticereadpost[0].noticeReadMember = mydata.checkmember[i].memberId;
            console.log(mydata.noticereadpost[0])
            $.ajax({
                type: "post",
                url: "/api/NoticeReadTables",
                contentType: "application/json",
                data: JSON.stringify(mydata.noticereadpost[0]),
                success: function () {
                    window.location = "/TanTanLib/html/backstage-notice.html"
                }
            })
        }
    }
    else if (mydata.noticepost[0].noticeScope == 2) {
        for (var i = 0; i < mydata.nocheckmember.length; i++) {
            mydata.noticereadpost[0].noticeId = nownoticId + 1;
            mydata.noticereadpost[0].noticeReadMember = mydata.nocheckmember[i].memberId;
            console.log(mydata.noticereadpost[0])
            $.ajax({
                type: "post",
                url: "/api/NoticeReadTables",
                contentType: "application/json",
                data: JSON.stringify(mydata.noticereadpost[0]),
                success: function () {
                    window.location = "/TanTanLib/html/backstage-notice.html"
                }
            })
        }
        for (var i = 0; i < mydata.checkmember.length; i++) {
            mydata.noticereadpost[0].noticeId = nownoticId + 1;
            mydata.noticereadpost[0].noticeReadMember = mydata.checkmember[i].memberId;
            console.log(mydata.noticereadpost[0])
            $.ajax({
                type: "post",
                url: "/api/NoticeReadTables",
                contentType: "application/json",
                data: JSON.stringify(mydata.noticereadpost[0]),
                success: function () {
                    window.location = "/TanTanLib/html/backstage-notice.html"
                }
            })
        }
    };

};


//GET條件通知資料
function selnotice() {
    //noticeget: [{ "NdataS": "1900-01-01", "NdataE": "3000-01-01", "NoiceMem": 3, "NoiceState": true,"NoiceStateN": "nu" }],
    var NdataS = $("#noticedatestart").val();
    var NdataE = $("#noticedateend").val();
    //value="0">一般會員,value="1">店家／設計師,value="2">全體
    var NoiceMem = $("#noticemem").val();
    //value="3" selected>請選擇狀態,value="0">未通知,value="1">已通知
    var NoiceState = $("#noticestatus").val();
    console.log(NdataS);
    console.log(NdataE);
    console.log(NoiceMem);
    console.log(NoiceState);
    //開始時間
    if (NdataS == "") {
        mydata.noticeget[0].NdataS = "1900-01-01";
    } else {
        mydata.noticeget[0].NdataS = NdataS
    }
    console.log(mydata.noticeget[0].NdataS)

    //結束時間
    if (NdataE.length == "") {
        mydata.noticeget[0].NdataE = "3000-01-01";
    } else {
        mydata.noticeget[0].NdataE = NdataE
    }
    console.log(mydata.noticeget[0].NdataE)
    //通知對象
    if (NoiceMem == "3") {
        mydata.noticeget[0].NoiceMem = 3;
    } else {
        mydata.noticeget[0].NoiceMem = NoiceMem;
    }
    console.log(mydata.noticeget[0].NoiceMem)
    //通知狀態
    if (NoiceState == "0") {
        mydata.noticeget[0].NoiceState = false;
        mydata.noticeget[0].NoiceStateN = "HVa";
    } else if (NoiceState == "1") {
        mydata.noticeget[0].NoiceState = true;
        mydata.noticeget[0].NoiceStateN = "HVa";
    } else if (NoiceState == "NOPE") {
        mydata.noticeget[0].NoiceState = true;
        mydata.noticeget[0].NoiceStateN = "NOPE";
        NoiceStateN = "NOPE";
    }

    var urlnoticeresult = mydata.noticeget[0].NdataS + "/" + mydata.noticeget[0].NdataE + "/" + mydata.noticeget[0].NoiceMem + "/" + mydata.noticeget[0].NoiceState + "/" + mydata.noticeget[0].NoiceStateN;
    console.log(urlnoticeresult)
    $.ajax({
        type: "get",
        url: "/api/NoticeTables/noticecondition/" + urlnoticeresult,
        success: function (e) {
            mydata.notice = e;
            console.log(e);

            ////< !--通知狀態-- >
            for (let i = 0; i < e.length; i++) {
                if (e[i].noticeState == true) {
                    mydata.notice[i].noticeState = "已通知";

                } else if (e[i].noticeState == false) {
                    mydata.notice[i].noticeState = "未通知";

                }

            };
            ////< !--通知對象 >
            for (let i = 0; i < e.length; i++) {
                if (e[i].noticeScope == 0) {
                    mydata.notice[i].noticeScope = "一般會員";

                } else if (e[i].noticeScope == 1) {
                    mydata.notice[i].noticeScope = "店家 / 美甲師";

                } else if (e[i].noticeScope == 2) {
                    mydata.notice[i].noticeScope = "全體";
                }

            };

            ////審核總項目 跟 審核頁數
            mydata.noticenum = e.length;
            if (mydata.noticenum >= 5) {
                mydata.noticepage = Math.ceil(mydata.noticenum / 5)
            } else {
                mydata.noticepage = 1
            };

        }

    })



    mydata.repertget[0].NdateS = "1900-01-01";
    mydata.repertget[0].NdateE = "3000-01-01";
    mydata.repertget[0].NoiceMem = 3;
    mydata.repertget[0].NoiceState = true;
    mydata.repertget[0].NoiceStateN = "nu";

}


//----------------------------------------------------------------------

//現在時間
var addnotdate = new Date();
if (addnotdate.getHours().length == 2) {
    var notdatehours = addnotdate.getHours();
} else { var notdatehours = addnotdate.getHours().toString().padStart(2, '0') }
if (addnotdate.getMinutes().length == 2) {
    var notdatemin = addnotdate.getMinutes();
} else { var notdatemin = addnotdate.getMinutes().toString().padStart(2, '0') }
var notdate;
addnotdate.getDate().length == 2 ? notdate = addnotdate.getDate() : notdate = addnotdate.getDate().toString().padStart(2, '0');
var notMonth = addnotdate.getMonth() + 1;
addnotdate.getMonth().length == 2 ? notMonth = notMonth + 1 : notMonth = notMonth.toString().padStart(2, '0');

var notdate = addnotdate.getFullYear() + "-" + notMonth + "-" + notdate + " " + notdatehours + ":" + notdatemin;

