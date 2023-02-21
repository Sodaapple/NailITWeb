// 全域變數
var MID; // 設計師ID
var DSETID // 作品集ID
var SerRes // 服務資料表 res
let DsetRes // 作品集 res

// 讀取當前網址 
var getUrlString = location.href;
var url = new URL(getUrlString);


// 根據前面網址抓取 撈後面參數資料 demoSet ID 進行設定
DSETID = url.searchParams.get('id');

// 訂單類型 0=>自訂 1=>固定項目
var OrderType = $('input[name="OrderType"]')

// 抓取施作部位的Val 後續去資料庫撈值 施作項目 以及 造型
var OpartC = $('select[name="OrderPartC"]')
var OpartCval
// 施作項目
var OrderItem = $('select[name="OrderItem"]')
// 施作名稱
var OrderItemName = $('select[name="OrderItemName"]')

// 預估金額 訂金
var demoSprice = $('.demoSetPrice')
var demoSde = $('.demoSetDeposit')
var inputOprice = $('input[name="OrderPrice"]')
var inputOde = $('input[name="OrderDeposit"]')

// 加入時區 8小時
let Tzdate
// 轉換成 SQL datetime格式
let Tztoday

// 選擇的項目、訂金
let ritem
let ritemName
let rdep

//
let selectedOrderRemovalC
let selectedOrderItem
let selectedOrderItemName
let PriceTotal

// 卸甲類型
// 被選擇的卸甲類型
const OrderRemovalC = $('select[name="OrderRemovalC"]')


// 讀取基本資料 設計師資料 demoset資料 demo資料 再顯示在畫面上
// 一進畫面就進行讀取
function getbasicinfo() {
    // 一進畫面就帶入商品ID 進檢舉商品
    $('input[name="ReportItem"]').val(DSETID);

    $.ajax({
        url: "https://localhost:44308/api/product/" + DSETID,
        method: 'GET',
        dataType: 'json',
        async: true,

        success: res => {

            // 帶入 a 標籤 裡面文字 設計師工作室

            var Ores = res[0]['o']
            var Demosetres = res[0]['demoset']
            var Colorres = res[0]['color'][0]
            // console.log(Colorres)
            var demoSetPartCtext = ''
            var demoSetPartC = Demosetres['demoSetPartC']

            $('input[name="ManicuristId"]').val(Ores['manicuristId']);
            const InputMid = $('input[name="ManicuristId"]').val();
            getRemovalPrice(InputMid)
            // 被檢舉人也帶入抓到設計師ID
            $('input[name="ReportTarget"]').val(Ores['manicuristId']);
            // 施作部位判定
            if (demoSetPartC == "C0") {
                demoSetPartCtext = "手"
                $('select[name="OrderPartC"]').append(new Option(demoSetPartCtext, demoSetPartC)).attr('style', 'pointer-events: none;background-color: rgba(128, 128, 128, 0.3);');
            }
            else if (demoSetPartC == "C1") {
                demoSetPartCtext = "腳"
                $('select[name="OrderPartC"]').append(new Option(demoSetPartCtext, demoSetPartC)).attr('style', 'pointer-events: none;background-color: rgba(128, 128, 128, 0.3);');
            }
            else {
                demoSetPartCtext = "手、腳"
                $('select[name="OrderPartC"]').append(new Option("手", "C0"));
                $('select[name="OrderPartC"]').append(new Option("腳", "C1"));
            }

            $('.demoSetPartC').text("服務項目:" + demoSetPartCtext)
            // 施作項目和造型
            $('select[name="OrderItem"]').append(new Option("固定項目", Demosetres['demoSetId'])).attr('style', 'pointer-events: none;background-color: rgba(128, 128, 128, 0.3);');
            $('select[name="OrderItemName"]').append(`<option value="${Demosetres['demoSetName']}" price="${Demosetres['demoSetPrice']}">${Demosetres['demoSetName']} NT$${Demosetres['demoSetPrice']}</option>`).attr('style', 'pointer-events: none;background-color: rgba(128, 128, 128, 0.3);')
            // 設計師頁面超連結
            $('#topmanicuristSalonName').text(Ores['manicuristSalonName'])
            $("#topmanicuristSalonName").attr("href", `NailDesign.html?id=${InputMid}`)

            // 商品頁面超連結
            $('#topdemosetName').text(Demosetres['demoSetName'])
            $('#topdemosetName').attr("href", `product.html?id=${DSETID}`)


            $('#productName').text(Demosetres['demoSetName'])
            $('#demoSetPrice').text("預估價格: NT$" + Demosetres['demoSetPrice'])
            $('#demoSetContent').text(Demosetres['demoSetContent'])

            $('#botmanicuristSalonName').text("店家/設計師名稱:" + Ores['manicuristSalonName'])

            if (Ores['manicuristPublic'] != false) {
                $('.botphone').text("電話:" + Ores['manicuristSalonPhone'])
                $('#botadress').text("地址:" + Ores['manicuristAddress'])
            }


            let star = Ores['manicuristScore'] * 20 + "%"
            $('.star').text(Ores['manicuristScore'])
            $('.full_star').css({
                "width": star
            })

            demoSde.text("NT$" + Demosetres['demoSetDeposit'])
            $('.TextdemoSetDeposit').text("預估訂金: NT$" + Demosetres['demoSetDeposit'])
            inputOde.val(Demosetres['demoSetDeposit']);
            // 放入圖片
            $('#show_big_photo').attr("src", res[0]['demo']['demoPic'])
            var demo1 = res[0]['demo']['demoPic']
            for (var i = 0; i < res.length; i++) {
                $('.photocontainer').append(`<div class="smallphoto"><img class=""  src="${res[i]['demo']['demoPic']}" alt=""></div>`)
            }
            // 當標籤內容為null時 不顯示A標籤
            for (let i = 1; i <= 4; i++) {
                if (Demosetres['demoSetTag' + i] != null) {
                    $('.product-tag').append(`<a href="Fliter.html?FixTag=${Demosetres['demoSetTag' + i]}">${Demosetres['demoSetTag' + i]}</a>`)
                }
            }

            $('.product-tag').append(`<a href="Fliter.html?Color=${Colorres['colorId']}">${Colorres['colorName']}</a>`)
        },
        error: err => {
            console.log("無法讀取" + err)
        },
    })
}

