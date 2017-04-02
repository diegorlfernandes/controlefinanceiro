
$(function() {
    (function(categoria) {
        var MensagemNoCabecalhoDaLista = '<li data-role="list-divider">Suas Categorias</li>';
        var MensagemNaoTemRegistroNaLista = '<li id="noCategoria">Você Não Tem Registros</li>';
		
		
        categoria.iniciar = function() {
			
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
					pgAddCategoriaClear();
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
            $('#pgAddCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
 
               var pgFrom = $('#pgAddCategoria').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
					$.mobile.changePage('#pgSignIn', { transition: TransicaoDaPagina });
					break;
                    default:
					$.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
				}
			});

			$('#pgAddCategoriaSave').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var CategoriaRec = pgAddCategoriaGetRec();
                categoria.AdicionarCategoriaAoBancoDeDados(CategoriaRec);
			});
            $(document).on('click', '#pgAddCategoriaRightPnlLV a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                categoria.pgAddCategoriaeditCategoria(href);
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
                var CategoriaRec = pgEditCategoriaGetRec();
                categoria.updateCategoria(CategoriaRec);
			});
            $('#pgEditCategoriaDelete').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var Nome = $('#pgEditCategoriaNome').val().trim();
                $('#msgboxheader h1').text('Confirm Delete');
                $('#msgboxtitle').text(Nome.split('-').join(' '));
                $('#msgboxprompt').text('Are you sure that you want to delete this Categoria? This action cannot be undone.');
                $('#msgboxyes').data('method', 'deleteCategoria');
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
		
		
				
        categoria.AdicionarCategoriaAoBancoDeDados = function(CategoriaRec) {
            $.mobile.loading("show", {
                text: "Creating record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            CategoriaRec.Nome = CategoriaRec.Nome.split(' ').join('-');;
 
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
            //get the record store to create a record on
            var store = Transacao.objectStore("Categoria");
            // add to store
            var RetornoDaAberturaDoBanco = store.add(CategoriaRec);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
                //show a toast message that the record has been added
                toastr.success('Categoria record successfully added.', 'Categorias BancoDeDados');
                //find which page are we coming from, if from sign in go back to it
                var pgFrom = $('#pgAddCategoria').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
				$.mobile.changePage('#pgSignIn', { transition: TransicaoDaPagina });
				break;
				default:
				// clear the edit page form fields
				pgAddCategoriaClear();
				//stay in the same page to add more records
                }
			};
            RetornoDaAberturaDoBanco.onerror = function(e) {
                //show a toast message that the record has not been added
                toastr.error('Categoria record NOT successfully added.', 'Categorias BancoDeDados');
			};
            $.mobile.loading("hide");
		};
        // save the defined Edit page object to IndexedDB
        //update an existing record and save to IndexedDB
        categoria.updateCategoria = function(CategoriaRec) {
            $.mobile.loading("show", {
                text: "Update record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            // lookup specific Categoria
            var Nome = CategoriaRec.Nome;
            //cleanse the key of spaces
            Nome = Nome.split(' ').join('-');
            CategoriaRec.Nome = Nome;
            //define a transaction to execute
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
            //get the record store to create a record on
            var store = Transacao.objectStore("Categoria");
            //get the record from the store
            store.get(Nome).onsuccess = function(e) {
                var RetornoDaAberturaDoBanco = store.put(CategoriaRec);
                RetornoDaAberturaDoBanco.onsuccess = function(e) {
                    //record has been saved
                    toastr.success('Categoria record updated.', 'Categorias BancoDeDados');
                    // clear the edit page form fields
                    pgEditCategoriaClear();
                    // show the records listing page.
                    $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
				}
                RetornoDaAberturaDoBanco.onerror = function(e) {
                    toastr.error('Categoria record not updated, please try again.', 'Categorias BancoDeDados');
                    return;
				}
			};
            $.mobile.loading("hide");
		};
        // delete record from IndexedDB
        //delete a record from IndexedDB using record key
        categoria.deleteCategoria = function(Nome) {
            $.mobile.loading("show", {
                text: "Deleting record...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            Nome = Nome.split(' ').join('-');
            //define a transaction to execute
            var Transacao = BancoDeDados.transaction(["Categoria"], "readwrite");
            //get the record store to delete a record from
            var store = Transacao.objectStore("Categoria");
            //delete record by primary key
            var RetornoDaAberturaDoBanco = store.delete(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
                //record has been deleted
                toastr.success('Categoria record deleted.', 'Categorias BancoDeDados');
                // show the page to display after a record is deleted, this case listing page
                $.mobile.changePage('#pgCategoria', { transition: TransicaoDaPagina });
			}
            RetornoDaAberturaDoBanco.onerror = function(e) {
                toastr.error('Categoria record not deleted, please try again.', 'Categorias BancoDeDados');
                return;
			}
            $.mobile.loading("hide");
		};
        // display existing records in listview of Records listing.
        //***** List Page *****
        //display records in listview during runtime.
        categoria.displayCategoria = function(CategoriaObj) {
            $.mobile.loading("show", {
                text: "Displaying records...",
                textVisible: true,
                textonly: false,
                html: ""
			});
            // create an empty string to contain html
            var html = '';
            // make sure your iterators are properly scoped
            var n;
            // loop over records and create a new list item for each
            //append the html to store the listitems.
            for (n in CategoriaObj) {
                //get the record details
                var CategoriaRec = CategoriaObj[n];
                // clean the primary key
                var pkey = CategoriaRec.Nome;
                pkey = pkey.split('-').join(' ');
                CategoriaRec.Nome = pkey;
                //define a new line from what we have defined
                var nItem = '<li><a data-id="Z2"><h2>Z1</h2></a></li>';
				nItem = nItem.replace(/Z2/g, n);
                //update the title to display, this might be multi fields
				var nTitle = '';
                // assign cleaned title
                nTitle = n.split('-').join(' ');
                //replace the title;
				nItem = nItem.replace(/Z1/g, nTitle);
                //there is a count bubble, update list item
	            var nCountBubble = '';
	            nCountBubble += CategoriaRec.CategoriaYear;
	            //replace the countbubble
				nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
	            //there is a description, update the list item
	            var nDescription = '';
	            nDescription += CategoriaRec.CategoriaGenre;
            	//replace the description;
				nItem = nItem.replace(/DESCRIPTION/g, nDescription);
                html += nItem;
			}
            //update the listview with the newly defined html structure.
            $('#pgCategoriaList').html(CategoriaHdr + html).listview('refresh');
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
            var CategoriaObj = {};
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
                    CategoriaObj[cursor.key] = cursor.value;
                    // process another record
                    cursor.continue();
				}
                // are there existing Categoria records?
                if (!$.isEmptyObject(CategoriaObj)) {
                    // yes there are. pass them off to be displayed
                    categoria.displayCategoria(CategoriaObj);
					} else {
                    // nope, just show the placeholder
                    $('#pgCategoriaList').html(CategoriaHdr + noCategoria).listview('refresh');
				}
			}
            $.mobile.loading("hide");
            // an error was encountered
            RetornoDaAberturaDoBanco.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgCategoriaList').html(CategoriaHdr + noCategoria).listview('refresh');
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
            pgAddCategoriaClear();
            Nome = Nome.split(' ').join('-');
            var CategoriaRec = {};
            //define a transaction to read the record from the table
            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = Transacao.objectStore("Categoria");
            //get the record by primary key
            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				CategoriaRec = e.target.result;
				//everything is fine, continue
				//make the record key read only
				$('#pgAddCategoriaNome').attr('readonly', 'readonly');
				//ensure the record key control cannot be clearable
				$('#pgAddCategoriaNome').attr('data-clear-btn', 'false');
				//update each control in the Edit page
				//clean the primary key
				var pkey = CategoriaRec.Nome;
				pkey = pkey.split('-').join(' ');
				CategoriaRec.Nome = pkey;
				$('#pgAddCategoriaNome').val(CategoriaRec.Nome);
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
        function pgAddCategoriaGetRec() {
            //define the new record
            var CategoriaRec = {};
            CategoriaRec.Nome = $('#pgAddCategoriaNome').val().trim();
            return CategoriaRec;
		}
        // clear the contents of the Add page controls
        //clear the form controls for data entry
        function pgAddCategoriaClear() {
            $('#pgAddCategoriaNome').val('');
		}
		
		
		
        // ***** Edit Page *****
        // clear the contents of the Edit Page controls
        //clear the form controls for data entry
        function pgEditCategoriaClear() {
            $('#pgEditCategoriaNome').val('');
		}
        // get the contents of the edit screen controls and store them in an object.
        //get the record to be saved and put it in a record array
        //read contents of each form input
        function pgEditCategoriaGetRec() {
            //define the new record
            var CategoriaRec = {};
            CategoriaRec.Nome = $('#pgEditCategoriaNome').val().trim();
            return CategoriaRec;
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
            var CategoriaRec = {};
            //define a transaction to read the record from the table
            var Transacao = BancoDeDados.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = Transacao.objectStore("Categoria");
            //get the record by primary key
            var RetornoDaAberturaDoBanco = store.get(Nome);
            RetornoDaAberturaDoBanco.onsuccess = function(e) {
				CategoriaRec = e.target.result;
				//everything is fine, continue
				//make the record key read only
				$('#pgEditCategoriaNome').attr('readonly', 'readonly');
				//ensure the record key control cannot be clearable
				$('#pgEditCategoriaNome').attr('data-clear-btn', 'false');
				//update each control in the Edit page
				//clean the primary key
				var pkey = CategoriaRec.Nome;
				pkey = pkey.split('-').join(' ');
				CategoriaRec.Nome = pkey;
				$('#pgEditCategoriaNome').val(CategoriaRec.Nome);
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
