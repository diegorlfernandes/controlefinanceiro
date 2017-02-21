
var Database = {};
//variables to hold the indexedDB database.
var dbDatabase;
var dbNome = "dbCash";
var dbVersion = 1;
var pgtransition = 'slide';
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
