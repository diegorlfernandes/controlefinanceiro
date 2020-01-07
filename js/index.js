	var firebaseConfig = {
		apiKey: "AIzaSyC8lXhbE9tTQLJKGKvUNSBgXPp_91wtssU",
		authDomain: "cash-d19e8.firebaseapp.com",
		databaseURL: "https://cash-d19e8.firebaseio.com",
		projectId: "cash-d19e8",
		storageBucket: "cash-d19e8.appspot.com",
		messagingSenderId: "855583630551",
		appId: "1:855583630551:web:d824888ff9e30ab8e97c92",
		measurementId: "G-JMGMYS0YDS"
	};


	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
    
    var db = firebase.firestore();



$(document).ready(function(categoria) {

	CriarListaDeMesAno();
	
});


var BancoDeDados = {} ;
var ConexaoComBancoOK = false;
var NomeDoBanco = "dbCash";
var VersaoDoBanco = 1;
var TransicaoDaPagina = 'slide';
var DataAtual = new Date();
var Mes =  String(DataAtual.getMonth()+1).padLeft("0",2); 
var Ano = String(DataAtual.getFullYear());
var MesAno = Mes+"/"+Ano


var RetornoDaAberturaDoBanco = indexedDB.open(NomeDoBanco, VersaoDoBanco);


RetornoDaAberturaDoBanco.onupgradeneeded = function(e) {
	var thisDB = e.target.result;
	var store = null;
	
	if (!thisDB.objectStoreNames.contains("Categoria")) {
		store = thisDB.createObjectStore("Categoria", { keyPath: "Nome"});

	}
	if (!thisDB.objectStoreNames.contains("Lancamento")) {
		store = thisDB.createObjectStore("Lancamento", { keyPath: "LancamentoID", autoIncrement:true });
	    store.createIndex('Descricao', 'Descricao', {unique: false });
		store.createIndex('MesAno, Categoria', ['MesAno', 'Categoria']);
		store.createIndex('Valor', 'Valor', {unique: false });
	}
};

RetornoDaAberturaDoBanco.onsuccess = function(e) {
	BancoDeDados = e.target.result;

};

$(document).on('pagecontainershow', function(e, ui) {
	var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
	switch (pageId) {
		case 'pgMenu':
		if($.type(BancoDeDados)!="object"){
			CriarListaDeMesAno();
		}
		$('#pgMenuMesAno').on('change', function() {
			if($('#pgMenuMesAno').val()){
				MesAno = $('#pgMenuMesAno').val();
			}
		})
		break;
		default:
	}
});


CriarListaDeMesAno = function () {

	option = '<option value="'+"01/2020"+'">'+"01/2020"+'</option>';
				$('#pgMenuMesAno').append(option);
	option = '<option value="'+"02/2020"+'">'+"02/2020"+'</option>';
				$('#pgMenuMesAno').append(option);

				$('#pgMenuMesAno').selectmenu("refresh", true);


};

