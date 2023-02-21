
async function removalSendGet()
{
	await YueloginCheck();
	tedDiv.style.display = "none";
	contentdiv.style.display = "block";
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

   await fetch("https://localhost:44308/api/YueRemovalPriceTables/"+nowMember, requestOptions)
        .then(response => response.text())
        .then(result=>
            myResult = result)
		.catch(error => console.log('error', error));
	console.log(nowMember);
	removalSee();
}

function removalSee()
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
				<br />
				<div id="innerContent" class="innerContent">
					<table style="margin-left: 4%">
						<tr style="font-size: 20px">
							<th style="width: 300px; height: 70px">&nbsp &nbsp卸甲項目</th>
							<th style="width: 300px">預估價格</th>
						</tr>
						<tr style="background-color: lightgray">
							<td style="height: 50px">&nbsp &nbsp不用卸甲</td>
							<td>
								<input
									id="removeNail1"
									type="number"
									value="`+ myData.removalPriceB0 +`"
									readonly
									style="
										border-radius: 4px;
										background-color: lightgray;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: aliceblue">
							<td style="height: 50px">&nbsp &nbsp去指甲油</td>
							<td>
								<input
									id="removeNail2"
									type="number"
									value="`+ myData.removalPriceB1+`"
									readonly
									style="
										border-radius: 4px;
										background-color: aliceblue;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: lightgray">
							<td style="height: 50px">&nbsp &nbsp本店卸甲</td>
							<td>
								<input
									id="removeNail3"
									type="number"
									value="`+ myData.removalPriceB2+`"
									readonly
									style="
										border-radius: 4px;
										background-color: lightgray;
										border: 0ex;
									"
								/>
							</td>
						</tr>
						<tr style="background-color: aliceblue">
							<td style="height: 50px">&nbsp &nbsp他店卸甲</td>
							<td>
								<input
									id="removeNail4"
									type="number"
									style="
										border-radius: 4px;
										background-color: aliceblue;
										border: 0ex;
									"
									value="`+ myData.removalPriceB3+`"
									readonly
								/>
							</td>
						</tr>
					</table>
					<input
						id="cancelbtn"
						type="button"
						value="取消"
						style="
							border: 0cm;
							width: 18%;
							margin-top: 5%;
							margin-left: 45%;
							color: antiquewhite;
							background-color: black;
							width: 18%;
							visibility: hidden;
							
						"
						onclick="setRemoveNail(false)"
					/>
					<input
						id="checkButton"
						type="button"
						value="修改"
						style="
							border: 0cm;
							width: 18%;
							margin-top: 5%;
							margin-left: 4%;
							background-color: #ff6733;
							color: white;
						"
						
					/>
				</div>`;
	removeNaildiv.style.borderBottom = "solid black 2px";
	itemSetdiv.style.borderBottom = "solid black 0px";
	checkButton.addEventListener("click", setRemoveNail, { passive: true });
}


function setRemoveNail(check) {
	if (check) {
		cancelbtn.style.visibility = "visible";
		removeNail1.readOnly = false;
		removeNail2.readOnly = false;
		removeNail3.readOnly = false;
		removeNail4.readOnly = false;
		checkButton.value = "確定";
		checkButton.removeEventListener("click", setRemoveNail, { passive: true });
		checkButton.addEventListener("click", removalSendPut);
	}
	else removalSendGet();
}

function removalSendPut() {

	if (removeNail1.value == myData.removalPriceB0 && removeNail2.value == myData.removalPriceB1 &&
		removeNail3.value == myData.removalPriceB2 && removeNail4.value == myData.removalPriceB3)
	{
		toastr.warning("並未改變任何項目");
		setRemoveNail(false);
		return;
	}
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"removalPriceManicuristID": nowMember,
		"removalPriceB0": removeNail1.value,
		"removalPriceB1": removeNail2.value,
		"removalPriceB2": removeNail3.value,
		"removalPriceB3": removeNail4.value
	});

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("https://localhost:44308/api/YueRemovalPriceTables/"+nowMember, requestOptions)
		.then(response => response.text())
		.then(function (result)
		{
			if (result)
			{
				toastr.success("卸甲項目價格已成功更改");
				setRemoveNail(false);
			}
			else
			{
				toastr.warning("失敗");
			}
		})
		.catch(error => console.log('error', error));

}