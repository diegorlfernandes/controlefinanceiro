
$(function() {
    (function(categoria) {
        var MensagemNoCabecalhoDaLista = '<li data-role="list-divider">Suas Categorias</li>';
        var MensagemNaoTemRegistroNaLista = '<li id="noCategoria">Você Não Tem Registros</li>';
        var MensagemNoCabecalhoDaListaDeCategoria = '<li data-role="list-divider">Suas Categorias</li>';
				
        categoria.iniciar = function() 
		{
			categoria.ExecutarEventosTodasAsPaginas();
			categoria.ExecutarEventosDaPaginaListar();
			categoria.ExecutarEventosDaPaginaAdicionar();
			categoria.ExecutarEventosDaPaginaEditar();
			categoria.ExecutarEventosMensagens();
		};

		categoria.ExecutarEventosTodasAsPaginas = function()
		{					
            $(document).on('pagebeforechange', function(e, data) {
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgCategoria');
					categoria.checkForCategoriaStorage();
					break;
                    case 'pgEditCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgEditCategoria');
					pgEditCategoriaClear();
					var Nome = $('#pgEditCategoria').data('id');
					categoria.editCategoria(Nome);
					break;
                    case 'pgAddCategoria':
					$('#pgRptCategoriaBack').data('from', 'pgAddCategoria');
					PaginaAdicionarCategoriaLimparCampos();
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
		
		categoria.ExecutarEventosDaPaginaListar = function()
		{
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
		
		categoria.ExecutarEventosDaPaginaAdicionar = function()
		{
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
				
                var UmObjetoDeCategoria = PegarCamposDaPaginaDeAdicionarCategoriaETransformaEmRegistro();
                if(categoria.AdicionarCategoriaAoBancoDeDados(UmObjetoDeCategoria))
				{
					PaginaAdicionarCategoriaLimparCampos();					
				};
			});			
		};
		categoria.ExecutarEventosDaPaginaEditar = function()
		{
            $('#pgEditCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
			});
			
            $('#pgEditCategoriaUpdate').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var UmObjetoDeCategoria = PegarCamposDaPaginaDeEditarCategoriaETransformaEmRegistro();
                if(categoria.AtualizarCategoriaNoBancoDeDados(UmObjetoDeCategoria))
				{
                    pgEditCategoriaClear();					
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
		categoria.ExecutarEventosMensagens = function() 
		{
		
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
				// show the page to display after a record is deleted
				$.mobile.changePage('#' + toPage, {transition: TransicaoDaPagina});
				categoria[nomethod](noid);
			});
			$('#alertboxok').on('click', function (e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var toPage = $('#alertboxok').data('topage');
				// show the page to display after ok is clicked
				$.mobile.changePage('#' + toPage, {transition: TransicaoDaPagina});
			});
		};
						
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
				return true;
			};
            RetornoDaAberturaDoBanco.onerror = function(e) 
			{
                toastr.error('O Registro não foi adicionado.', 'Categorias BancoDeDados');
				return false;
			};
            $.mobile.loading("hide");
		};

        categoria.AtualizarCategoriaNoBancoDeDados = function(UmObjetoDeCategoria) 
		{
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
        categoria.ApagarCategoriaDoBancoDeDados = function(Nome) 
		{
            $.mobile.loading("show", {
                text: "Deleting record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            Nome = Nome.split(' ').join('-');
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
            var TabelaCategoria = Transacao.objectStore("Categoria");

            var RetornoDeTransacaoNoBanco = store.delete(Nome);
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

        categoria.MostrarListaDeCategoriasNaPaginaDeListarCategorias = function(ListaDeCategorias) {
            $.mobile.loading("show", {
                text: "Displaying records...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            var html = '';
            var UmObjetoDeCategoria;

            for (UmObjetoDeCategoria in ListaDeCategorias) {
                var UmObjetoDeCategoria = ListaDeCategorias[UmObjetoDeCategoria];

                UmObjetoDeCategoria.Nome = UmObjetoDeCategoria.Nome.split('-').join(' ');

                var NovoItemDaListaDaPagina = '<li><a data-id="Z2"><h2>Z1</h2></a></li>';
				NovoItemDaListaDaPagina = NovoItemDaListaDaPagina.replace(/Z2/g, UmObjetoDeCategoria);

				var nTitle = '';

                nTitle = UmObjetoDeCategoria.Nome.split('-').join(' ');

				NovoItemDaListaDaPagina = NovoItemDaListaDaPagina.replace(/Z1/g, nTitle);

                html += NovoItemDaListaDaPagina;
			}
            $('#pgCategoriaList').html(MensagemNoCabecalhoDaListaDeCategoria + html).listview('refresh');
            $.mobile.loading("hide");
		};
        // check IndexedDB for Records. This initializes IndexedDB if there are no records
        //display records if they exist or tell user no records exist.
        categoria.checkForCategoriaStorage = function() {
            $.mobile.loading("show", {
                text: "Checking storage...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            //get records from IndexedDB.
            //when returned, parse then as json object
            var ListaDeCategorias = {};
            //define a transaction to read the records from the table
            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = Transacao.objectStore("Categoria");
            //open a cursor to read all the records
            var RetornoDaAberturaDoBanco = store.openCursor();
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    ListaDeCategorias[cursor.key] = cursor.value;
                    // process another record
                    cursor.continue();
				}
                // are there existing Categoria records?
                if (!$.isEmptyObject(ListaDeCategorias)) {
                    // yes there are. pass them off to be displayed
                    categoria.MostrarListaDeCategoriasNaPaginaDeListarCategorias(ListaDeCategorias);
					} else {
                    // nope, just show the placeholder
                    $('#pgCategoriaList').html(MensagemNoCabecalhoDaListaDeCategoria + noCategoria).listview('refresh');
				}
			}
            $.mobile.loading("hide");
            // an error was encountered
            RetornoDaAberturaDoBanco.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgCategoriaList').html(MensagemNoCabecalhoDaListaDeCategoria + noCategoria).listview('refresh');
			}
		};
		
		
		// ***** Add Page *****
        //read record from IndexedDB and display it on edit page.
        categoria.pgAddCategoriaeditCategoria = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            // clear the form fields
            PaginaAdicionarCategoriaLimparCampos();
            Nome = Nome.split(' ').join('-');
            var UmObjetoDeCategoria = {};
            //define a transaction to read the record from the table
            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = Transacao.objectStore("Categoria");
            //get the record by primary key
            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				UmObjetoDeCategoria = e.target.result;
				//everything is fine, continue
				//make the record key read only
				$('#pgAddCategoriaNome').attr('readonly', 'readonly');
				//ensure the record key control cannot be clearable
				$('#pgAddCategoriaNome').attr('data-clear-btn', 'false');
				//update each control in the Edit page
				//clean the primary key
				var pkey = UmObjetoDeCategoria.Nome;
				pkey = pkey.split('-').join(' ');
				UmObjetoDeCategoria.Nome = pkey;
				$('#pgAddCategoriaNome').val(UmObjetoDeCategoria.Nome);
			}
			// an error was encountered
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
        // get the contents of the add screen controls and store them in an object.
        //get the record to be saved and put it in a record array
        //read contents of each form input
        function PegarCamposDaPaginaDeAdicionarCategoriaETransformaEmRegistro() {
            //define the new record
            var UmObjetoDeCategoria = {};
            UmObjetoDeCategoria.Nome = $('#pgAddCategoriaNome').val().trim();
            return UmObjetoDeCategoria;
		}
        // clear the contents of the Add page controls
        //clear the form controls for data entry
        function PaginaAdicionarCategoriaLimparCampos() {
            $('#pgAddCategoriaNome').val('');
		}
		
		
		
        // ***** Edit Page *****
        // clear the contents of the Edit Page controls
        //clear the form controls for data entry
        function pgEditCategoriaClear() {
            $('#pgEditCategoriaNome').val('');
		}
        
        function PegarCamposDaPaginaDeEditarCategoriaETransformaEmRegistro() {
            var UmObjetoDeCategoria = {};
            UmObjetoDeCategoria.Nome = $('#pgEditCategoriaNome').val().trim();
            return UmObjetoDeCategoria;
		}
        // display content of selected record on Edit Page
        //read record from IndexedDB and display it on edit page.
        categoria.editCategoria = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            // clear the form fields
            pgEditCategoriaClear();
            Nome = Nome.split(' ').join('-');
            var UmObjetoDeCategoria = {};
            //define a transaction to read the record from the table
            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = Transacao.objectStore("Categoria");
            //get the record by primary key
            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				UmObjetoDeCategoria = e.target.result;
				//everything is fine, continue
				//make the record key read only
				$('#pgEditCategoriaNome').attr('readonly', 'readonly');
				//ensure the record key control cannot be clearable
				$('#pgEditCategoriaNome').attr('data-clear-btn', 'false');
				//update each control in the Edit page
				//clean the primary key
				var pkey = UmObjetoDeCategoria.Nome;
				pkey = pkey.split('-').join(' ');
				UmObjetoDeCategoria.Nome = pkey;
				$('#pgEditCategoriaNome').val(UmObjetoDeCategoria.Nome);
			}
			// an error was encountered
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
		
        categoria.iniciar();
	})(BancoDeDados);
});
