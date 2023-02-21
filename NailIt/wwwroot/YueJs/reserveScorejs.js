var myResult;//get到的資料轉換前
var myData;//待評價頁面所get到的資料陣列
var nowStar;//星星使用的參數
var mySearchStart="";
var mySearchEnd="";
//網頁從送出get api開始
async function reserveScoreSendGet() {
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueOrderTables/" + nowMember + "/" + "A5" + "/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			myResult = result;
			reserveScore();
		})
		.catch(error => console.log('error', error));
	
}
//生成頁面內容
function reserveScore(search=false)
{
	myData = JSON.parse(myResult);	
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞訂單管理</div>
				<br /><br />
				<label style="margin-bottom: 1%"
					>訂單完成時間&nbsp&nbsp&nbsp&nbsp&nbsp</label
				>
				<input id="searchStart" type="date"  />
				<label for="">&nbsp&nbsp&nbsp&nbsp至&nbsp&nbsp&nbsp</label>
				<input id="searchEnd" type="date"  />
				<img src="../YuePic/big.jpg" width="26px" style="margin-left: 4%" onclick="reserveScore(true)" />
				<br />
				<div	
					id="removeNaildiv"
					class="tag"
					
					onclick="reserveCheckSendGet()"
				>
					預約確認
				</div>
				<div id="itemSetdiv" class="tag" onclick="reserveCompleteSendGet()">進行中</div>
				<div id="itemSetdiv" class="tag"  onclick="reserveCancelSendGet()">已取消</div>
				<div id="itemSetdiv" class="tag" style="border-bottom: solid black 2px" onclick="reserveScoreSendGet()">待評中</div>
				<div id="itemSetdiv" class="tag" onclick="reserveDoneSendGet()">已評價</div>
				<hr style="border-color: black; margin-top: 0%" />`
		+ scoreLoop(search);
	searchStart.value = mySearchStart;
	searchEnd.value = mySearchEnd;
}
//生成訂單內容
function scoreLoop(search=false)
{
	if (myData.length == 0) return `<br /><span style="padding-left:5%">目前無待評價訂單</span>`;
	var i = 0;
	var thisOrderId = "";
	var answer = "";
	for (var x of myData) {
		if (search) {
			if (searchStart.value == "" || searchEnd.value == "") {	
				let myDate = new Date();
				let myMonth = myDate.getMonth() + 1;
				searchStart.value = "1999-01-01";
				searchEnd.value = myDate.getFullYear() + "-" + (myMonth.length > 1 ? myMonth : "0" + myMonth) + "-" + myDate.getDate();
				
			}
				mySearchStart = searchStart.value;
			mySearchEnd = searchEnd.value;
			if (x.order_AcceptTime < mySearchStart || x.order_AcceptTime > searchEnd.value.substring(0, 8) + (Number(searchEnd.value.substring(8)) + 1)) {
				i++;
				continue;
			}
		}
		var maniTo = "../YipLib/NailDesign.html?id=" + x.manicurist_ID;
		var picTo = x.order_Type == 0 ? maniTo : "../YipLib/product.html?=" + x.order_item;
		thisOrderId = (x.order_ID + 100000000).toString().substring(1);
		thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);
		thisCompleteTime = x.order_CompleteTime.substring(0, 10) + " " + x.order_CompleteTime.substring(11, 19);
		answer += `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 20%">
						<img src="../YipLib/`+ x.order_Cover + `" width="90%" style="margin-left: 3% ;height:170px;" onclick="javascript:location.href='` + maniTo +`'" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 40%">
						<span style="font-size: 120%"  onclick="javascript:location.href='`+ picTo +`'"><b>`+ x.order_ItemName + `</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content + `</span>
						<br /><br />
						<span>訂單編號：`+ thisOrderId + `</span>
						<br />
						<span>施作時間：`+ thisStartTime + `</span>
						<br />
						<span>完成時間：`+ thisCompleteTime + `</span>
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
						<span> <b> 訂金：NT$`+ x.order_Deposit + ` </b> </span>
						<br /><br />
						<a
							class="reserveDetail"
							href="#"
							onclick="getScoreDetail(`+ i + `)"
							>訂單詳情</a>
						<br /><br />
						<input
							style="
								border: 0cm;
								width: 40%;
								background-color: #ff6733;
								color: white;
							"
                            onclick="reserveScoreGo(`+ i + `)"
							type="button"
							value="去評價"
						/>
					</div>
				</div>`;
		i++;
	}
	return answer;
}
//點開訂單詳情
function getScoreDetail(i)
{
	var x = myData[i];
	var thisOrderId = "";
	var thisOrderTime = "";
	var thisStartTime = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisOrderTime = x.order_AcceptTime.substring(0, 10) + " " + x.order_AcceptTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);

	infoModal.innerHTML = `<div>
                <h5>訂單詳情</h5> 
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
				<span class="detailItem">接受日期：`+ thisOrderTime + `</span>
				<br />
				<span class="detailItem">預估價格：`+ x.order_Price + `</span>
				<br />
				<span class="detailItem">訂金：`+ x.order_Deposit + `</span>
				<input
							id="reserveCompleteback"
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
//送出comment
function reserveScoreGo(i)
{
	var x = myData[i];
	var thisOrderId = "";
	var thisCompleteTime = "";
	var thisStartTime = "";
	var myTitle = "";
	thisOrderId = (x.order_ID + 100000000).toString().substring(1);
	thisCompleteTime = x.order_CompleteTime.substring(0, 10) + " " + x.order_CompleteTime.substring(11, 19);
	thisStartTime = x.plan_StartTime.substring(0, 10) + " " + x.plan_StartTime.substring(11, 19);

	infoModal.innerHTML = `<div class="row" style="margin-top: 3%">
					<div style="margin-left: 3%; display: inline-block; width: 30%">
						<img src="../YipLib/`+ x.order_Cover+`" width="100%" height="145px" style="margin-left: 3%" />
					</div>
					<div style="margin-left: 2%; display: inline-block; width: 60%">
						<span style="font-size: 120%"><b>`+ x.order_ItemName+`</b></span>
						<br />
						<span style="color: gray">`+ x.demoSet_Content +`</span>
						<br />
						<span >客戶：`+ x.member_Nickname +`</span>
						<br />
						<span >訂單編號：`+thisOrderId+`</span>
						<br />
						<span>施作時間：`+ thisStartTime +`</span>
                        <br />
						<span>完成時間：`+ thisCompleteTime +`</span>
					</div>
					
                    <div style="font-size:25px; margin-left:4% ;width:300px; display:inline-block">
                    <span  id="star1" class="fa fa-star-o" onmouseover="starChange(`+1+`)" onclick="starSet(`+1+`)"></span>
					<span  id="star2" class="fa fa-star-o" onmouseover="starChange(`+ 2 + `)" onclick="starSet(` + 2 +`)"></span>
					<span  id="star3" class="fa fa-star-o" onmouseover="starChange(`+ 3 + `)" onclick="starSet(` + 3 +`)"></span>
					<span  id="star4" class="fa fa-star-o" onmouseover="starChange(`+ 4 + `)" onclick="starSet(` + 4 +`)"></span>
					<span  id="star5" class="fa fa-star-o" onmouseover="starChange(`+ 5 + `)" onclick="starSet(` + 5 +`)"></span>
					</div>
					<br />
                    <textarea  id= "textCommentContent"style=" margin-left:4%;margin-top:1%;margin-bottom:2%; height:120px;width:90%"></textarea>
                    <input type="button" style="
								border: 0cm;
								width: 20%;
								background-color: #ff6733;
								color: white;
								right:6%;
								bottom:3%;
								position:absolute;
							" 
								onclick="reserveScoreSendPost(`+ i +`)"		
								value="確定送出">
					<input
							style="
								border: 0cm;
								width: 20%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:3%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>`;
	infoModal.style.width = "35%";
	infoModal.style.height = "62%";
	infoModal.showModal();
}
//滑動星星小功能
function starChange(i)
{
	var target;
	for (var x = 1; x <= i; x++)
	{
		target = document.getElementById("star" + x.toString())
		target.classList = "fa fa-star";
		target.style.color = "gold";	
	}
	for (var y = i+1; y <= 5; y++)
	{
		target = document.getElementById("star" + y.toString())
		target.classList = "fa fa-star-o";
		target.style.color = "black";	
	}
}
//設定分數功能
function starSet(i)
{
	var target;
	for (var x = 1; x <= i; x++) {
		target = document.getElementById("star" + x.toString());
		target.classList = "fa fa-star";
		target.style.color = "gold";
		target.onmouseover = "";
	}
	for (var y = i + 1; y <= 5; y++) {
		target = document.getElementById("star" + y.toString())
		target.classList = "fa fa-star-o";
		target.style.color = "black";
		target.onmouseover = "";
	}
	nowStar = i;
}
//Post到comment表
function reserveScoreSendPost(i)
{
	var postData = myData[i];
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"CommentBuilder": postData.manicurist_ID,
		"CommentTarget": postData.member_ID,
		"CommentScore": nowStar,
		"CommentContent": textCommentContent.value,
		"CommentType": true,
		"CommentBuildTime": "2023-01-19T18:16:15",
		"CommentOrderId": postData.order_ID
	});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueCommentTables", requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result=="true")
			{
				reserveScoreSendPut(postData.order_ID);
			} else
				console.log("出錯");
		})
		.catch(error => console.log('error', error));

}
//put到order表
async function reserveScoreSendPut(thisOrderID)
{
	var raw = "";
	var requestOptions = {
		method: 'PUT',
		body: raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YueOrderTables/" + thisOrderID + "/A6/", requestOptions)
		.then(response => response.text())
		.then()
		.catch(error => console.log('error', error));

		reserveScoreSendGet();
	closeInfoModal();
	toastr.success("評論已完成");
}