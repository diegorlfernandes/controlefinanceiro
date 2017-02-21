
var Database = {};
//variables to hold the indexedDB database.
var dbDatabase;
var dbNome = "dbCash";
var dbVersion = 1;
var pgtransition = 'slide';
//window.indexedDB.deleteDatabase(dbNome);


request.onupgradeneeded = function(e) {
   var thisDB = e.target.result;
   var store = null;

   //create the necessary tables for the application
   // create an indexedDB for IndexedDB-Categoria
   if (!thisDB.objectStoreNames.contains("Categoria")) {
	   // create objectStore for PrimaryKey as keyPath="Nome"
	   store = thisDB.createObjectStore("Categoria", { keyPath: "Nome"});
		//store = thisDB.createObjectStore("Categoria", { keyPath: "LancamentoID" },autoIncrement:true);
	   // thisDB.createObjectStore("Categoria", { autoIncrement: true });
	   // create index to 'Nome' for conditional search
	   // store.createIndex('Nome', 'Nome', {unique: false });
   }
   if (!thisDB.objectStoreNames.contains("Lancamento")) {
	   store = thisDB.createObjectStore("Lancamento", { keyPath: "Nome" });
   }
};

var request = indexedDB.open(dbNome, dbVersion);

//the database was opened successfully
request.onsuccess = function(e) {
   dbDatabase = e.target.result;
}
