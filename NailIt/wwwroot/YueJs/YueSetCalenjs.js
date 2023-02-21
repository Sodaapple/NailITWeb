
var myResult;
var myData;
var nowDay;
var mySelectTime;
var nowMonth;
async function calenSendGet() {
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YuePlanTables/"+nowMember, requestOptions)
		.then(response => response.text())
		.then(result=>myResult = result)
		.catch(error => console.log('error', error));
	await calenSet();
	loadScript("../YueJs/YueCalen.js", buildCalen, buildCalen);
}

function calenSet()
{
	myData = JSON.parse(myResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞時間設定</div>
				<div 
					 class="tag"
					 style="border-bottom: solid black 2px"
					 onclick="">
					日曆
				</div>
				<div class="calendar">
					<div class="header">
						<button type="button" class="lastYear btnnotclick" title="Last year"></button>
						<button type="button" class="lastMonth" title="Last month">
							<i class="bi bi-chevron-compact-left"></i>
						</button>
						<div id="selectedDay" class="currentDate"></div>
						<button type="button" class="nextMonth" title="Next month">
							<i class="bi bi-chevron-compact-right"></i>
						</button>
						<button type="button" class="nextYear btnnotclick" title="Next year"></button>
					</div>
					<div class="days">
						<div class="day">一</div>
						<div class="day">二</div>
						<div class="day">三</div>
						<div class="day">四</div>
						<div class="day">五</div>
						<div class="day">六</div>
						<div class="day">日</div>
					</div>
					<div class="dates"></div>
					<div style="margin-top:2%">
					<span style="font-size:17px;margin-right:2%">當月行程</span>
						<select id="monthSelect">
							<option>01月</option><option>02月</option><option>03月</option><option>04月</option><option>05月</option>
							<option>06月</option><option>07月</option><option>08月</option><option>09月</option><option>10月</option>
							<option>11月</option><option>12月</option>
						</select>
						<input type="button"
							   style="
								border: 0cm;
								width: 14%;
								margin-left: 5%;
								margin-top: 1%;
								background-color: #ff6733;
								color: white;
								"
							   onclick="planMonthAdd()"
							   value="按月新增行程" />
						<input type="button"
							   style="
									border: 0cm;
									width: 14%;
									margin-left: 2%;
									margin-top: 1%;
									color: antiquewhite;
									background-color: black;
									"
							   value="刪除行程"
							   onclick="planSendDelete(`+false+`)" />

					</div>
					<hr /><div id="lastdiv"></div>`;
	monthSelect.addEventListener("change", () => { calenSetMonth(monthSelect.value.substring(0,2)); });
	monthSelect.selectedIndex = -1;
} 

function calenSetDay(selectedTime)
{
	mySelectTime = selectedTime;
	var myY = selectedTime.substring(0, 4);
	var myM = selectedTime.substring(5,7);
	var myD = selectedTime.substring(8, 10);
	var answer = "";	
	answer = `<div style="margin-top:2%">
						<span style="font-size:130%">當日行程</span>
						<input type="button"
							   style="
								border: 0cm;
								width: 14%;
								margin-left: 5%;
								margin-top: 1%;
								background-color: #ff6733;
								color: white;
								"
							   onclick="planOneAdd(`+ myY +","+myM+","+myD+`)"
							   value="新增行程" />
						<input type="button"
							   style="
									border: 0cm;
									width: 14%;
									margin-left: 2%;
									margin-top: 1%;
									color: antiquewhite;
									background-color: black;
									"
							   value="刪除行程"
							   onclick="planSendDelete(`+true+`)" />

					</div>
					<hr />
					<table>
						<tr>
							<th style="width: 50px;text-align:center"></th>
							<th style="width: 200px; text-align: center">日期</th>
							<th style="width: 200px;text-align:center">施作時間</th>
							<th style="width: 200px; text-align: center">預定</th>
							<th style="width: 200px; text-align: center"></th>
						</tr>`;
	for (var x of myData)
	{
		var myDing = x.orderId == null ? "尚未預定" : "已預定";
		var aColor = myDing == "尚未預定" ? "gray" : "";
		var myDate = x.planStartTime.substring(0, 10);
		if (myDate!=selectedTime) {
			continue;
		}
		var myTime = x.planStartTime.substring(11, 19);
		switch ((new Date(myDate)).getDay())
		{
			case 1:  myWeek = "一"; break; 
			case 2:  myWeek = "二"; break; 
			case 3:  myWeek = "三"; break; 
			case 4:  myWeek = "四"; break; 
			case 5:  myWeek = "五"; break; 
			case 6: myWeek = "六";break;
			default:myWeek = "日";
		}
		answer += `<tr style="height: 60px; background-color:aliceblue">
							<td>&nbsp&nbsp&nbsp&nbsp<input id="plan`+x.planId+`" type="checkbox" /></td>
							<td style="text-align: center">`+myDate+`</td>
							<td style="text-align: center">`+ myTime +`</td>
							<td style="text-align: center">`+ myDing +`</td>
							<td style="text-align: center">
								<a href="#"	onclick="getPlanDetail(`+ x.orderId+`)" style="color:`+aColor+`">訂單詳情</a>
							</td>
					</tr>`;
	}
	
	answer += "</table>";
	infoModal.innerHTML = "";
	infoModal.insertAdjacentHTML("beforeend", answer);
	infoModal.style.width = "50%";
	infoModal.style.height = "50%";
	infoModal.showModal();
}

function buildCalen() {
	setTimeout(function ()
	{
		const calendar = document.querySelector('.calendar');
		new Calendar({
			element: calendar,
			// defaultDate: new Date(1999, 9, 9)
		});
	
	}, 40)

}

function loadScript(url, callback, callbackError) {
	if (document.getElementById("myScript") == null) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.id = "myScript";
		try {
			if (script.readyState) {  //IE
				script.onreadystatechange = function () {
					if (script.readyState === "loaded" || script.readyState === "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				//其餘瀏覽器支援onload
				script.onload = function () {
					callback();
				};
			}

			script.src = url;
			document.getElementsByTagName("body")[0].appendChild(script);
		} catch (e) {
			if (null !== callbackError) callbackError(e);
		}
	}
	else
	{
		callback();
	}
}

function getPlanDetail(id)
{
	console.log(id);
}

function calenSetMonth(month)
{
	nowMonth=month
	var answer = "";
	answer = `
					<table>
						<tr>
							<th style="width: 50px;text-align:center"></th>
							<th style="width: 200px; text-align: center">日期</th>
							<th style="width: 200px;text-align:center">施作時間</th>
							<th style="width: 200px; text-align: center">預定</th>
							<th style="width: 200px; text-align: center"></th>
						</tr>`;
	for (var x of myData) {
		if (x.planStartTime.substring(5, 7) != nowMonth) continue;
		var myDing = x.orderId == null ? "尚未預定" : "已預定";
		var aColor = myDing == "尚未預定" ? "gray" : "";
		var myDate = x.planStartTime.substring(0, 10);
		var myTime = x.planStartTime.substring(11, 19);
		switch ((new Date(myDate)).getDay()) {
			case 1: myWeek = "一"; break;
			case 2: myWeek = "二"; break;
			case 3: myWeek = "三"; break;
			case 4: myWeek = "四"; break;
			case 5: myWeek = "五"; break;
			case 6: myWeek = "六"; break;
			default: myWeek = "日";
		}
		answer += `<tr style="height: 60px; background-color:aliceblue">
							<td>&nbsp&nbsp&nbsp&nbsp<input id="plan`+ x.planId + `" type="checkbox" /></td>
							<td style="text-align: center">`+ myDate + `</td>
							<td style="text-align: center">`+ myTime + `</td>
							<td style="text-align: center">`+ myDing + `</td>
							<td style="text-align: center">
								<a href="#"	onclick="getPlanDetail(`+ x.orderId + `)" style="color:` + aColor + `">訂單詳情</a>
							</td>
					</tr>`;
	}

	answer += "</table>";
	lastdiv.innerHTML = "";
	lastdiv.insertAdjacentHTML("beforeend", answer);
}

function planOneAdd(myY,myM,myD)
{
	myM = myM >= 10 ? myM : "0" + myM;
	myD = myD >= 10 ? myD : "0" + myD;
	nowDay = String(myY) + "-" + String(myM) + "-" + String(myD);
	
	infoModal2.innerHTML = `<table>
						<tr>
							<th style="width: 200px; text-align: center">日期</th>
							<th style="width: 400px;text-align:center">施作時間</th>
							<th style="width: 400px; text-align: center">備註</th>
						</tr>
						<tr style="height: 60px; background-color:aliceblue">
							<td style="text-align: center">`+ nowDay +`</td>
							<td  style="text-align: center">
								<input id="oneTime" type="time" style="width:50%"  />
							</td>
							<td id="oneRemark" style="text-align: center">
								<input type="text"  />
							</td>
						</tr></table>
				<input
			id="changeButton"
			type="button"
			value="取消"
			style="
			  border: 0cm;
			  width: 20%;
			  color: antiquewhite;
			  background-color: black;
margin-left:55%;margin-top:3%;margin-right:3%;
			"
			onclick="closeInfoModal2()"
		  />
 <input
			id="changeButton"
			type="button"
			value="確定"
			style="
			  border: 0cm;
			  width: 20%;
			  color: antiquewhite;
			  background-color: #ff6733;
			"
			onclick="planSendPost()"
		  />
`;
	infoModal2.style.width = "50%";
	infoModal2.style.height = "25%";
	infoModal2.showModal();
}

function closeInfoModal2()
{
	infoModal2.close();
}

function planSendPost()
{
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	if (oneTime.value == "") {
		toastr.warning("請輸入時間");
		return;
	}
	var raw = JSON.stringify({
		"manicuristId": nowMember,
		"orderId": null,
		"planRemark":oneRemark.value,
		"planStartTime": nowDay + "T" + oneTime.value
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YuePlanTables/", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	setTimeout(() => {
		calenSendGet();
		closeInfoModal();
		closeInfoModal2();
		setTimeout(() => { calenSetDay(mySelectTime); }, 100);
		toastr.success("已新增行程");
	}, 200)
}

function planSendDelete(flag)
{
	deleteArray = new Array;
	for (var x of myData)
	{
		if (document.getElementById("plan" + x.planId) == null) continue;
		if (document.getElementById("plan" + x.planId).checked == true)
			deleteArray.push(x.planId);
	}
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify(deleteArray);

	var requestOptions = {
		method: 'DELETE',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YuePlanTables/", requestOptions)
		.then(response => response.text())
		.then(result=> console.log(result))
		.catch(error => console.log('error', error));

	if (flag) {
		setTimeout(() => {
			calenSendGet();
			closeInfoModal();
			closeInfoModal2();
			setTimeout(() => { calenSetDay(mySelectTime); }, 100);
			toastr.success("已刪除行程");

		}, 200)
	}
	else
	{
		setTimeout(() => {
			calenSendGet();
			setTimeout(() => { calenSetMonth(nowMonth); }, 100);
			toastr.success("已刪除行程");

		}, 200)
	}
}

function planMonthAdd()
{
	infoModal.innerHTML = `<span style="font-size:17px;margin-right:2%">按月新增</span>
						<input id="theYear" type="number" style="width:10%;height:25px;margin-left:5%"min=2023 value=2023><span style="margin-left:1%">年</span>
						<select id="monthSelect2">
							<option>01月</option><option>02月</option><option>03月</option><option>04月</option><option>05月</option>
							<option>06月</option><option>07月</option><option>08月</option><option>09月</option><option>10月</option>
							<option>11月</option><option>12月</option>
						</select><br /><br />
						<span>星期</span><lable for="date1" style="margin-left:10%">一</lable>
						<lable for="date2" style="margin-left:7%">二</lable>
	<lable for="date3" style="margin-left:7%">三</lable>
	<lable for="date4" style="margin-left:7%">四</lable>
	<lable for="date5" style="margin-left:7%">五</lable>
	<lable for="date6" style="margin-left:7%">六</lable>
	<lable for="date7" style="margin-left:7%">日</lable><br />
	<input id="date1" type="checkbox" style="margin-left:18%" />
	<input id="date2" type="checkbox" style="margin-left:7.8%" />
	<input id="date3" type="checkbox" style="margin-left:7.8%" />
	<input id="date4" type="checkbox" style="margin-left:7.6%" />
	<input id="date5" type="checkbox" style="margin-left:7.7%" />
	<input id="date6" type="checkbox" style="margin-left:7.8%" />
	<input id="date7" type="checkbox" style="margin-left:7.7%" /><br /><br />
	<lable for="dateInput" style="margin-right:4%">時間</lable>
	<input id="dateInput" type="time" style="margin-left:5%"><br /><br />
	<lable for="bigDateRemark" style="margin-right:9%" >備註</lable>
	<input id="bigDateRemark" type="text" style="width:75%" />
	<input
			id="changeButton"
			type="button"
			value="取消"
			style="
			  border: 0cm;
			  width: 20%;
			  color: antiquewhite;
			  background-color: black;
margin-left:55%;margin-top:4%;margin-right:3%;
			"
			onclick="closeInfoModal()"
		  />
 <input
			id="changeButton"
			type="button"
			value="確定"
			style="
			  border: 0cm;
			  width: 20%;
			  color: antiquewhite;
			  background-color: #ff6733;
			"
			onclick="planAddMonth()"
		  />
`;
	infoModal.style.height = "40%";
	infoModal.showModal();
}

function planAddMonth()
{
	var resultArray = [];
	var dateArray = [];
	var myDay=1;
	for (var i = 1; i < 8; i++)
	{
		if (document.getElementById("date" + i).checked == true)
			dateArray.push(i);
	}
	if (dateInput.value == "" || dateArray.length == 0) { toastr.warning("時間及星期都要輸入喔"); return; }
	
	var theDate = new Date(theYear.value, parseInt(monthSelect2.value.substring(0, 2)) - 1, String(myDay));
	new Date(theYear.value, parseInt(monthSelect2.value.substring(0, 2)), myDay);
	while(true)
	{
		theDate = new Date(theYear.value, parseInt(monthSelect2.value.substring(0, 2)) - 1, String(myDay))
		if (theDate.getMonth() != parseInt(monthSelect2.value.substring(0, 2)) - 1 ) break;
		if (dateArray.includes((theDate.getDay())) && new Date() < theDate)
		{
			
			resultArray.push(theDate.getFullYear() + "-" +
				((parseInt(theDate.getMonth()) + 1) >= 10 ? (parseInt(theDate.getMonth()) + 1) : "0" + (parseInt(theDate.getMonth()) + 1)) +
				"-" + (String(theDate.getDate()).length > 1 ? theDate.getDate() : "0" + theDate.getDate()) +
				"T" + dateInput.value);
		}
		myDay++;
	}
	planAddMonthSendPost(resultArray);
}

async function planAddMonthSendPost(resultArray)
{
	var sendPostData = [];
	for (var x of resultArray)
	{
		sendPostData.push({ "ManicuristId": nowMember, "PlanStartTime": x, "OrderId": null, "PlanRemark": bigDateRemark.value })
	}

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify(sendPostData);

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YuePlanTables/", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	await calenSendGet();
	calenSetMonth(nowMonth)
	closeInfoModal();
	toastr.success("已批次增加行程");

}