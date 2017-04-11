
var BancoDeDados = {};
var NomeDoBanco = "dbCash";
var VersaoDoBanco = 1;
var TransicaoDaPagina = 'slide';
var DataAtual = new Date();
var Mes =  String(DataAtual.getMonth()+1).padLeft("0",2); 
var Ano = String(DataAtual.getFullYear());
var MesAno = Mes+"/"+Ano

//window.indexedDB.deleteDatabase(NomeDoBanco);

var RetornoDaAberturaDoBanco = indexedDB.open(NomeDoBanco, VersaoDoBanco);

RetornoDaAberturaDoBanco.onupgradeneeded = function(e) {
	var thisDB = e.target.result;
	var store = null;
	
	//create the necessary tables for the application
	// create an indexedDB for IndexedDB-Categoria
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
}

$(document).on('pagecontainershow', function(e, ui) {
	var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
	switch (pageId) {
		case 'pgMenu':
		$("#pgMenuMesAno").val(MesAno).change();
		$('#pgMenuMesAno').on('change', function() {
			MesAno = $('#pgMenuMesAno').val();
		})
		break;
		default:
	}
});



