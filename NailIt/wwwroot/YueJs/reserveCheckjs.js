
async function reserveCheckSendGet() {
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueOrderTables/" + nowMember + "/" + "A0" + "/", requestOptions)//2要改為token(controller也要改)
		.then(response => response.text())
		.then(function (result) {
			myResult = result;
			reserveCheck();
		})
		.catch(error => console.log('error', error));
}

function reserveCheck(search = false) {
	myData = JSON.parse(myResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單預約時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input id="searchStart" type="date" />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input id="searchEnd"	 type="date" />
				<img src="../YuePic/big.jpg" width="26px" style="margin-left: 4%" onclick="reserveCheck(true)" />
				<br />
				<div
					id="removeNaildiv"
					class="tag"
					style="border-bottom: solid black 2px"
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCancelSendGet()">已取消</div>
				<div id="itemSetdiv" class="tag" onclick="reserveScoreSendGet()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveDoneSendGet()">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />`+
		checkLoop(search);
	searchStart.value = mySearchStart;
	searchEnd.value = mySearchEnd;
}

function checkLoop(search = false) {
	if (myData.length == 0) return `<br /><span style="padding-left:5%">目前無預約中訂單</span>`;
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	var stars;
	for (var x of myData) {
	stars = x.member_star == null ? 0 : x.member_star;  
		if (search) {
			if (searchStart.value == "" || searchEnd.value == "") {
				let myDate = new Date();
				let myMonth = myDate.getMonth() + 1;
				searchStart.value = "1999-01-01";
				searchEnd.value = myDate.getFullYear() + "-" + (myMonth.length > 1 ? myMonth : "0" + myMonth) + "-" + myDate.getDate();
			}
			mySearchStart = searchStart.value;
			mySearchEnd = searchEnd.value;
			if (x.order_OrderTime < searchStart.value || x.order_OrderTime > searchEnd.value.substring(0, 8) + (Number(searchEnd.value.substring(8)) + 1)) {
				i++;
				continue;
			}
		}
		var maniTo = "../YipLib/NailDesign.html?id=" + x.manicurist_ID;
		var picTo = x.order_Type == 0 ? maniTo : "../YipLib/product.html?=" + x.order_item;
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);
		answer +=`<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20% ; height:170px">
						<img src="../YipLib/`+ x.order_Cover + `" width="90%" height="90%" style="margin-left: 3%" onclick="javascript:location.href='` + maniTo +`'" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%" onclick="javascript:location.href='`+ picTo +`'"><b>`+ x.order_ItemName+`</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content + `</span>
						<br />
						<span>訂單編號：`+ thisOrderId +`</span>
						<br />
						<span>預約客戶：`+ x.member_Nickname + `</span>
								<div class="ratings">
                                <div id="empty_star">★★★★★</div>
                                <div id="full_star" style="width:`+ stars * 20 +`%">★★★★★</div>
                        </div>
						<br />
						<span>施作時間：`+ thisStartTime +`</span>
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
							onclick="getCheckDetail(`+ i+`,'see')"
							>訂單詳情</a>
						<br /><br />
						<input
							style="
								border: 0cm;
								width: 40%;
								color: antiquewhite;
								background-color: black;
								margin-right: 7%;
							"
							type="button"
							value="取消"
						onclick="getCheckDetail(`+ i + `,'no')";
						/>
						<input
							style="
								border: 0cm;
								width: 40%;
								background-color: #ff6733;
								color: white;
							"
							type="button"
							value="預約確認"
							onclick="getCheckDetail(`+ i +`,'yes')";
						/>
					</div>
				</div>`
		i++;
	}
	
	return answer;
}

function getCheckDetail(i,str)
{
	var x = myData[i];
	var thisOrderId = "";
	var thisOrderTime = "";
	var thisStartTime = "";
	var myTitle = "預約訂單詳情";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisOrderTime = x.order_OrderTime.substring(0, 10) + " " + x.order_OrderTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);
	

	infoModal.innerHTML = `<div>
                <h5>`+myTitle+`</h5> 
				<image id="Xpng" src="../YuePic/X.png" style="heigh:8%;width:8%;position:absolute;right:2%;top:2%" onclick="closeInfoModal()"></image>
                <hr />
                <span class="detailItem">施作項目：`+ x.order_ItemName +`</span>
				<br />
                <span class="detailItem">訂單編號：`+ thisOrderId +`</span>
				<br />
                <span class="detailItem">客戶：`+ x.member_Nickname +`</span>
				<br />
				<span class="detailItem">施作部位：`+ x.order_part+`</span>
				<br />
				<span class="detailItem">卸甲：`+ x.order_removal+`</span>
				<br />
				<span class="detailItem">施作時間：`+ thisStartTime +`</span>
				<br />
				<span class="detailItem">預約日期：`+ thisOrderTime +`</span>
				<br />
				<span class="detailItem">預估價格：`+ x.order_Price+`</span>
				<br />
				<span class="detailItem">訂金：`+ x.order_Deposit +`</span>
				<input id="reserveCheckYes"type="button" style="
								border: 0cm;
								width: 25%;
								background-color: #ff6733;
								color: white;
								right:3%;
								bottom:3%;
								position:absolute;
							" 
								onclick="reserveCheckSendPut(`+ x.order_ID +`,'A1')"
								value="確認預約" />
				<input id="reserveCheckCancel" type="button" style="
								border: 0cm;
								width: 25%;
								background-color: #ff6733;
								color: white;
								right:3%;
								bottom:3%;
								position:absolute;
							" 
								onclick="reserveCheckSendPut(`+ x.order_ID+`,'A7')"
								value="確認取消" />
				<input
							id="reserveCheckback"
							style="
								border: 0cm;
								width: 25%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>
			</div>`;
	if (str == "yes")
		reserveCheckCancel.style.visibility = "hidden";
	if (str == "see") {
		reserveCheckCancel.style.visibility = "hidden";
		reserveCheckYes.style.visibility = "hidden";
		reserveCheckback.style.right = "3%";
	}
	infoModal.style.width = "30%";
	infoModal.style.height = "62%";
		infoModal.showModal();
}
function closeInfoModal() {
	infoModal.close();
}




async function reserveCheckSendPut(id,state)
{
	var raw = "";
	var requestOptions = {
		method: 'PUT',
		body:raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YueOrderTables/"+id+"/"+state+"/", requestOptions)
		.then(response => response.text())
		.then(result=>console.log(result))
		.catch(error => console.log('error', error));

		if (state == "A1" || state == "A7")
			reserveCheckSendGet();
		else if (state == "A2")
			reserveCompleteSendGet();

	closeInfoModal();
	if (state == "A1")
		toastr.success("訂單已確認");
	else if (state == "A7")
		toastr.success("訂單已取消");
	

}
