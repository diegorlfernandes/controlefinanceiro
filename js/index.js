
var Database = {};
//variables to hold the indexedDB database.
var dbDatabase;
var dbNome = "dbCash";
var dbVersion = 1;
var pgtransition = 'slide';
var DataAtual = new Date();
var Mes =  String(DataAtual.getMonth()+1).padLeft("0",2); //monthNamesShort[DataAtual.getMonth()];
var Ano = String(DataAtual.getFullYear());
var MesAno = Mes+"/"+Ano



//window.indexedDB.deleteDatabase(dbNome);

var request = indexedDB.open(dbNome, dbVersion);

request.onupgradeneeded = function(e) {
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
		store.createIndex('Categoria', 'Categoria', {unique: false });
		store.createIndex('Valor', 'Valor', {unique: false });
	}
};


//the database was opened successfully
request.onsuccess = function(e) {
	dbDatabase = e.target.result;
}


$(document).on('pagecontainershow', function(e, ui) {
	var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
	switch (pageId) {
		case 'pgMenu':
		$("#pgMenuFtrH1").html(MesAno);
		break;
		case 'pgConfiguracao':
		$('.date-picker').datepicker( {
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			dateFormat: 'MM yy',
			onClose: function(dateText, inst) { 
				$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
			}
		});
		break;
		default:
	}
});