// 設定可點選預約日期
function getReserveDate() {
    $('#reservebtn, .lastMonth, .nextMonth,#Sendbtn').on('click', function () {
        // 讀取的設計師ID傳回設定
        $('input[name="MemberId"]').val();
        MID = $("input[name='ManicuristId']").attr('value')
        $.ajax({
            url: `https://localhost:44308/api/product/${MID}/reserve`,
            method: 'GET',
            dataType: 'json',
            data: '',
            async: true,

            success: res => {

                // 2023-01-10T09:00:00
                // 重新組合 年月日
                // console.log(res.length)
                var year
                var month
                var date
                var ymd
                var time

                // 拿到今天日期
                var today = new Date()
                // 轉換 年月日小時
                var todayy = today.getFullYear();
                var todaym = today.getMonth() + 1;
                var todayd = today.getDate();
                var todayh = today.getHours();

                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
                    // 讀到有在資料庫中可預約的日期時 取消不能點選的class
                    $('#' + ymd).removeClass('btnnotclick')

                    if (month < todaym) {
                        $('#' + ymd).addClass('btnnotclick')
                    }
                    else if (month <= todaym && date < todayd) {
                        $('#' + ymd).addClass('btnnotclick')
                    }
                    // if(ymd == Todayymd){
                    //     $('#radio').append(`<label class="col-4"><input type="radio" name="planStartTime" value="${ptime}"><span class="round button">${time}</span></label>`)
                    // }
                }
                getReserveTime()
            },
            error: err => {
                console.log(err)
            },
        });
    })
}

