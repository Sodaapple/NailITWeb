
var nowId;

function clickEye() {
	if (pwInput.type === "password") {
		pwInput.type = "text";
		pwEye.src = "./YuePic/eyeopen.jpg";
	} else {
		pwInput.type = "password";
		pwEye.src = "./YuePic/eyeclose.jpg";
	}
}

async function login() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var flag = false;
	var raw = JSON.stringify([accountInput.value, pwInput.value]);
	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YueMember/", requestOptions)
		.then(response => response.text())
		.then(function (result) {
			if ("noAC" == result)
				toastr.warning("無此帳號，請確認您輸入的帳號是否正確");
			else if ("wrongPW" == result)
				toastr.warning("密碼錯誤了呦");
			else {
				toastr.success("登入成功");
				flag = true;
			}
		}
	).catch(error => console.log('error', error));
	if (flag) {
		console.log(document.referrer);
		location.href = document.referrer == "https://localhost:44308/YueRegister.html" || document.referrer == "https://localhost:44308/Yuelogin.html" ? "/TanTanLib/html/cover.html":document.referrer;
	}
}

function forgor()
{
	infoModal.innerHTML = `<span>請輸入帳號&nbsp&nbsp</span><input id="ACInput" type="text"  />
							<input onclick="forgorSendGet()" type="button" value="確定帳號"style="
								border: 0cm;
								width: 20%;
								background-color: #ff6733;
								color: white;
								margin-left:3%;
							"  /><br /><br />
							<span>你的安全提問&nbsp&nbsp<span><input id="qqInput" type="text" readonly><br /><br />
							<span>請輸入你的安全答案&nbsp&nbsp</span><input id="aaInput" type="text"  /><br />
							<input type="button" style="
								border: 0cm;
								width: 20%;
								background-color: #ff6733;
								color: white;
								right:6%;
								bottom:10%;
								position:absolute;
							"
								onclick="forgorSendPut()"		
								value="確定送出">
					<input
							style="
								border: 0cm;
								width: 20%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:10%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>`; 
	infoModal.style.width = "32%";
	infoModal.style.height = "36%";
	infoModal.showModal();
}

 function forgorSendGet()
{
	var myHeaders = new Headers();

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	 fetch("https://localhost:44308/api/YueMember/" + ACInput.value, requestOptions)
		.then(response => response.text())
		 .then(function (result) {
			 if (result == "") {
				 toastr.warning("無此帳號");
			 }
			 else { qqInput.value = result;toastr.success("已提示安全提問") }
		 })
		.catch(error => console.log('error', error));
}

async function forgorSendPut()
{
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify([ACInput.value, aaInput.value]);

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/YueMember/"+1, requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result > 0) { toastr.success("驗證通過，請更改密碼"); nowId=result }
			else toastr.warning("驗證失敗，請確認您的安全答案");
		})
		.catch(error => console.log('error', error));

	resetPP(nowId);
}

function closeInfoModal()
{
	infoModal.close();
}

async function resetPP(myId)
{
	var myHeaders = new Headers();

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/MemberTables/" + myId, requestOptions)
		.then(response => response.text())
		.then(result => myResult = result)
		.catch(error => console.log('error', error));
	myData = JSON.parse(myResult);
	closeInfoModal();

	infoModal.innerHTML = `<span>您的帳號&nbsp&nbsp</span><input id="ACInput" readonly type="text"  value="` + myData.memberAccount +`" />
							<br /><br />
							<span>請輸入密碼&nbsp&nbsp<span><input id="pwReInput" type="password" ><br /><br />
							<span>再輸入一次&nbsp&nbsp</span><input id="pwReInput2" type="password"  />
							<span style="display: inline">
						
					</span><br />
							<input type="button" style="
								border: 0cm;
								width: 20%;
								background-color: #ff6733;
								color: white;
								right:6%;
								bottom:10%;
								position:absolute;
							"
								onclick="pwResetSendPut()"		
								value="確定送出">
					<input
							style="
								border: 0cm;
								width: 20%;
								color: antiquewhite;
								background-color: black;
								right:30%;
								bottom:10%;
								position:absolute;
							"
							onclick="closeInfoModal()"
							type="button"
							value="返回"
						/>`;
	infoModal.showModal();
}

async function pwResetSendPut()
{
	if (pwReInput.value != pwReInput2.value) { toastr.warning("兩次輸入的密碼需一樣。"); return }
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myData.MemberPassword = pwReInput.value;
	var raw = JSON.stringify(myData);

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	await fetch("https://localhost:44308/api/MemberTables/" + myData.memberId, requestOptions)
		.then(response => response.text())
		.then(result=>console.log(result))
		.catch(error => console.log('error', error));
	toastr.success("更改密碼成功");
	closeInfoModal();
}