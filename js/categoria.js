

$(function() {
    (function(categoria) {
        var MensagemNoCabecalhoDaLista = '<li data-role="list-divider">Suas Categorias</li>';
        var MensagemNaoTemRegistroNaLista = '<li id="noCategoria">Você não tem registros</li>';
		
        categoria.iniciar = function(){
			categoria.ExecutarEventosTodasAsPaginas();
			categoria.ExecutarEventosDaPaginaListarCategoria();
			categoria.ExecutarEventosDaPaginaAdicionarCategoria();
			categoria.ExecutarEventosDaPaginaEditarCategoria();
			categoria.ExecutarEventosMensagens();
		};

		
		//****** Eventos ******
		categoria.ExecutarEventosTodasAsPaginas = function(){					
            $(document).on('pagebeforechange', function(e, data) {
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgCategoria');
					categoria.MostraMensagemNaPaginaDeListarCategorias();
					break;
                    case 'pgEditCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgEditCategoria');
					categoria.LimparCamposDaPaginaEditarCategoria();
					var Nome = $('#pgEditCategoria').data('id');
					PreencheCamposDaPaginaEditarCategoria(Nome);
					break;
                    case 'pgAddCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgAddCategoria');
					categoria.LimparCamposDaPaginaAdicionarCategoria();
					break;
				}
			});
            $(document).on('pagecontainershow', function(e, ui) {
                var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
                switch (pageId) {
                    case 'pgEditCategoria':
					break;
                    case 'pgAddCategoria':
					break;
                    default:
				}
			});
		};
		
		categoria.ExecutarEventosDaPaginaListarCategoria = function(){
            $(document).on('click', '#pgCategoriaList a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                $('#pgEditCategoria').data('id', href);
                $.mobile.changePage('#pgEditCategoria', { transition: TransicaoDaPagina });
			});
            $('#pgCategoriaNew').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $('#pgAddCategoria').data('from', 'pgCategoria');
                $('#pgAddCategoriaheader h1').text('Categorias BancoDeDados > Add Categoria');
                $('#pgAddCategoriaMenu').show();
                $.mobile.changePage('#pgAddCategoria', { transition: TransicaoDaPagina });
			});
		}		
		categoria.ExecutarEventosDaPaginaAdicionarCategoria = function()	{
            $('#pgAddCategoriaBack').on('click', function(e) 
			{
                e.preventDefault();
                e.stopImmediatePropagation(); 
				$.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
			});
			
			$('#pgAddCategoriaSave').on('click', function(e) 
			{
                e.preventDefault();
                e.stopImmediatePropagation();
				
                var UmObjetoDeCategoria = categoria.PegarCamposDaPaginaDeAdicionarCategoriaETransformaEmRegistro();
                categoria.AdicionarCategoriaAoBancoDeDados(UmObjetoDeCategoria);
				categoria.LimparCamposDaPaginaAdicionarCategoria();
			});			
		};
		categoria.ExecutarEventosDaPaginaEditarCategoria = function(){
            $('#pgEditCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
			});
			
            $('#pgEditCategoriaUpdate').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var UmObjetoDeCategoria = categoria.PegarCamposDaPaginaDeEditarCategoriaETransformaEmRegistro();
                if(categoria.AtualizarCategoriaNoBancoDeDados(UmObjetoDeCategoria))
				{
                    categoria.LimparCamposDaPaginaEditarCategoria();					
				};
			});
			
            $('#pgEditCategoriaDelete').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var Nome = $('#pgEditCategoriaNome').val().trim();
                $('#msgboxheader h1').text('Confirm Delete');
                $('#msgboxtitle').text(Nome.split('-').join(' '));
                $('#msgboxprompt').text('Are you sure that you want to delete this Categoria? This action cannot be undone.');
                $('#msgboxyes').data('method', 'ApagarCategoriaDoBancoDeDados');
                $('#msgboxno').data('method', 'editCategoria');
                $('#msgboxyes').data('id', Nome.split(' ').join('-'));
                $('#msgboxno').data('id', Nome.split(' ').join('-'));
                $('#msgboxyes').data('topage', 'pgEditCategoria');
                $('#msgboxno').data('topage', 'pgEditCategoria');
                $.mobile.changePage('#msgbox', { transition: 'pop' });
			});			
		};
		categoria.ExecutarEventosMensagens = function() {
		
			$('#msgboxyes').on('click', function (e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var yesmethod = $('#msgboxyes').data('method');
				var yesid = $('#msgboxyes').data('id');
				categoria[yesmethod](yesid);
			});
			$('#msgboxno').on('click', function (e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var nomethod = $('#msgboxno').data('method');
				var noid = $('#msgboxno').data('id');
				var toPage = $('#msgboxno').data('topage');
				$.mobile.changePage('#' + toPage, {transition: TransicaoDaPagina});
				categoria[nomethod](noid);
			});
			$('#alertboxok').on('click', function (e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var toPage = $('#alertboxok').data('topage');
				$.mobile.changePage('#' + toPage, {transition: TransicaoDaPagina});
			});
		};
						
        
		//****** Página Listar Categoria ******

        categoria.MostraMensagemNaPaginaDeListarCategorias = function() {
            $.mobile.loading("show", {
                text: "Checking storage...",
                textVisible: true,
                textonly: false,
                html: ""
			});
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
				
				if (!$.isEmptyObject(ListaDeCategorias)) {
					
					var html = '';
					var UmObjetoDeCategoria;
					
					for (UmObjetoDeCategoria in ListaDeCategorias) {
						var UmObjetoDeCategoria = ListaDeCategorias[UmObjetoDeCategoria];
						
						UmObjetoDeCategoria.Nome = UmObjetoDeCategoria.Nome.split('-').join(' ');
						
						var NovoItemDaListaDaPagina = '<li><a data-id="Z2"><h2>Z1</h2></a></li>';
						NovoItemDaListaDaPagina = NovoItemDaListaDaPagina.replace(/Z2/g, UmObjetoDeCategoria.Nome);
						
						var nTitle = '';
						
						nTitle = UmObjetoDeCategoria.Nome.split('-').join(' ');
						
						NovoItemDaListaDaPagina = NovoItemDaListaDaPagina.replace(/Z1/g, nTitle);
						
						html += NovoItemDaListaDaPagina;
					}
					$('#pgCategoriaList').html(MensagemNoCabecalhoDaLista + html).listview('refresh');
					} else{
                    $('#pgCategoriaList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');
				}
			}
            $.mobile.loading("hide");
            RetornoDaAberturaDoBanco.onerror = function(e) {
                $.mobile.loading("hide");
                $('#pgCategoriaList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');
			}
		};
		
		
		// ***** Página de adicionar Categoria *****
        categoria.pgAddCategoriaeditCategoria = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
			});

            categoria.LimparCamposDaPaginaAdicionarCategoria();
            Nome = Nome.split(' ').join('-');
            var UmObjetoDeCategoria = {};

            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            var store = Transacao.objectStore("Categoria");
            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				UmObjetoDeCategoria = e.target.result;
				$('#pgAddCategoriaNome').attr('readonly', 'readonly');
				$('#pgAddCategoriaNome').attr('data-clear-btn', 'false');

				var pkey = UmObjetoDeCategoria.Nome;
				pkey = pkey.split('-').join(' ');
				UmObjetoDeCategoria.Nome = pkey;
				$('#pgAddCategoriaNome').val(UmObjetoDeCategoria.Nome);
			}

            RetornoDaAberturaDoBanco.onerror = function(e) {
                $('#alertboxheader h1').text('Categoria Error');
                $('#alertboxtitle').text(Nome.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgAddCategoria');
                $('#alertboxok').data('id', Nome.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
			}
            $.mobile.loading("hide");
		};
        
		categoria.PegarCamposDaPaginaDeAdicionarCategoriaETransformaEmRegistro = function() {

			var UmObjetoDeCategoria = {};
            UmObjetoDeCategoria.Nome = $('#pgAddCategoriaNome').val().trim();
            return UmObjetoDeCategoria;
		}

        categoria.AdicionarCategoriaAoBancoDeDados = function(UmObjetoDeCategoria) {
            $.mobile.loading("show", {
                text: "Creating record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            UmObjetoDeCategoria.Nome = UmObjetoDeCategoria.Nome.split(' ').join('-');;
 
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");

            var RetornoDaTransacaoDeInclusaoNoBanco = Transacao.objectStore("Categoria").add(UmObjetoDeCategoria);

            RetornoDaTransacaoDeInclusaoNoBanco.onsuccess = function(e) 
			{
                toastr.success('Registro Adicionado com Sucesso.', 'Categorias BancoDeDados');
			};
            RetornoDaAberturaDoBanco.onerror = function(e) 
			{
                toastr.error('O Registro não foi adicionado.', 'Categorias BancoDeDados');
			};
            $.mobile.loading("hide");
		};

        categoria.LimparCamposDaPaginaAdicionarCategoria = function() {
            $('#pgAddCategoriaNome').val('');
		}
		
			
        // ***** Página Editar Categoria *****
        categoria.LimparCamposDaPaginaEditarCategoria = function() {
            $('#pgEditCategoriaNome').val('');
		}
        
        categoria.PegarCamposDaPaginaDeEditarCategoriaETransformaEmRegistro = function() {
            var UmObjetoDeCategoria = {};
            UmObjetoDeCategoria.Nome = $('#pgEditCategoriaNome').val().trim();
            return UmObjetoDeCategoria;
		}

        PreencheCamposDaPaginaEditarCategoria = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
			});

            categoria.LimparCamposDaPaginaEditarCategoria();
            Nome = Nome.split(' ').join('-');
            var UmObjetoDeCategoria = {};

            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");

            var store = Transacao.objectStore("Categoria");

            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				UmObjetoDeCategoria = e.target.result;
				$('#pgEditCategoriaNome').attr('readonly', 'readonly');
				$('#pgEditCategoriaNome').attr('data-clear-btn', 'false');
				var pkey = UmObjetoDeCategoria.Nome;
				pkey = pkey.split('-').join(' ');
				UmObjetoDeCategoria.Nome = pkey;
				$('#pgEditCategoriaNome').val(UmObjetoDeCategoria.Nome);
			}

            RetornoDaAberturaDoBanco.onerror = function(e) {
                $('#alertboxheader h1').text('Categoria Error');
                $('#alertboxtitle').text(Nome.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgEditCategoria');
                $('#alertboxok').data('id', Nome.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
			}
            $.mobile.loading("hide");
		};

		categoria.AtualizarCategoriaNoBancoDeDados = function(UmObjetoDeCategoria){
            $.mobile.loading("show", {
                text: "Update record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
			
            UmObjetoDeCategoria.Nome = UmObjetoDeCategoria.Nome.split(' ').join('-');
			
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
			
            var TabelaCategoria = Transacao.objectStore("Categoria");
			
            TabelaCategoria.get(UmObjetoDeCategoria.Nome).onsuccess = function(e) 
			{                
				var RetornoDaAtualizacaoDoBanco = TabelaCategoria.put(UmObjetoDeCategoria);
                
				RetornoDaAtualizacaoDoBanco.onsuccess = function(e) 
				{
                    toastr.success('Registro Atulizado com Sucesso.', 'Categorias BancoDeDados');
                    $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
					return true;
				}
                RetornoDaAtualizacaoDoBanco.onerror = function(e) 
				{
                    toastr.error('Não foi possível atualizar o registro.', 'Categorias BancoDeDados');
                    return false;
				}
			};
            $.mobile.loading("hide");
		};
        
		categoria.ApagarCategoriaDoBancoDeDados = function(Nome){
            $.mobile.loading("show", {
                text: "Deleting record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            Nome = Nome.split(' ').join('-');
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
            var TabelaCategoria = Transacao.objectStore("Categoria");
			
            var RetornoDeTransacaoNoBanco = TabelaCategoria.delete(Nome);
            RetornoDeTransacaoNoBanco.onsuccess = function(e) 
			{
                toastr.success('Registro Apagado.', 'Categorias BancoDeDados');
                $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
			}
            RetornoDaAberturaDoBanco.onerror = function(e) {
                toastr.error('Registro Não Foi Apagado.', 'Categorias BancoDeDados');
                return;
			}
            $.mobile.loading("hide");
		};
		
        
		categoria.iniciar();
	})(BancoDeDados);
});