// 設定可點選預約時間
function getReserveTime() {
    $('.date').on('click', function () {
        $.ajax({
            url: `https://localhost:44308/api/product/${MID}/reserve`,
            method: 'GET',
            dataType: 'json',
            data: '',
            async: true,

            success: res => {
                // 2023-01-10T09:00:00
                // 重新組合 年月日
                // console.log(res)
                var year
                var month
                var date
                var ymd
                var time
                var hour
                // var dateid = $(this).attr('id')
                var dateid = $(this).attr('id')
                // console.log("這是" + dateid);

                // 拿到今天日期
                var today = new Date()
                // 轉換 年月日小時
                var todayy = today.getFullYear();
                var todaym = today.getMonth() + 1;
                var todayd = today.getDate();
                var todayh = today.getHours();

                $('#radio').empty()
                for (i = 0; i < res.length; i++) {
                    // 讀取出 可預約日期 被轉化 可預約時間格式
                    var ptime = res[i]['p']['planStartTime']
                    var pID = res[i]['p']['planId']
                    var pOrderid = res[i]['p']['orderId']
                    year = ptime.substr(0, 4)
                    month = parseInt(ptime.substr(5, 2))
                    date = parseInt(ptime.substr(8, 2))
                    // ymd 是 SQL 取出可預約日期
                    ymd = `${year}-${month}-${date}`
                    time = ptime.substr(11, 5)
                    hour = parseInt(ptime.substr(11, 2))
                    // 當前點擊的 button id = 資料庫撈出 年月日時 顯示出可預約時間
                    if (dateid == ymd) {
                        if (pOrderid != null) {
                            $('#radio').append(`<label class=""><input class="" type="radio" name="planId" value="${pID}" disabled><span class="round button btnnotclick">${time}</span></label>`)
                        }
                        else {
                            if (month <= todaym && date <= todayd && hour < todayh) {
                                $('#radio').append(`<label class=""><input  type="radio" name="planId" value="${pID}" disabled><span class="round button btnnotclick">${time}</span></label>`)
                            }
                            else {
                                $('#radio').append(`<label class=""><input class="plan" type="radio" name="planId" value="${pID}" date=${ymd} time=${time}><span class="round button">${time}</span></label>`)
                            }
                        }

                    }
                }
                getPlanRemark()
            },
            error: err => {
                console.log(err)
            },
        });

    });
}

// 傳送表單資料 商品頁面 預約送出
function postOrder() {
    // 加入時區 8小時
    Tzdate = new Date(+new Date() + 8 * 3600 * 1000)
    // 轉換成 SQL datetime格式
    Tztoday = Tzdate.toISOString().slice(0, 19) // .replace('T', ' ');
    $('#btnsend').on('click', function () {
        $('input[name="OrderOrderTime"]').val(Tztoday);
        $('input[name="OrderStateC"]').val("A0");

        var formdata = $('#form1').serializeArray();
        var returnArray = {}
        // var Yes = true
        for (var i = 0; i < formdata.length; i++) {
            returnArray[formdata[i]['name']] = formdata[i]['value'];
            if (formdata[i]['value'] == "true") {
                returnArray[formdata[i]['name']] = true;
            }
            else if (formdata[i]['value'] == "false") {
                returnArray[formdata[i]['name']] = false;
            }
        }
        console.log(formdata)
        console.log(JSON.stringify(returnArray));
        // console.log(returnArray)
        // JSON datetime 格式
        // 2019-01-06T17:16:40
        // json bool 格式 true false
        $.ajax({
            url: "https://localhost:44308/api/product",
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(returnArray),

            success: res => {
                postCash()
                // alert('訂單送出成功')
                // Closeform()
            },
            error: err => {
                console.log("N")
            },
        });
    })
}

// 讀取設計師資料 設計師頁面
function getManicuristData() {
    MID = url.searchParams.get('id');
    $.ajax({
        url: `https://localhost:44308/api/product/MID/${MID}`,
        method: "GET",
        dataType: "json",
        async: true,

        success: res => {
            // 設計師表
            var Mres = res[0]
            $('input[name="ManicuristId"]').val(Mres['manicuristId']);
            getRemovalPrice(MID)
            // 施作部位直接加入
            $('select[name="OrderPartC"]').append(new Option("手", "C0"));
            $('select[name="OrderPartC"]').append(new Option("腳", "C1"));
        },
        error: err => {
            console.log("N")
        },
    })
}



