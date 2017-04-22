
var db = {};
var ConexaoComBancoOK = false;
var NomeDoBanco = "db";
var VersaoDoBanco = 1;

var RetornoDaAberturaDoBanco = indexedDB.open(NomeDoBanco, VersaoDoBanco);

RetornoDaAberturaDoBanco.onupgradeneeded = function (e) {
	var thisDB = e.target.result;
	var store = null;

	//Create Log
	if (!thisDB.objectStoreNames.contains("log")) {
		console.log("I need to make the log objectstore");
		var objectStore = thisDB.createObjectStore("log", {
				keyPath: "id",
				autoIncrement: true
			});
	}

};

RetornoDaAberturaDoBanco.onsuccess = function (e) {
	db = e.target.result;

};

$(document).ready(function () {


	$("#BtnCriarLog").click(function () {
		addLog("Teste");
	});
	$("#BtnImportar").click(function () {
		loadJSON();
	});
	$("#BtnExportar").click(function (e) {

		GettLogin();

		return;

		if (!db)
			return;
		e.preventDefault();
		var link = $("#exportLink");

		//Ok, so we begin by creating the root object:
		var data = {};
		var promises = [];
		for (var i = 0; i < db.objectStoreNames.length; i++) {
			promises.push(

				$.Deferred(function (defer) {

					var objectstore = db.objectStoreNames[i];
					console.log(objectstore);

					var transaction = db.transaction([objectstore], "readonly");
					var content = [];

					transaction.oncomplete = function (event) {
						console.log("trans oncomplete for " + objectstore + " with " + content.length + " items");
						defer.resolve({
							name: objectstore,
							data: content
						});
					};

					transaction.onerror = function (event) {
						console.dir(event);
					};

					var handleResult = function (event) {
						var cursor = event.target.result;
						if (cursor) {
							content.push({
								key: cursor.key,
								value: cursor.value
							});
							cursor.continue();
						}
					};

					var objectStore = transaction.objectStore(objectstore);
					objectStore.openCursor().onsuccess = handleResult;

				}).promise());
		}

		$.when.apply(null, promises).then(function (result) {
			var dataToStore = arguments;
			var serializedData = JSON.stringify(dataToStore);
			document.location = 'data:Application/octet-stream,' + encodeURIComponent(serializedData);
			link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(serializedData));
			link.trigger("click");
		});

	});
});

addLog = function (msg) {
	var logrequest = db.transaction(["log"], "readwrite")
		.objectStore("log")
		.add({
			log: msg,
			timestamp: new Date()
		});
	logrequest.onsuccess = function (e) {
		alert("Sucesso na gravação do log.");
	};
}

loadJSON = function () {

	$.getJSON("C:\inetpub\wwwroot\controlefinanceiro\cash.json", function (json) {
		var i;
		for (i in json[0].data) {
			var nItem = json[0].data[i];
			var logrequest = db.transaction(["log"], "readwrite").objectStore("log").add(nItem.value);
		}
	});
};

function GettLogin() { // pass your data in method
	$.ajax({
		type: "POST",
		url: "https://open.ge.tt/1/users/login",
		data: '{"apikey":"tum8wsxr734lrj08ufj25zsemimepvzvdix2ezyv8bi8zx5hfr","email":"diegorlfernandes@hotmail.com","password":"drlf142536"}', //JSON.stringify(data),// now data come in this function
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: function (data, status, jqXHR) {
			console.log("sucesso Login!");
			GettCreateShare(data);
		},

		error: function (jqXHR, status) {
			// error handler
			console.log(jqXHR);
			alert('fail' + status.code);
		}
	});
}

function GettCreateShare(dataLogin) { // pass your data in method
	GettAddFile(dataLogin.accesstoken, "17MB6nj2");
	return;
	$.ajax({
		type: "POST",
		url: "https://open.ge.tt/1/shares/create?accesstoken=" + dataLogin.accesstoken,
		data: "",
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: function (data, status, jqXHR) {

			console.log("sucesso Create Share!");
			GettAddFile(dataLogin.accesstoken, data.sharename);
			
			
		},

		error: function (jqXHR, status) {
			// error handler
			console.log(jqXHR);
			//alert('fail' + status.code);
		}
	});
}

function GettAddFile(accesstoken, sharename) {
	$.ajax({
		type: "POST",
		url: "https://open.ge.tt/1/files/" + sharename + "/create?accesstoken=" + accesstoken,
		data: '{"filename":"@c:/HaxLogs.txt"}',
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: function (data, status, jqXHR) {

			GettUploadFile(data.upload.posturl);
			console.log("sucesso AddFile!");
		},

		error: function (jqXHR, status) {
			console.log(jqXHR);
		}
	});
}

function GettUploadFile(posturl) {
	
	$.ajax({
		type: "POST",
		url: posturl,
		data: '{"filename":"@c:/HaxLogs.txt"}',
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		dataType: "json",
		success: function (data, status, jqXHR) {

			console.log("sucesso Upload File!");
		},

		error: function (jqXHR, status) {
			console.log(jqXHR);
		}
	});
};

 // function GettUploadFile(posturl) {

		// var formData = new FormData($("#formulario"));

		// $.ajax({
			// url: posturl,
			// type: 'POST',
			// data: formData,
			// success: function (data) {
				// alert(data)
			// },
			// cache: false,
			// contentType: false,
			// processData: false,
			// xhr: function () { // Custom XMLHttpRequest
				// var myXhr = $.ajaxSettings.xhr();
				// if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
					// myXhr.upload.addEventListener('progress', function () {
						// /* faz alguma coisa durante o progresso do upload */
					// }, false);
				// }
				// return myXhr;
			// }
		// });
	
// };
	


$("#formulario").submit(function () {
    var formData = new FormData(this);

    $.ajax({
        url: "http://b3.ge.tt/upload/54a32729176890837e6707d8f9bb4614db60855ddefed34e31cd4379aedffc6fc0cfba9bfd3d391403ccde44d9c13ff5162fd13059929481ac8599696588589c785df536d9d0787b2d4f100e1df45241482f764c5d4136d8584a84342509edf33f9d9ae05df21d96ab1accaa8b8cdbe9a5ac8e05d78f21f0d4a31b53125c38ab",
        type: 'POST',
        data: formData,
        success: function (data) {
            alert(data)
        },
        cache: false,
        contentType: false,
        processData: false,
        xhr: function() {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                myXhr.upload.addEventListener('progress', function () {
                    /* faz alguma coisa durante o progresso do upload */
                }, false);
            }
        return myXhr;
        }
    });
});
