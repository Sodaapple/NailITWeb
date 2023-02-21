
async function appll() {
    await YueloginCheck();

    
}
var ood = new Vue({
    el: "#my-appointment",
    data: {
        inglist: [],
        rightlist: [],
        finlist: [],
        cancellist: []

    }
})
function now3(nowMember) {

    $.ajax({
        type: "get",
        url: "/api/OrderTED/" + nowMember,
        success: function (e) {

            for (var i = 0; i < e.length; i++) {
                if (e[i].demoSetCover == null) {
                    e[i].demoSetCover = e[i].manicuristPic;
                }
                if (e[i].manicuristPublic == false) {
                    
                var nummm = 0;
                    for (var j = 3; j < e[i].manicuristAddress.length; j++) {
                        if (((e[i].manicuristAddress)[j]).toString().indexOf('區') >=0 || (e[i].manicuristAddress)[j].indexOf('市') >= 0 ||
                            (e[i].manicuristAddress)[j].indexOf('鎮') >= 0 || (e[i].manicuristAddress)[j].indexOf('鄉') >= 0) {
                          
                        nummm = j;
                        break;
                    }

                }    
                e[i].manicuristAddress = (e[i].manicuristAddress).substr(0, nummm + 1);
            }
            e[i].orderOrderTime = e[i].orderOrderTime.replace('T', ' ');
            e[i].demoSetCover = "../YiPLib/" + e[i].demoSetCover; 
           
            e[i].orderId = (e[i].orderId).toString().padStart(8, '0');
            if (e[i].orderPartC == 'C0') {
                e[i].orderPartC = "手";
            } else if (e[i].orderPartC == 'C1') {
                e[i].orderPartC = "腳";
            } else if (e[i].orderPartC == 'C2') {
                e[i].orderPartC = "手、腳";
            }
            if (e[i].orderRemovalC == 'B0') {
                e[i].orderRemovalC = "不用卸甲"
            } else if (e[i].orderRemovalC == 'B1') {
                e[i].orderRemovalC = '去指卸甲'
            } else if (e[i].orderRemovalC == 'B2') {
                e[i].orderRemovalC = '本店卸甲'
            } else if (e[i].orderRemovalC == 'B3') {
                e[i].orderRemovalC = '他店卸甲'
            }
            if (e[i].orderStateC == "A0") {
                (ood.inglist).push(e[i]);
            } else if (e[i].orderStateC == 'A1' || e[i].orderStateC == 'A2') {
                (ood.rightlist).push(e[i]);
            } else if (e[i].orderStateC == 'A4' || e[i].orderStateC == 'A5') {
                e[i].orderCompleteTime = e[i].orderCompleteTime.replace('T', ' ');
                (ood.finlist).push(e[i]);
            } else if (e[i].orderStateC == 'A7') {
                e[i].orderCancelTime = e[i].orderCancelTime.replace('T', ' ');
                (ood.cancellist).push(e[i]);
            } 
            
      
        }
    }
})
}
function Getorder(e) {
    console.log(ood.inglist[(e.id).substr(5, 1)].manicuristAddress);
        $("#salonname").text(ood.inglist[(e.id).substr(5, 1)].manicuristSalonName);
        $("#number-ing").text(ood.inglist[(e.id).substr(5, 1)].orderId)
        $("#date-ing").text(ood.inglist[(e.id).substr(5, 1)].orderOrderTime);
        $("#part-ing").text(ood.inglist[(e.id).substr(5, 1)].orderPartC);   
        $("#remove-ing").text(ood.inglist[(e.id).substr(5, 1)].orderRemovalC);   
        $("#item-ing").text(ood.inglist[(e.id).substr(5, 1)].orderItemName);   
        $("#pay-ing").text('NT$'+ood.inglist[(e.id).substr(5, 1)].orderPrice);   
        $("#rent-ing").text('NT$' + ood.inglist[(e.id).substr(5, 1)].orderDeposit);
        $("#addre-ing").text(ood.inglist[(e.id).substr(5, 1)].manicuristAddress);
}
function Getorderrig(e) {
    $("#salonname-rig").text(ood.rightlist[(e.id).substr(8, 1)].manicuristSalonName);
    $("#number-rig").text(ood.rightlist[(e.id).substr(8, 1)].orderId);
    $("#date-rig").text(ood.rightlist[(e.id).substr(8, 1)].orderOrderTime);
    $("#part-rig").text(ood.rightlist[(e.id).substr(8, 1)].orderPartC);
    $("#remove-rig").text(ood.rightlist[(e.id).substr(8, 1)].orderRemovalC);
    $("#item-rig").text(ood.rightlist[(e.id).substr(8, 1)].orderItemName);
    $("#pay-rig").text('NT$' + ood.rightlist[(e.id).substr(8, 1)].orderPrice);
    $("#rent-rig").text('NT$' + ood.rightlist[(e.id).substr(8, 1)].orderDeposit);
    $("#addre-rig").text(ood.rightlist[(e.id).substr(8, 1)].manicuristAddress);
}
function Getorderfin(e) {
    $("#salonname-fin").text(ood.finlist[(e.id).substr(8, 1)].manicuristSalonName);
    $("#number-fin").text(ood.finlist[(e.id).substr(8, 1)].orderId);
    $("#date-fin").text(ood.finlist[(e.id).substr(8, 1)].orderOrderTime);
    $("#enddate-fin").text(ood.finlist[(e.id).substr(8, 1)].orderCompleteTime);
    $("#part-fin").text(ood.finlist[(e.id).substr(8, 1)].orderPartC);
    $("#remove-fin").text(ood.finlist[(e.id).substr(8, 1)].orderRemovalC);
    $("#item-fin").text(ood.finlist[(e.id).substr(8, 1)].orderItemName);
    $("#pay-fin").text('NT$' + ood.finlist[(e.id).substr(8, 1)].orderPrice);
    $("#rent-fin").text('NT$' + ood.finlist[(e.id).substr(8, 1)].orderDeposit);
    $("#addre-fin").text(ood.finlist[(e.id).substr(8, 1)].manicuristAddress);

}
function Getordercancel(e) {
    $("#salonname-cancel").text(ood.cancellist[(e.id).substr(11, 1)].manicuristSalonName);
    $("#number-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderId);
    $("#date-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderOrderTime);
    $("#enddate-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderCompleteTime);
    $("#part-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderPartC);
    $("#remove-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderRemovalC);
    $("#item-cancel").text(ood.cancellist[(e.id).substr(11, 1)].orderItemName);
    $("#pay-cancel").text('NT$' + ood.cancellist[(e.id).substr(11, 1)].orderPrice);
    $("#rent-cancel").text('NT$' + ood.cancellist[(e.id).substr(11, 1)].orderDeposit);
    $("#addre-cancel").text(ood.cancellist[(e.id).substr(11, 1)].manicuristAddress);

}
//取消預約
function cancelorderbtn(e) {
    var cancelid = e.id; 
    var num = 0;
    for (var i = 6; i < cancelid.length; i++) {
        if (cancelid[i].toString().indexOf('0') <0) {
            num = i;
            break;
        }
    }
    var realid = cancelid.substr(num, cancelid.length - num);

    var ooder = ["A7"];
    if (confirm('是否確定要取消預約?') == true) {
        $.ajax({
            type: "put",
            url: "/api/OrderTED/" + realid,
            contentType:"application/json",
            data: JSON.stringify(ooder),
        success: function () {
            window.location = "/tedLb/tedmember.html";
        alert('已取消訂單');
        }
   })
       
    }
   
}