function getOrderPartC() {
    $('#Sendbtn').on('click', function () {
        OpartCval = OpartC.find("option:selected").val();
        getDemosetData()
        getOrderItem()
        calculateprice()
    })
    OpartC.change(function () {
        OpartCval = OpartC.find("option:selected").val();
        getDemosetData()
        getOrderItem()
        calculateprice()
        deposit = OrderItemName.find("option:selected").attr('deposit')

        // demoSprice.text("NT$" + price)
        demoSde.text("NT$" + deposit)
        // inputOprice.val(price);
        inputOde.val(deposit);
    })
    OrderRemovalC.change(function () {
        calculateprice()
        //deposit = OrderItemName.find("option:selected").attr('deposit')

        // demoSprice.text("NT$" + price)
        //demoSde.text("NT$" + deposit)
        // inputOprice.val(price);
        //inputOde.val(deposit);
    })
    OrderItem.change(function () {
        calculateprice()
        deposit = OrderItemName.find("option:selected").attr('deposit')

        // demoSprice.text("NT$" + price)
        demoSde.text("NT$" + deposit)
        // inputOprice.val(price);
        inputOde.val(deposit);
    })
    OrderItemName.change(function () {
        calculateprice()
        deposit = OrderItemName.find("option:selected").attr('deposit')

        // demoSprice.text("NT$" + price)
        demoSde.text("NT$" + deposit)
        // inputOprice.val(price);
        inputOde.val(deposit);
        // var price = OrderItemName.find("option:selected").attr('price')
        // var deposit = OrderItemName.find("option:selected").attr('deposit')

        // demoSprice.text("NT$" + price)
        // demoSde.text("NT$" + deposit)
        // inputOprice.val(price);
        // inputOde.val(deposit);
    })
}

// DemoSet 資料 為了撈 固定項目的造型
function getDemosetData() {
    $.ajax({
        url: `https://localhost:44308/api/product/MID/dset/${MID}/${OpartCval}`,
        method: "GET",
        dataType: "json",
        async: false,
        success: res => {
            DsetRes = res;
            // console.log(res)
            console.log(DsetRes)
            // 先清空 施作項目 造型 選項
            //OrderItem.empty();
            OrderItemName.empty();
            //console.log(res[0]['demoSetId'])

            for (i = 0; i < res.length; i++) {
                var DRes = res[i]
                // OrderItem.append(new Option(Sres['serviceName'], Sres['serviceId']));
                OrderItemName.append(`<option value="${DRes['demoSetName']}" price="${DRes['demoSetPrice']}" deposit="${DRes['demoSetDeposit']}">${DRes['demoSetName']} NT$${DRes['demoSetPrice']}</option>`)
            }

            OrderItemName.show();
            //var price = OrderItemName.find("option:selected").attr('price')
            var deposit = OrderItemName.find("option:selected").attr('deposit')

            // demoSprice.text("NT$" + price)
            demoSde.text("NT$" + deposit)
            // inputOprice.val(price);
            inputOde.val(deposit);
        },
        error: err => {
            console.log(err)
        },
    })
}

