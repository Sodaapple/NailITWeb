
async function serviceSendGet()
{
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
	await YueloginCheck();
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://localhost:44308/api/YueServiceTables/"+nowMember, requestOptions)
        .then(response => response.text())
        .then((function (result) {
            myResult = result;
            serviceSet();
        }))
        .catch(error => console.log('error', error));
}

function serviceSet()
{
    myData = JSON.parse(myResult);
	contentdiv.innerHTML = `<div id="innerTitle">美甲師功能＞工作項目設定</div>
	<div
	  id="removeNaildiv"
	  class="tag"
	  style="border-bottom: solid black 2px"
	  onclick="removalSendGet()"
	>
	  卸甲設定
	</div>
	<div id="itemSetdiv" class="tag" onclick="serviceSendGet();">項目設定</div>
	<hr style="border-color: black; margin-top: 0%" />

	<input
	  type="button"
	  style="
		border: 0cm;
		width: 14%;
		margin-left: 1%;
		margin-top: 1%;
		background-color: #ff6733;
		color: white;
	  "
		onclick="serviceAdd()"
	  value="新增項目"
	/>
	<input
	  type="button"
	  style="
		border: 0cm;
		width: 14%;
		margin-left: 1%;
		margin-top: 1%;
		color: antiquewhite;
		background-color: black;
	  "
	  value="刪除項目"
		onclick="serviceDelete()"
	/>
	<br /><br />
	`+ serviceSetLoop()+"</table>";
	for (var y in myData)
	{
		document.getElementById("servicePartC" + y).style.color = "black";
	}
	itemSetdiv.style.borderBottom = "solid black 2px";
	removeNaildiv.style.borderBottom = "solid black 0px";
}

function serviceSetLoop()
{
	if (myData.length == 0) return `<br /><span style="padding-left:5%">目前還沒有自訂服務項目，趕快去新增吧</span>`;
	var i = 0;
	var answer = `<table>
		<tr>
			<th style="width: 50px"></th>
			<th style="width: 100px">施作部位</th>
			<th style="width: 300px">項目名稱</th>
			<th style="width: 150px">預估金額</th>
			<th style="width: 100px">訂金</th>
			<th style="width: 150px"></th>
		</tr>`;
	var myBackground = "";
	for (var x of myData)
	{
		myBackground = (i % 2 == 0) ? "aliceblue" : "lightgray";
		answer += `<tr style="height: 60px; background-color: ` + myBackground +`">
		<td>&nbsp&nbsp&nbsp&nbsp<input id="serviceCheckBox`+i+`"type="checkbox" /></td>
		<td>
			<select id="servicePartC`+ i + `" style="width: 60%;
			  background-color: `+ myBackground +`;
			  border-radius: 4px;
			  border: 0px; width:75%" disabled> 
				<option value="C0" `+( (x.servicePartC == "C0") ?"selected":" ")+`>手</option>
				<option value="C1"`+( (x.servicePartC == "C1") ? "selected" : " " )+`>腳</option>
				<option value="C2"`+( (x.servicePartC == "C2") ? "selected" : " " )+`>手、腳</option>
			</select>
		</td>
		<td>
		  <input
			id="serviceName`+i+`"
			type="text"
			value="`+ x.serviceName+`"
			style="
			  width: 80%;
			  background-color: `+ myBackground +`;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="servicePrice`+i+`"
			type="number"
			value="`+ x.servicePrice+`"
			style="
			  width: 80%;
			  background-color: `+ myBackground +`;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="serviceDeposit`+i+`"
			type="number"
			value="`+ x.seriveDeposit+`"
			style="
			  width: 80%;
			  background-color: `+ myBackground +`;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="changeButton`+i+`"
			type="button"
			value="編輯"
			style="
			  border: 0cm;
			  width: 60%;
			  color: antiquewhite;
			  background-color: black;
			"
			onclick="changeService(`+i+`)"
		  />
		</td>
	  </tr>`;
		i++;
	}
	
	return answer;
	
}

