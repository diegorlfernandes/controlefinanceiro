function DbCategoria() {
}

DbCategoria.prototype.ListarCategorias = function(){
	var ListaDeCategorias = {};
	
	var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
	
	var store = Transacao.objectStore("Categoria");
	
	var RetornoDaAberturaDoBanco = store.openCursor();

	
	RetornoDaAberturaDoBanco.onsuccess = function(e) {
		var cursor = e.target.result;
		if (cursor) {
			ListaDeCategorias[cursor.key] = cursor.value;
			cursor.continue();
		}
		return ListaDeCategorias;
	}
}