function getOrderItem() {
    $.ajax({
        url: `https://localhost:44308/api/product/MID/service/${MID}/${OpartCval}`,
        method: "GET",
        dataType: "json",
        async: false,
        success: res => {
            OrderItem.empty();
            console.log(DsetRes)
            //OrderItem.append(`<option value="" type="fix">固定造型</option>`)
            // 預設固定項目的 value 為 抓出來的第一筆 demosetID
            OrderItem.append(`<option value="${DsetRes[0]['demoSetId']}" type="fix">固定造型</option>`)
            // 循環帶入 該設計師ID有提供的 施作項目 服務
            for (i = 0; i < res.length; i++) {
                var Sres = res[i]
                // OrderItem.append(new Option(Sres['serviceName'], Sres['serviceId']));
                OrderItem.append(`<option value="${Sres['serviceId']}" price="${Sres['servicePrice']}" deposit="${Sres['seriveDeposit']}" text="${Sres['serviceName']}">${Sres['serviceName']} NT$${Sres['servicePrice']}</option>`)
            }
            var price
            var deposit
            // 當施作項目 變更時 不是選擇固定項目的選項時 隱藏造型選項
            OrderItem.change(function () {
                var itemName = OrderItem.find("option:selected").text();
                let itemNameVal = OrderItem.find("option:selected").attr("text");
                if (OrderItem.find("option:selected").attr("type") != "fix") {
                    OrderType.val(false)

                    OrderItemName.hide();

                    OrderItemName.empty();

                    OrderItemName.append(new Option(itemName, itemNameVal));
                    calculateprice()
                    // price = OrderItem.find("option:selected").attr('price')
                    deposit = OrderItem.find("option:selected").attr('deposit')

                    // demoSprice.text("NT$" + price)
                    demoSde.text("NT$" + deposit)
                    // inputOprice.val(price);
                    inputOde.val(deposit);
                }
                else {
                    OrderType.val(true)
                    getDemosetData()
                    calculateprice()
                    OrderItemName.show();
                }
            })
        },
        error: err => {
            console.log(err)
        }
    })
}

// 獲取設計師 卸甲價錢
function getRemovalPrice(mid) {
    $.ajax({
        url: `https://localhost:44308/api/product/${mid}/RemovalPrice`,
        method: "Get",
        data: "json",
        async: true,

        success: res => {
            OrderRemovalC.append((`<option value="B0" price="${res["removalPriceB0"]}">不用卸甲 NT$${res["removalPriceB0"]}</option>`))
            OrderRemovalC.append((`<option value="B1" price="${res["removalPriceB1"]}">去指甲油(無凝膠) NT$${res["removalPriceB1"]}</option>`))
            OrderRemovalC.append((`<option value="B2" price="${res["removalPriceB2"]}">本店卸甲 NT$${res["removalPriceB2"]}</option>`))
            OrderRemovalC.append((`<option value="B3" price="${res["removalPriceB3"]}">他店卸甲 NT$${res["removalPriceB3"]}</option>`))
        },
        error: err => {
            console.log(err)
        }
    })
}

function getPlanRemark() {
    // $('input[name="planId"]:checked').on('click',function(){
    //     console.log($(this).val());
    // })
    $('input[name="planId"]').on('click', function () {
        const planid = $('input:radio[name="planId"]:checked').val();
        $.ajax({
            url: `https://localhost:44308/api/product/${planid}/Remark`,
            method: "Get",
            data: "json",
            async: true,

            success: res => {
                console.log(res)
                $('.remark').empty();
                $('.remark').append(`<p>備註:</p>`);
                $('.remark').append(`<p>${res['remark']}</p>`);
                //console.log(res[''])
            },
            error: err => {
                console.log(err)
            }
        })
    })

}