function changeService(i)
{
	var x = myData[i];
	infoModal.innerHTML = `<table>
	  <tr>
		<th style="width: 150px">施作部位</th>
		<th style="width: 300px">項目名稱</th>
		<th style="width: 150px">預估金額</th>
		<th style="width: 100px">訂金</th>
		<th style="width: 150px"></th>
		<th style="width: 150px"></th>
	  </tr>
		<tr style="height: 60px; background-color:white;">
		<td>
			<select id="serviceSetPartC" style="width: 60%;
			  background-color: white;
			  border-radius: 4px;
			  border: 0px; width:75%" > 
				<option value="C0" `+ ((x.servicePartC == "C0") ? "selected" : " ") + `>手</option>
				<option value="C1"`+ ((x.servicePartC == "C1") ? "selected" : " ") + `>腳</option>
				<option value="C2"`+ ((x.servicePartC == "C2") ? "selected" : " ") + `>手、腳</option>
			</select>
		</td>
		<td>
		  <input
			id="serviceSetName"
			type="text"
			value="`+ x.serviceName + `"
			style="
			  width: 80%;
			  background-color: white;
			  border-radius: 4px;
			  border: 0px;
			"
		  />
		</td>
		<td>
		  <input
			id="serviceSetPrice"
			type="number"
			value="`+ x.servicePrice + `"
			style="
			  width: 80%;
			  background-color:white;
			  border-radius: 4px;
			  border: 0px;
			"
		  />
		</td>
		<td>
		  <input
			id="serviceSetDeposit"
			type="number"
			value="`+ x.seriveDeposit + `"
			style="
			  width: 80%;
			  background-color: white;
			  border-radius: 4px;
			  border: 0px;
			"
		  />
		</td>
		<td>
		  <input
			id="changeButton"
			type="button"
			value="取消"
			style="
			  border: 0cm;
			  width: 70%;
			  color: antiquewhite;
			  background-color: black;
			"
			onclick="closeInfoModal()"
		  />
		</td>
		<td>
		  <input
			id="changeButton"
			type="button"
			value="確定"
			style="
			  border: 0cm;
			  width: 70%;
			  color: antiquewhite;
			  background-color: #ff6733;
			"
			onclick="serviceSendPut(`+ i +`)"
		  />
		</td>
	  </tr>
	</table>`;
	infoModal.style.width = "50%";
	infoModal.style.height = "20%";
	infoModal.showModal();
}

function serviceAdd()
{
	infoModal.innerHTML = `<table>
	  <tr>
		<th style="width: 150px">施作部位</th>
		<th style="width: 300px">項目名稱</th>
		<th style="width: 150px">預估金額</th>
		<th style="width: 100px">訂金</th>
		<th style="width: 150px"></th>
		<th style="width: 150px"></th>
	  </tr>
		<tr style="height: 60px; background-color:white;">
		<td>
			<select id="serviceSetPartC" style="width: 60%;
			  background-color: white;
			  border-radius: 4px;
			  border: 0px; width:75%" > 
				<option value="C0">手</option>
				<option value="C1">腳</option>
				<option value="C2">手、腳</option>
			</select>
		</td>
		<td>
		  <input
			id="serviceSetName"
			type="text"
			style="
			  width: 80%;
			  background-color: white;
			  border-radius: 4px;
			  border: 1px black solid;
			"
		  />
		</td>
		<td>
		  <input
			id="serviceSetPrice"
			type="number"
			style="
			  width: 80%;
			  background-color:white;
			  border-radius: 4px;
			  border: 1px black solid;
			"
		  />
		</td>
		<td>
		  <input
			id="serviceSetDeposit"
			type="number"
			style="
			  width: 80%;
			  background-color: white;
			  border-radius: 4px;
			  border: 1px black solid;
			"
		  />
		</td>
		<td>
		  <input
			id="changeButton"
			type="button"
			value="取消"
			style="
			  border: 0cm;
			  width: 70%;
			  color: antiquewhite;
			  background-color: black;
			"
			onclick="closeInfoModal()"
		  />
		</td>
		<td>
		  <input
			id="changeButton"
			type="button"
			value="確定"
			style="
			  border: 0cm;
			  width: 70%;
			  color: antiquewhite;
			  background-color: #ff6733;
			"
			onclick="serviceSendPost()"
		  />
		</td>
	  </tr>
	</table>`;
	infoModal.style.width = "50%";
	infoModal.style.height = "20%";
	infoModal.showModal();
}



