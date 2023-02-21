var nowMember;
var nowAccount;
var nowNickName;
var daMember;
async function YueloginCheck() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	var myresult;
	await fetch("/api/LoginCheck", requestOptions)
		.then(response => response.text())
		.then(result => myresult = result)
		.catch(error => console.log('error', error));
	if (myresult == "") {
		nowMember = -1;
		nowAccount = -1;
		nowNickName = "";
	}
	else {
		daMember=JSON.parse(myresult)[0]
		nowMember = daMember.memberId;
		nowAccount = daMember.memberAccount;
		nowNickName = daMember.memberNickname;
	}
	headChange();
}

function headChange() {
	if (nowMember != -1) {
		huiORreg.innerText = "會員中心";
		huiORreg.href = "/tedLb/tedmember.html#";
		loginORout.innerText = "登出";
		loginORout.addEventListener("click", YueLogout, true);
		daNick.innerHTML = "Hi！" + nowNickName + "&nbsp&nbsp&nbsp&nbsp&nbsp";
	}
	else {
		huiORreg.innerText = "註冊";
		huiORreg.href = "/YueRegister.html";
		loginORout.innerText = "登入";
		loginORout.href = "/Yuelogin.html";
		daNick.innerHTML = "尚未登入&nbsp&nbsp&nbsp&nbsp&nbsp";
	}
}

async function YueLogout()
{
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	await fetch("/api/YueLogout", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	location.href("/TanTanLib/html/cover.html");
}