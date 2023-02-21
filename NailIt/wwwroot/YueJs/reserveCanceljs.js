
async function reserveCancelSendGet() {
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};


	fetch("https://localhost:44308/api/YueOrderTables/" + nowMember + "/" + "A7" + "/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			myResult = result;
			reserveCancel();
		})
		.catch(error => console.log('error', error));
}



function reserveCancel(search = false) {
	myData = JSON.parse(myResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單取消時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input  id="searchStart" type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input   id="searchEnd" type="date" />
				<img src="../YuePic/big.jpg" width="26px" style="margin-left: 4%" onclick="reserveCancel(true)" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div id="itemSetdiv" class="tag"style="border-bottom: solid black 2px"  onclick="reserveCancelSendGet()">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="reserveScoreSendGet()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveDoneSendGet()">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />
				`+ cancelLoop(search);
	searchStart.value = mySearchStart;
	searchEnd.value = mySearchEnd;
	
}

function cancelLoop(search=false) {
	if (myData.length == 0) return `<br /><span style="padding-left:5%">目前無已取消訂單</span>`;
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	var thisOrderTime = ""
	for (var x of myData) {
		console.log(x);
		if (search) {
			if (searchStart.value == "" || searchEnd.value == "") {
				let myDate = new Date();
				let myMonth = myDate.getMonth() + 1;
				searchStart.value = "1999-01-01";
				searchEnd.value = myDate.getFullYear() + "-" + (myMonth.length > 1 ? myMonth : "0" + myMonth) + "-" + myDate.getDate();
			}
			mySearchStart = searchStart.value;
			mySearchEnd = searchEnd.value;
			if (x.order_CancelTime < searchStart.value || x.order_CancelTime > searchEnd.value.substring(0, 8) + (Number(searchEnd.value.substring(8)) + 1)) {
				i++;
				continue;
			}
		}
		var maniTo = "../YipLib/NailDesign.html?id="+x.manicurist_ID;
		var picTo = x.order_Type == 0 ? maniTo : "../YipLib/product.html?=" + x.order_item;
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisOrderTime = x.order_CancelTime.substring(0, 10) + " " + x.order_CancelTime.substring(11, 19);
		answer +=`<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%; height:170px">
						<img src="../YipLib/`+ x.order_Cover + `"width="90%" height="90%" style="margin-left: 3%" onclick="javascript:location.href='` + maniTo +`'" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%" onclick="javascript:location.href='`+ picTo +`'"><b>`+ x.order_ItemName +`</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content+`</span>
						<br /><br />
						<span>訂單編號：`+ thisOrderId +`</span>
						<br />
						<span>預約客戶：`+ x.member_Nickname +`</span>
						<br />
						<span>取消時間：`+ thisOrderTime +`</span>
					</div>
					<div
						style="
							margin-left: 3%;
							text-align: right;
							display: inline-block;
							width: 30%;
						"
					>
						<br />
						<span> <b> 訂金：NT$`+ x.order_Deposit+` </b> </span>
						<br /><br />
							<a
							class="reserveDetail"
							href="#"
							onclick="getCancelDetail(`+ i +`)"
							>訂單詳情</a>
							<br />
					</div>
				</div>`

	}
		return answer;
}
function getCancelDetail(i) {
	var x = myData[i];
	var thisOrderId = "";
	var thisOrderTime = "";
	var thisStartTime = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisOrderTime = x.order_OrderTime.substring(0, 10) + " " + x.order_OrderTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);


	infoModal.innerHTML = `<div>
                <h5>已取消訂單詳請</h5> 
				<image id="Xpng" src="../YuePic/X.png" style="heigh:8%;width:8%;position:absolute;right:2%;top:2%" onclick="closeInfoModal()"></image>
                <hr />
                <span class="detailItem">施作項目：`+ x.order_ItemName + `</span>
				<br />
                <span class="detailItem">訂單編號：`+ thisOrderId + `</span>
				<br />
                <span class="detailItem">客戶：`+ x.member_Nickname + `</span>
				<br />
				<span class="detailItem">施作部位：`+ x.order_part + `</span>
				<br />
				<span class="detailItem">卸甲：`+ x.order_removal + `</span>
				<br />
				<span class="detailItem">施作時間：`+ thisStartTime + `</span>
				<br />
				<span class="detailItem">預約時間：`+ thisOrderTime + `</span>
				<br />
				<span class="detailItem">預估價格：`+ x.order_Price + `</span>
				<br />
				<span class="detailItem">訂金：`+ x.order_Deposit + `</span>
				<input
							id="reserveCheckback"
							style="
								border: 0cm;
								width: 25%;
								color: antiquewhite;
								background-color: black;
								right:3%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>
			</div>`;
	infoModal.style.width = "30%";
	infoModal.style.height = "62%";
	infoModal.showModal();
}