function serviceSendPut(i)
{
	var x = myData[i];
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"manicuristId": 2,
		"seriveDeposit": serviceSetDeposit.value,
		"serviceName": serviceSetName.value,
		"servicePartC": serviceSetPartC.value,
		"servicePrice": serviceSetPrice.value
	});

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueServiceTables/" + x.serviceId, requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result) toastr.success("更改成功");
			else toastr.warning("更改失敗");
		})
		.catch(error => console.log('error', error));

	setTimeout(() => {
		serviceSendGet();
	}, 300);
	closeInfoModal();
}

function serviceSendPost()
{
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"manicuristId": nowMember,
		"seriveDeposit": serviceSetDeposit.value,
		"serviceName": serviceSetName.value,
		"servicePartC": serviceSetPartC.value,
		"servicePrice": serviceSetPrice.value
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueServiceTables/", requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result) toastr.success("新增成功");
			else toastr.warning("新增失敗");
		})
		.catch(error => console.log('error', error));
	setTimeout(() => {
		serviceSendGet();
	}, 300);
	closeInfoModal();
}


function serviceDelete()
{
	
	infoModal.innerHTML = `<h4>確定刪除下列項目？</h4><div style="height:80%;overflow:auto" ><table>
		<tr>
			<th style="width: 150px">施作部位</th>
			<th style="width: 300px">項目名稱</th>
			<th style="width: 150px">預估金額</th>
			<th style="width: 100px">訂金</th>
		</tr>`+ serviceDeleteLoop() + `</table></div>
		<input type="button" value="取消" style="border: 0cm; width: 20%; color: antiquewhite; background-color: black; margin-top:1.5%; margin-left:57.2%" onclick="closeInfoModal()">
		<input type="button" value="確定" style="border: 0cm; width: 20%; color: antiquewhite; background-color: #ff6733; margin-top:1.5%;margin-left:2%" onclick="serviceSendDelete()">
	`;
	
	infoModal.style.width = "47%";
	infoModal.style.height = "57%";
	infoModal.showModal();
}

function serviceDeleteLoop() {
	var answer = "";
	var i = 0;
	for (var x of myData) {
		if (document.getElementById("serviceCheckBox" + i).checked != true)
		{
			i++;
			continue;
		}
		myBackground = (i % 2 == 0) ? "aliceblue" : "lightgray";
		answer += `
		<tr style="height: 60px; background-color: ` + myBackground + `">
		<td>
			<select id="servicePartC`+ i + `" style="width: 60%;
			  background-color: `+ myBackground + `;
			  border-radius: 4px;
			  border: 0px; width:75%" disabled> 
				<option value="C0" `+ ((x.servicePartC == "C0") ? "selected" : " ") + `>手</option>
				<option value="C1"`+ ((x.servicePartC == "C1") ? "selected" : " ") + `>腳</option>
				<option value="C2"`+ ((x.servicePartC == "C2") ? "selected" : " ") + `>手、腳</option>
			</select>
		</td>
		<td>
		  <input
			id="serviceName`+ i + `"
			type="text"
			value="`+ x.serviceName + `"
			style="
			  width: 80%;
			  background-color: `+ myBackground + `;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="servicePrice`+ i + `"
			type="number"
			value="`+ x.servicePrice + `"
			style="
			  width: 80%;
			  background-color: `+ myBackground + `;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />
		</td>
		<td>
		  <input
			id="serviceDeposit`+ i + `"
			type="number"
			value="`+ x.seriveDeposit + `"
			style="
			  width: 80%;
			  background-color: `+ myBackground + `;
			  border-radius: 4px;
			  border: 0px;
			"
			readonly
		  />	
		</td>
		</tr>`;
		i++;
	}
	return answer;
}

async function serviceSendDelete()
{
	var raw = "";
	var requestOptions = {
		method: 'DELETE',
		body: raw,
		redirect: 'follow'
	};
	for (var i = 0; i < myData.length;i++)
	{
		if (document.getElementById("serviceCheckBox" + i).checked == true)
		{
			console.log(myData);
			await fetch("https://localhost:44308/api/YueServiceTables/"+myData[i].serviceId, requestOptions)
				.then(response => response.text())
				.then(function (result) {
					if (result)
					{
						console.log(i);
						toastr.success("已刪除項目");
					}
					else {
						toastr.warning("刪除項目時出錯了");
					}
				})
				.catch(error => console.log('error', error));
		}
	}

	closeInfoModal();
	serviceSendGet();
}

