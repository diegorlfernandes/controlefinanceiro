
$(function() {
    (function(lancamento) {
        // variable definitions go here
        //var LancamentoLi = '<li><a data-id="Z2"><h2>Z1</h2></a></li>';
        var LancamentoLi = '<li><a data-id="Z2"><h2>Z1</h2><p>DESCRIPTION</p><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var LancamentoLiRi = '<li><a data-id="Z2">Z1</a></li>';
        var LancamentoHdr = '<li data-role="list-divider">Your Lancamentos</li>';
        var noLancamento = '<li id="noLancamento">You have no Lancamentos</li>';
        lancamento.init = function() {
            // hide the address bar when the window is ready
            window.addEventListener("load", function() {
                setTimeout(function() { window.scrollTo(0, 1) }, 0);
            });
            //eliminate the 300 ms delay in click events
            FastClick.attach(document.body);
            //window.addEventListener('load', function () {new FastClick.attach(document.body)}, false);//add an icon to the homescreen for lauch
            addToHomescreen();
            var addToHomeConfig = { returningVisitor: true, expire: 720, autostart: false };
            // open the indexedDB database
            var request = indexedDB.open(dbNome, dbVersion);

            //the database was opened successfully
            request.onsuccess = function(e) {
                dbDatabase = e.target.result;
            }
            lancamento.LancamentoBindings();
            $('#msgboxyes').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var yesmethod = $('#msgboxyes').data('method');
                var yesid = $('#msgboxyes').data('id');
                app[yesmethod](yesid);
            });
            $('#msgboxno').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var nomethod = $('#msgboxno').data('method');
                var noid = $('#msgboxno').data('id');
                var toPage = $('#msgboxno').data('topage');
                // show the page to display after a record is deleted
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
                app[nomethod](noid);
            });
            $('#alertboxok').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var toPage = $('#alertboxok').data('topage');
                // show the page to display after ok is clicked
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
            });
			
        };
        // define events to be fired during app execution.
        lancamento.LancamentoBindings = function() {
            // code to run before showing the page that lists the records.
            //run before the page is shown
            $(document).on('pagebeforechange', function(e, data) {
                //get page to go to
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgLancamento':
                        $('#pgRptLancamentoBack').data('from', 'pgLancamento');
                        // restart the storage check
                        lancamento.checkForLancamentoStorage();
                        break;
                    case 'pgReports':
                        $('#pgRptLancamentoBack').data('from', 'pgReports');
                        break;
                    case 'pgRptLancamento':
                        lancamento.LancamentoRpt();
                        break;
                    case 'pgEditLancamento':
                        $('#pgRptLancamentoBack').data('from', 'pgEditLancamento');
                        //clear the edit page contents
                        pgEditLancamentoClear();
                        //load related select menus before the page shows
                        var Nome = $('#pgEditLancamento').data('id');
                        //read record from IndexedDB and update screen.
                        lancamento.editLancamento(Nome);
                        lancamento.pgEditLancamentocheckForLancamentoStorageR();
                        break;
                    case 'pgAddLancamento':
                        $('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
						pgAddLancamentoValidar();                        
						pgAddLancamentoClear();
						lancamento.CategoriaSelect();
                        // //load related select menus before the page shows
                        // lancamento.pgAddLancamentocheckForLancamentoStorageR();
                        break;
                }
            });
            //run after the page has been displayed
            $(document).on('pagecontainershow', function(e, ui) {
                var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
                switch (pageId) {
                    case 'pgEditLancamento':
                        break;
                    case 'pgAddLancamento':
                        break;
                    default:
                }
            });
            //***** Add Page *****
            // code to run when back button is clicked on the add record page.
            // Back click event from Add Page
            $('#pgAddLancamentoBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //which page are we coming from, if from sign in go back to it
                var pgFrom = $('#pgAddLancamento').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // go back to the records listing screen
                        $.mobile.changePage('#pgLancamento', { transition: pgtransition });
                }
            });
            // Back click event from Add Multiple Page
            $('#pgAddMultLancamentoBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $.mobile.changePage('#pgLancamento', { transition: pgtransition });
            });
            // code to run when the Save button is clicked on Add page.
            // Save click event on Add page
            $('#pgAddLancamentoSave').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get form contents into an object
                var LancamentoRec = pgAddLancamentoGetRec();
                //save object to IndexedDB
                lancamento.addLancamento(LancamentoRec);
            });
            // Save click event on Add Multiple page
            $('#pgAddMultLancamentoSave').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get form contents of multi entries
                var multiNome = $('#pgAddMultLancamentoNome').val().trim();
                //save multi Nome to IndexedDB
                lancamento.addMultLancamento(multiNome);
            });
            // code to run when a get location button is clicked on the Add page.
            //listview item click eventt.
            $(document).on('click', '#pgAddLancamentoRightPnlLV a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //read record from IndexedDB and update screen.
                lancamento.pgAddLancamentoeditLancamento(href);
            });
            //***** Add Page - End *****
            //***** Listing Page *****
            // code to run when a listview item is clicked.
            //listview item click eventt.
            $(document).on('click', '#pgLancamentoList a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //save id of record to edit;
                $('#pgEditLancamento').data('id', href);
                //change page to edit page.
                $.mobile.changePage('#pgEditLancamento', { transition: pgtransition });
            });
            // code to run when New button on records listing is clicked.
            // New button click on records listing page
            $('#pgLancamentoNew').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //we are accessing a new record from records listing
                $('#pgAddLancamento').data('from', 'pgLancamento');
                // show the active and user type elements
                $('#pgAddLancamentoheader h1').text('Lancamentos Database > Add Lancamento');
                $('#pgAddLancamentoMenu').show();
                // move to the add page screen
                $.mobile.changePage('#pgAddLancamento', { transition: pgtransition });
            });
            //***** Listing Page - End *****
            //***** Edit Page *****
            // code to run when the back button of the Edit Page is clicked.
            // Back click event on Edit page
            $('#pgEditLancamentoBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                // go back to the listing screen
                $.mobile.changePage('#pgLancamento', { transition: pgtransition });
            });
            // code to run when the Update button is clicked in the Edit Page.
            // Update click event on Edit Page
            $('#pgEditLancamentoUpdate').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get contents of Edit page controls
                var LancamentoRec = pgEditLancamentoGetRec();
                //save updated records to IndexedDB
                lancamento.updateLancamento(LancamentoRec);
            });
            // code to run when the Delete button is clicked in the Edit Page.
            // delete button on Edit Page
            $('#pgEditLancamentoDelete').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //read the record key from form control
                var Nome = $('#pgEditLancamentoNome').val().trim();
                //show a confirm message box
                $('#msgboxheader h1').text('Confirm Delete');
                $('#msgboxtitle').text(Nome.split('-').join(' '));
                $('#msgboxprompt').text('Are you sure that you want to delete this Lancamento? This action cannot be undone.');
                $('#msgboxyes').data('method', 'deleteLancamento');
                $('#msgboxno').data('method', 'editLancamento');
                $('#msgboxyes').data('id', Nome.split(' ').join('-'));
                $('#msgboxno').data('id', Nome.split(' ').join('-'));
                $('#msgboxyes').data('topage', 'pgEditLancamento');
                $('#msgboxno').data('topage', 'pgEditLancamento');
                $.mobile.changePage('#msgbox', { transition: 'pop' });
            });
            //listview item click eventt.
            $(document).on('click', '#pgEditLancamentoRightPnlLV a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //read record from IndexedDB and update screen.
                lancamento.pgEditLancamentoeditLancamento(href);
            });
            //***** Edit Page - End *****
            //***** Report Page *****
            //back button on Report page
            // Back click event on Report page
            $('#pgRptLancamentoBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var pgFrom = $('#pgRptLancamentoBack').data('from');
                switch (pgFrom) {
                    case "pgAddLancamento":
                        $.mobile.changePage('#pgLancamento', { transition: pgtransition });
                        break;
                    case "pgEditLancamento":
                        $.mobile.changePage('#pgLancamento', { transition: pgtransition });
                        break;
                    case "pgLancamento":
                        $.mobile.changePage('#pgLancamento', { transition: pgtransition });
                        break;
                    default:
                        // go back to the listing screen
                        $.mobile.changePage('#pgReports', { transition: pgtransition });
                }
            }); //***** Report Page - End *****
            //Our events are now fully defined.
        };
        // this defines methods/procedures accessed by our events.
        // get existing records from IndexedDB
        //display records in table during runtime.
        lancamento.LancamentoRpt = function() {
            $.mobile.loading("show", {
                text: "Loading report...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //clear the table and leave the header
            $('#RptLancamento tbody tr').remove();
            // create an empty string to contain all rows of the table
            var n, LancamentoRec;
            //get records from IndexedDB.
            //define a transaction to read the records from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    n = cursor.key;
                    //clean primary keys
                    n = n.split('-').join(' ');
                    //get each record
                    LancamentoRec = cursor.value;
                    //create each row
                    var eachrow = '<tr>';
                    eachrow += '<td class="ui-body-c">' + n + '</td>';
                    eachrow += '<td class="ui-body-c">' + LancamentoRec.LancamentoYear + '</td>';
                    eachrow += '<td class="ui-body-c">' + LancamentoRec.LancamentoGenre + '</td>';
                    eachrow += '</tr>';
                    //append each row to the table;
                    $('#RptLancamento').append(eachrow);
                    // process another record
                    cursor.continue();
                }
                // update the table
                //$('#RptLancamento').append(newrows);
                // refresh the table with new details
                $('#RptLancamento').table('refresh');
            }
            $.mobile.loading("hide");
        };
        // save the defined Add page object to IndexedDB
        // add a new record to IndexedDB storage.
        lancamento.addLancamento = function(LancamentoRec) {
            $.mobile.loading("show", {
                text: "Creating record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
          
            // store the json object in the database
            //define a transaction to execute
            var tx = dbDatabase.transaction(["Lancamento"], "readwrite");
            //get the record store to create a record on
            var store = tx.objectStore("Lancamento");
            // add to store
			//var request = store.add({Descricao:"note 1",Categoria:"this is the body ",Valor:10000,Teste:"teste"});
            var request = store.add(LancamentoRec);
            request.onsuccess = function(e) {
                //show a toast message that the record has been added
                toastr.success('Lancamento record successfully added.', 'Lancamentos Database');
                //find which page are we coming from, if from sign in go back to it
                var pgFrom = $('#pgAddLancamento').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // clear the edit page form fields
                        pgAddLancamentoClear();
                        //stay in the same page to add more records
                }
            }
            request.onerror = function(e) {
                //show a toast message that the record has not been added
                toastr.error('Lancamento record NOT successfully added.', 'Lancamentos Database');
            }
            $.mobile.loading("hide");
        };
        // save the defined Edit page object to IndexedDB
        //update an existing record and save to IndexedDB
        lancamento.updateLancamento = function(LancamentoRec) {
            $.mobile.loading("show", {
                text: "Update record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // lookup specific Lancamento
            var Nome = LancamentoRec.Nome;
            //cleanse the key of spaces
            Nome = Nome.split(' ').join('-');
            LancamentoRec.Nome = Nome;
            //define a transaction to execute
            var tx = dbDatabase.transaction(["Lancamento"], "readwrite");
            //get the record store to create a record on
            var store = tx.objectStore("Lancamento");
            //get the record from the store
            store.get(Nome).onsuccess = function(e) {
                var request = store.put(LancamentoRec);
                request.onsuccess = function(e) {
                    //record has been saved
                    toastr.success('Lancamento record updated.', 'Lancamentos Database');
                    // clear the edit page form fields
                    pgEditLancamentoClear();
                    // show the records listing page.
                    $.mobile.changePage('#pgLancamento', { transition: pgtransition });
                }
                request.onerror = function(e) {
                    toastr.error('Lancamento record not updated, please try again.', 'Lancamentos Database');
                    return;
                }
            };
            $.mobile.loading("hide");
        };
        // delete record from IndexedDB
        //delete a record from IndexedDB using record key
        lancamento.deleteLancamento = function(Nome) {
            $.mobile.loading("show", {
                text: "Deleting record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            Nome = Nome.split(' ').join('-');
            //define a transaction to execute
            var tx = dbDatabase.transaction(["Lancamento"], "readwrite");
            //get the record store to delete a record from
            var store = tx.objectStore("Lancamento");
            //delete record by primary key
            var request = store.delete(Nome);
            request.onsuccess = function(e) {
                //record has been deleted
                toastr.success('Lancamento record deleted.', 'Lancamentos Database');
                // show the page to display after a record is deleted, this case listing page
                $.mobile.changePage('#pgLancamento', { transition: pgtransition });
            }
            request.onerror = function(e) {
                toastr.error('Lancamento record not deleted, please try again.', 'Lancamentos Database');
                return;
            }
            $.mobile.loading("hide");
        };
        // display existing records in listview of Records listing.
        //***** List Page *****
        //display records in listview during runtime.
        lancamento.displayLancamento = function(LancamentoObj) {
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
            for (n in LancamentoObj) {
                //get the record details
                var LancamentoRec = LancamentoObj[n];
                //define a new line from what we have defined
                var nItem = LancamentoLi;
                 nItem = nItem.replace(/Z2/g, LancamentoRec.Descricao);
                //update the title to display, this might be multi fields
                 var nTitle = '';
                // assign cleaned title
                nTitle = LancamentoRec.Descricao.split('-').join(' ');
                //replace the title;
                 nItem = nItem.replace(/Z1/g, nTitle);
                //there is a count bubble, update list item
	            var nCountBubble = '';
	            //nCountBubble += formataValorNCasasMilhar(2, String(LancamentoRec.Valor));
				nCountBubble += LancamentoRec.Valor;
	            //replace the countbubble
	             nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
	            //there is a description, update the list item
	            var nDescription = '';
	            nDescription += LancamentoRec.Categoria;
            	//replace the description;
                 nItem = nItem.replace(/DESCRIPTION/g, nDescription);
                html += nItem;
            }
            //update the listview with the newly defined html structure.
            $('#pgLancamentoList').html(LancamentoHdr + html).listview('refresh');
            $.mobile.loading("hide");
        };
        // check IndexedDB for Records. This initializes IndexedDB if there are no records
        //display records if they exist or tell user no records exist.
        lancamento.checkForLancamentoStorage = function() {
            $.mobile.loading("show", {
                text: "Checking storage...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //get records from IndexedDB.
            //when returned, parse then as json object
            var LancamentoObj = {};
            //define a transaction to read the records from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    LancamentoObj[cursor.key] = cursor.value;
                    // process another record
                    cursor.continue();
                }
                // are there existing Lancamento records?
                if (!$.isEmptyObject(LancamentoObj)) {
                    // yes there are. pass them off to be displayed
                    lancamento.displayLancamento(LancamentoObj);
                } else {
                    // nope, just show the placeholder
                    $('#pgLancamentoList').html(LancamentoHdr + noLancamento).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // an error was encountered
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgLancamentoList').html(LancamentoHdr + noLancamento).listview('refresh');
            }
        };
		
		// ***** Edit Page *****
		//Validar campo da tela de Editar Lancamento
		function pgAddLancamentoValidar() 
		{
			// $( "#pgAddLancamentoValor" ).keyup(function() {
				// alert( "Handler for .keyup() called." );
			// });
			
			$('#pgAddLancamentoValor').on('keyup', function(e) 
			{
				var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
				$('#pgAddLancamentoValor').val(ValorFormatado);
			});			
        }     
        // clear the contents of the Edit Page controls
        //clear the form controls for data entry
				
        function pgEditLancamentoClear() {
            $('#pgEditLancamentoNome').val('');
        }
        // get the contents of the edit screen controls and store them in an object.
        //get the record to be saved and put it in a record array
        //read contents of each form input
        function pgEditLancamentoGetRec() {
            //define the new record
            var LancamentoRec = {};
            LancamentoRec.Nome = $('#pgEditLancamentoNome').val().trim();
            LancamentoRec.LancamentoYear = $('#pgEditLancamentoLancamentoYear').val().trim();
            LancamentoRec.LancamentoGenre = $('#pgEditLancamentoLancamentoGenre').val().trim();
            return LancamentoRec;
        }
        // display content of selected record on Edit Page
        //read record from IndexedDB and display it on edit page.
        lancamento.editLancamento = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // clear the form fields
            pgEditLancamentoClear();
            Nome = Nome.split(' ').join('-');
            var LancamentoRec = {};
            //define a transaction to read the record from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //get the record by primary key
            var request = store.get(Nome);
            request.onsuccess = function(e) {
                    LancamentoRec = e.target.result;
                    //everything is fine, continue
                    //make the record key read only
                    $('#pgEditLancamentoNome').attr('readonly', 'readonly');
                    //ensure the record key control cannot be clearable
                    $('#pgEditLancamentoNome').attr('data-clear-btn', 'false');
                    //update each control in the Edit page
                    //clean the primary key
                    var pkey = LancamentoRec.Nome;
                    pkey = pkey.split('-').join(' ');
                    LancamentoRec.Nome = pkey;
                    $('#pgEditLancamentoNome').val(LancamentoRec.Nome);
                    $('#pgEditLancamentoLancamentoYear').val(LancamentoRec.LancamentoYear);
                    $('#pgEditLancamentoLancamentoGenre').val(LancamentoRec.LancamentoGenre);
                }
                // an error was encountered
            request.onerror = function(e) {
                $('#alertboxheader h1').text('Lancamento Error');
                $('#alertboxtitle').text(Nome.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgEditLancamento');
                $('#alertboxok').data('id', Nome.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
            }
            $.mobile.loading("hide");
        };
        //display records in listview during runtime on right panel.
        lancamento.pgEditLancamentodisplayLancamentoR = function(LancamentoObj) {
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
            for (n in LancamentoObj) {
                //get the record details
                var LancamentoRec = LancamentoObj[n];
                // clean the primary key
                var pkey = LancamentoRec.Nome;
                pkey = pkey.split('-').join(' ');
                LancamentoRec.Nome = pkey;
                //define a new line from what we have defined
                var nItem = LancamentoLiRi;
                nItem = nItem.replace(/Z2/g, n);
                //update the title to display, this might be multi fields
                var nTitle = '';
                //assign cleaned title
                nTitle = n.split('-').join(' ');
                //replace the title;
                nItem = nItem.replace(/Z1/g, nTitle);
                html += nItem;
            }
            //update the listview with the newly defined html structure.
            $('#pgEditLancamentoRightPnlLV').html(html).listview('refresh');
            $.mobile.loading("hide");
        };
        //display records if they exist or tell user no records exist.
        lancamento.pgEditLancamentocheckForLancamentoStorageR = function() {
            $.mobile.loading("show", {
                text: "Checking storage...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //get records from IndexedDB.
            //when returned, parse then as json object
            var LancamentoObj = {};
            //define a transaction to read the records from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    LancamentoObj[cursor.key] = cursor.value;
                    // process another record
                    cursor.continue();
                }
                // are there existing Lancamento records?
                if (!$.isEmptyObject(LancamentoObj)) {
                    // yes there are. pass them off to be displayed
                    lancamento.pgEditLancamentodisplayLancamentoR(LancamentoObj);
                } else {
                    // nope, just show the placeholder
                    $('#pgEditLancamentoRightPnlLV').html(LancamentoHdr + noLancamento).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // an error was encountered
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgEditLancamentoRightPnlLV').html(LancamentoHdr + noLancamento).listview('refresh');
            }
        };
        //read record from IndexedDB and display it on edit page.
        lancamento.pgEditLancamentoeditLancamento = function(LancamentoID) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // clear the form fields
            pgEditLancamentoClear();
            Nome = Nome.split(' ').join('-');
            var LancamentoRec = {};
            //define a transaction to read the record from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //get the record by primary key
            var request = store.get(LancamentoID);
            request.onsuccess = function(e) {
                    LancamentoRec = e.target.result;
                    // //everything is fine, continue
                    // //make the record key read only
                    // $('#pgEditLancamentoNome').attr('readonly', 'readonly');
                    // //ensure the record key control cannot be clearable
                    // $('#pgEditLancamentoNome').attr('data-clear-btn', 'false');
                    // //update each control in the Edit page
                    // //clean the primary key
                    // var pkey = LancamentoRec.Nome;
                    // pkey = pkey.split('-').join(' ');
                    // LancamentoRec.Nome = pkey;
                    $('#pgEditLancamentoCategoria').val(LancamentoRec.Categoria);
					$('#pgEditLancamentoValor').val(LancamentoRec.Valor);
					$('#pgEditLancamentoDescricao').val(LancamentoRec.Descricao);
                }
                // an error was encountered
            request.onerror = function(e) {
                $('#alertboxheader h1').text('Lancamento Error');
                $('#alertboxtitle').text(Nome.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgEditLancamento');
                $('#alertboxok').data('id', Nome.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
            }
            $.mobile.loading("hide");
        };
        
		
		// ***** Add Page *****
        //display records if they exist or tell user no records exist.
        lancamento.pgAddLancamentocheckForLancamentoStorageR = function() {
            $.mobile.loading("show", {
                text: "Checking storage...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //get records from IndexedDB.
            //when returned, parse then as json object
            var LancamentoObj = {};
            //define a transaction to read the records from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    LancamentoObj[cursor.key] = cursor.value;
                    // process another record
                    cursor.continue();
                }
            }
            $.mobile.loading("hide");
            // an error was encountered
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgAddLancamentoRightPnlLV').html(LancamentoHdr + noLancamento).listview('refresh');
            }
        };
        //read record from IndexedDB and display it on edit page.
        lancamento.pgAddLancamentoeditLancamento = function(Nome) {
            $.mobile.loading("show", {
                text: "Reading record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
			
            // clear the form fields
            pgAddLancamentoClear();

            Nome = Nome.split(' ').join('-');
            var LancamentoRec = {};
            //define a transaction to read the record from the table
            var tx = dbDatabase.transaction(["Lancamento"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Lancamento");
            //get the record by primary key
            var request = store.get(Nome);
            request.onsuccess = function(e) {
                    LancamentoRec = e.target.result;
                    //everything is fine, continue
                    //make the record key read only
                    $('#pgAddLancamentoNome').attr('readonly', 'readonly');
                    //ensure the record key control cannot be clearable
                    $('#pgAddLancamentoNome').attr('data-clear-btn', 'false');
                    //update each control in the Edit page
                    //clean the primary key
                    var pkey = LancamentoRec.Nome;
                    pkey = pkey.split('-').join(' ');
                    LancamentoRec.Nome = pkey;
                    $('#pgAddLancamentoNome').val(LancamentoRec.Nome);
                    $('#pgAddLancamentoLancamentoYear').val(LancamentoRec.LancamentoYear);
                    $('#pgAddLancamentoLancamentoGenre').val(LancamentoRec.LancamentoGenre);
                }
                // an error was encountered
            request.onerror = function(e) {
                $('#alertboxheader h1').text('Lancamento Error');
                $('#alertboxtitle').text(Nome.split('-').join(' '));
                $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
                $('#alertboxok').data('topage', 'pgAddLancamento');
                $('#alertboxok').data('id', Nome.split(' ').join('-'));
                $.mobile.changePage('#alertbox', { transition: 'pop' });
                return;
            }
            $.mobile.loading("hide");
        };
		//Preenche o Select de categorias na tela de Adicionar Lançamentos
        lancamento.CategoriaSelect = function() {
            $.mobile.loading("show", {
                text: "Loading ...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //clear the table and leave the header
            $('pgAddLancamentoCategoria').empty();
            // create an empty string to contain all rows of the table
            var n, CategoriaRec;
            //get records from IndexedDB.
            //define a transaction to read the records from the table
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
                //return the resultset
                var cursor = e.target.result;
                if (cursor) {
                    n = cursor.key;
                    //clean primary keys
                    n = n.split('-').join(' ');
                    //get each record
                    CategoriaRec = cursor.value;
                    //append each row to the table;
					var option = '<option value="'+CategoriaRec.Nome+'">'+CategoriaRec.Nome+'</option>';
                    $('#pgAddLancamentoCategoria').append(option);
                    // process another record
                    cursor.continue();
                }
                // update the table
				$('#pgAddLancamentoCategoria').trigger("chosen:updated");
            }
            $.mobile.loading("hide");
        };
		// get the contents of the add screen controls and store them in an object.
        //get the record to be saved and put it in a record array
        //read contents of each form input
        function pgAddLancamentoGetRec() {
            //define the new record
            var LancamentoRec = {};
            LancamentoRec.Descricao = $('#pgAddLancamentoDescricao').val().trim();
			LancamentoRec.Categoria = $('#pgAddLancamentoCategoria').val().trim();
			LancamentoRec.Valor = $('#pgAddLancamentoValor').val().trim();
            return LancamentoRec;
        }
        // clear the contents of the Add page controls
        //clear the form controls for data entry
        function pgAddLancamentoClear() {
            $('#pgAddLancamentoNome').val('');
        }

        lancamento.init();
    })(Database);
});