function OrderDetail() {
    $('#step3btn').on('click', function () {
        $('.rescheck').empty();
        let rdate = $('input[name="planId"]:checked').attr("date")
        console.log(rdate)
        let rtime = $('input[name="planId"]:checked').attr("time")
        let rparc = $('select[name="OrderPartC"]').find("option:selected").text()
        let rremovec = OrderRemovalC.find("option:selected").text()
        ritem = $('select[name="OrderItem"]').find("option:selected").text()
        ritemName = $('select[name="OrderItemName"]').find("option:selected").text()
        //console.log(ritem)
        //console.log(ritemName)
        let rprice = $('input[name="OrderPrice"]').val()
        rdep = $('input[name="OrderDeposit"]').val()
        let OrderTypeVal = OrderType.val();
        console.log(OrderTypeVal)
        if (OrderTypeVal == "true") {
            $('.rescheck').append(`
            <div class="col-12">
                <label class="title">預約日期:</label>
                <label class="text">${rdate}</label>
                <label class="title">預約時間:</label>
                <label class="text">${rtime}</label>
            </div>
            <div class="col-12">
                <label class="title">施作部位:</label>
                <label class="text">${rparc}</label>
            </div>
            <div class="col-12">
                <label class="title">卸甲選擇:</label>
                <label class="text">${rremovec}</label>
            </div>
            <div class="col-12">
                <label class="title">施作項目:</label>
                <label class="text">${ritem}</label>
                <label class="title">造型款式:</label>
                <label class="text">${ritemName}</label>
            </div>
            <div class="col-12">
                <label class="title">預估價位:</label>
                <label class="text">NT$${rprice}</label>
            </div>
            <div class="col-12">
                <label class="title">預付訂金:</label>
                <label class="text">NT$${rdep}</label>
            </div>
        `);
        }
        else {
            $('.rescheck').append(`
            <div class="col-12">
                <label class="title">預約日期:</label>
                <label class="text">${rdate}</label>
                <label class="title">預約時間:</label>
                <label class="text">${rtime}</label>
            </div>
            <div class="col-12">
                <label class="title">施作部位:</label>
                <label class="text">${rparc}</label>
            </div>
            <div class="col-12">
                <label class="title">卸甲選擇:</label>
                <label class="text">${rremovec}</label>
            </div>
            <div class="col-12">
                <label class="title">施作項目:</label>
                <label class="text">${ritem}</label>
            </div>
            <div class="col-12">
                <label class="title">預估價位:</label>
                <label class="text">NT$${rprice}</label>
            </div>
            <div class="col-12">
                <label class="title">預付訂金:</label>
                <label class="text">NT$${rdep}</label>
            </div>
        `);
        }

    })
}

function postCash() {
    let Tzdatetime = Tzdate.toISOString().slice(0, 19).replace('T', ' ');
    Tzdatetime = Tzdatetime.replaceAll('-', '/')
    let Tzymd = Tztoday.slice(0, 10).replaceAll('-', '')
    let Tztime = Tztoday.slice(11, 19).replaceAll(':', '')
    // 寫死不用動
    // input MerchantID
    let HashKey = "HashKey=pwFHCqoQZGmho4w6"
    let HashIV = "EkRm7iFT261dpevs"

    // MerchantTradeNo 訂單編號
    // MerchantTradeDate 訂單日期
    // TotalAmount 付款金額
    // TradeDesc 商品描述
    // ItemName 商品名稱
    // 上面五個須給值ritemName
    if (ritem == "固定造型") {
        $('input[name="ItemName"]').val(ritemName);
    }
    else {
        $('input[name="ItemName"]').val(ritem);
    }
    let itemName = $('input[name="ItemName"]').val();

    // console.log(itemName)
    $('input[name="MerchantTradeDate"]').val(Tzdatetime);
    let MerchantTradeDate = $('input[name="MerchantTradeDate"]').val();

    //console.log(Tzdatetime)

    $('input[name="MerchantTradeNo"]').val(`Nailit${Tzymd + Tztime}`);
    let MerchantTradeNo = $('input[name="MerchantTradeNo"]').val();

    console.log(MerchantTradeNo)

    let returnUrl = $('input[name="ReturnURL"]').val();

    // let OrderResultURL = $('input[name="OrderResultURL"]').val();
    $('input[name="TotalAmount"]').val(rdep);
    let TotalAmount = $('input[name="TotalAmount"]').val();

    let TradeDesc = $('input[name="TradeDesc"]').val();

    // CheckMacValue 檢查碼生成 上面參數都正確會傳放入 val()進去
    let x = `${HashKey}&ChoosePayment=Credit&EncryptType=1&ItemName=${itemName}&MerchantID=3002607&MerchantTradeDate=${MerchantTradeDate}&MerchantTradeNo=${MerchantTradeNo}&PaymentType=aio&ReturnURL=${returnUrl}&TotalAmount=${TotalAmount}&TradeDesc=${TradeDesc}&HashIV=${HashIV}`
    
    let y = encodeURIComponent(x)
    y = y.replaceAll("%20", "+")
    
    y = y.toLowerCase();
    
    var hash = CryptoJS.SHA256(y).toString();

    hash = hash.toUpperCase()
    
    $('input[name="CheckMacValue"]').val(hash)

    $('#cashform').submit();
    // const apiURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

    // const data = { 
    //     MerchantID: 3002607,
    //     MerchantTradeNo: "DX20230127114112152C",
    //     MerchantTradeDate: "2023/01/27 11:41:12",
    //     PaymentType: "aio",
    //     TotalAmount: 1500,
    //     TradeDesc: "美甲",
    //     ItemName: "繽紛",
    //     ReturnURL: "https://hoyo.idv.tw/?a=Tools/EcPay&b=ReturnURL",
    //     ChoosePayment: "Credit",
    //     CheckMacValue: hash,
    //     EncryptType: 1
    // };
    // const options = {
    //     method: 'POST',
    //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //     data: Qs.stringify(data),
    //     url : apiURL,
    // };


    // axios(options);
    // let z = "HashKey%3dpwFHCqoQZGmho4w6%26ChoosePayment%3dCredit%26EncryptType%3d1%26ItemName%3d%e7%b9%bd%e7%b4%9b%26MerchantID%3d3002607%26MerchantTradeDate%3d2023%2f01%2f27+11%3a41%3a12%26MerchantTradeNo%3dDX20230127114112152a%26PaymentType%3daio%26ReturnURL%3dhttps%3a%2f%2fhoyo.idv.tw%2f%3fa%3dTools%2fEcPay%26b%3dReturnURL%26TotalAmount%3d1000%26TradeDesc%3d%e7%be%8e%e7%94%b2%26HashIV%3dEkRm7iFT261dpevs";
    // %20 應該轉換成 +
}

