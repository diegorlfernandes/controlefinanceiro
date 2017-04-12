
var BancoDeDados = {} ;
var ConexaoComBancoOK = false;
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
	CriarListaDeMesAno();
};

$(document).on('pagecontainershow', function(e, ui) {
	var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
	switch (pageId) {
		case 'pgMenu':
		if($.type(BancoDeDados)!="object")
		CriarListaDeMesAno();
		$("#pgMenuMesAno").val(MesAno).change();
		$('#pgMenuMesAno').on('change', function() {
			MesAno = $('#pgMenuMesAno').val();
		})
		break;
		default:
	}
});

CriarListaDeMesAno = function () {
	$.mobile.loading("show", 
	{
		text: "Loading report...",
		textVisible: true, 
		textonly: false, 
		html: ""
	});
	
	$('#pgMenuMesAno').empty();
	
	var tx = BancoDeDados.transaction(['Lancamento'], "readonly");
	var store = tx.objectStore('Lancamento').index('MesAno, Categoria');
	var MesAnoTemporario;
	
	store.openCursor().onsuccess = function(e) 
	{
		
		var cursor = e.target.result;
		var ListaMesAno = new Array();
		if (cursor) 
		{
			
			UmObjetoLancamento = cursor.value;
			
			
			if(MesAnoTemporario != UmObjetoLancamento.MesAno)
			{
				var option = '<option value="'+UmObjetoLancamento.MesAno+'">'+UmObjetoLancamento.MesAno+'</option>';
				$('#pgMenuMesAno').append(option);
				MesAnoTemporario=UmObjetoLancamento.MesAno;
				ListaMesAno.push(new Array(UmObjetoLancamento.MesAno));
			}
			
			cursor.continue();
			}else{
			var EncontrouNaLista = false;
			for(var i=0;i<ListaMesAno.length;i++){
				
				if (ListaMesAno[i]==MesAno)
				EncontrouNaLista = true;
			}
			if(!EncontrouNaLista){
				option = '<option value="'+MesAno+'">'+MesAno+'</option>';
				$('#pgMenuMesAno').append(option);
			}
			
		}
	}
	
	$('#pgMenuMesAno').selectmenu("refresh", true);
	$("#pgMenuMesAno").val(MesAno).change();
	$.mobile.loading("hide");
};