// 計算 預估金額
function calculate() {
    $('#reservebtn,#Sendbtn').on('click', function () {
        calculateprice()
    })
    OrderRemovalC.change(function () {
        calculateprice()
    })
}

function calculateprice() {
    selectedOrderRemovalC = OrderRemovalC.find("option:selected").attr('price')
    selectedOrderItem = $('select[name="OrderItem"]').find("option:selected").attr('price')
    selectedOrderItemName = $('select[name="OrderItemName"]').find("option:selected").attr('price')
    if (selectedOrderItem == undefined) {
        selectedOrderItem = 0
    }
    if (selectedOrderItemName == undefined) {
        selectedOrderItemName = 0
    }


    PriceTotal = parseInt(selectedOrderRemovalC) + parseInt(selectedOrderItemName) + parseInt(selectedOrderItem)
    demoSprice.text("NT$" + PriceTotal);
    inputOprice.val(PriceTotal);
    //console.log("卸甲價錢" + selectedOrderRemovalC)
    //console.log("施作項目" + selectedOrderItem)
    //console.log("造型" + selectedOrderItemName)
}

// 檢舉表單
function report() {
    MID = url.searchParams.get('id');
    $('#report').on('click', function () {
        // 加入時區 8小時
        Tzdate = new Date(+new Date() + 8 * 3600 * 1000)
        // 轉換成 SQL datetime格式
        Tztoday = Tzdate.toISOString().slice(0, 19) // .replace('T', ' ');
        $('input[name="ReportBuildTime"]').val(Tztoday)
        $('input[name="ReportTarget"]').val(MID)
        $('input[name="ReportItem"]').val(MID)
        var formdata = $('#reportform').serializeArray();
        var returnArray = {}
        // var Yes = true
        for (var i = 0; i < formdata.length; i++) {
            returnArray[formdata[i]['name']] = formdata[i]['value'];
        }
        console.log(JSON.stringify(returnArray))
        $.ajax({
            url: "https://localhost:44308/api/product/report",
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(returnArray),

            success: res => {
                alert('檢舉送出成功')
                repCloseform()
            },
            error: err => {
                console.log("N")
            },
        });
    })
}



function Msg() {
    $('#msgbtn').on('click', function () {
        let getMid = $('input[name="ManicuristId"]').val();
        window.location = "/Community/chat/" + getMid;
    })

}
