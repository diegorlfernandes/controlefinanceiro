
var Database = {};
//variables to hold the indexedDB database.
var dbDatabase;
var dbNome = "dbCash";
var dbVersion = 1;
var pgtransition = 'slide';
//window.indexedDB.deleteDatabase(dbNome);
$(function() {
    // define the application
    (function(categoria) {
        // variable definitions go here
        var CategoriaLi = '<li><a data-id="Z2"><h2>Z1</h2></a></li>';
        //var CategoriaLi = '<li><a data-id="Z2"><h2>Z1</h2><p>DESCRIPTION</p><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var CategoriaLiRi = '<li><a data-id="Z2">Z1</a></li>';
        var CategoriaHdr = '<li data-role="list-divider">Your Categorias</li>';
        var noCategoria = '<li id="noCategoria">You have no Categorias</li>';
        categoria.init = function() {
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
            //check if an upgrade is needed, this due to a version change
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
            //the database was opened successfully
            request.onsuccess = function(e) {
                dbDatabase = e.target.result;
            }
            categoria.CategoriaBindings();
            $('#msgboxyes').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var yesmethod = $('#msgboxyes').data('method');
                var yesid = $('#msgboxyes').data('id');
                categoria[yesmethod](yesid);
            });
            $('#msgboxno').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var nomethod = $('#msgboxno').data('method');
                var noid = $('#msgboxno').data('id');
                var toPage = $('#msgboxno').data('topage');
                // show the page to display after a record is deleted
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
                categoria[nomethod](noid);
            });
            $('#alertboxok').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var toPage = $('#alertboxok').data('topage');
                // show the page to display after ok is clicked
                $.mobile.changePage('#' + toPage, { transition: pgtransition });
            });
        };
        // define events to be fired during categoria execution.
        categoria.CategoriaBindings = function() {
            // code to run before showing the page that lists the records.
            //run before the page is shown
            $(document).on('pagebeforechange', function(e, data) {
                //get page to go to
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgCategoria':
                        $('#pgRptCategoriaBack').data('from', 'pgCategoria');
                        // restart the storage check
                        categoria.checkForCategoriaStorage();
                        break;
                    case 'pgReports':
                        $('#pgRptCategoriaBack').data('from', 'pgReports');
                        break;
                    case 'pgRptCategoria':
                        categoria.CategoriaRpt();
                        break;
                    case 'pgEditCategoria':
                        $('#pgRptCategoriaBack').data('from', 'pgEditCategoria');
                        //clear the edit page contents
                        pgEditCategoriaClear();
                        //load related select menus before the page shows
                        var Nome = $('#pgEditCategoria').data('id');
                        //read record from IndexedDB and update screen.
                        categoria.editCategoria(Nome);
                        categoria.pgEditCategoriacheckForCategoriaStorageR();
                        break;
                    case 'pgAddCategoria':
                        $('#pgRptCategoriaBack').data('from', 'pgAddCategoria');
                        pgAddCategoriaClear();
                        //load related select menus before the page shows
                        categoria.pgAddCategoriacheckForCategoriaStorageR();
                        break;
                }
            });
            //run after the page has been displayed
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
            //***** Add Page *****
            // code to run when back button is clicked on the add record page.
            // Back click event from Add Page
            $('#pgAddCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //which page are we coming from, if from sign in go back to it
                var pgFrom = $('#pgAddCategoria').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // go back to the records listing screen
                        $.mobile.changePage('#pgCategoria', { transition: pgtransition });
                }
            });
            // Back click event from Add Multiple Page
            $('#pgAddMultCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $.mobile.changePage('#pgCategoria', { transition: pgtransition });
            });
            // code to run when the Save button is clicked on Add page.
            // Save click event on Add page
            $('#pgAddCategoriaSave').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get form contents into an object
                var CategoriaRec = pgAddCategoriaGetRec();
                //save object to IndexedDB
                categoria.addCategoria(CategoriaRec);
            });
            // Save click event on Add Multiple page
            $('#pgAddMultCategoriaSave').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get form contents of multi entries
                var multiNome = $('#pgAddMultCategoriaNome').val().trim();
                //save multi Nome to IndexedDB
                categoria.addMultCategoria(multiNome);
            });
            // code to run when a get location button is clicked on the Add page.
            //listview item click eventt.
            $(document).on('click', '#pgAddCategoriaRightPnlLV a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //read record from IndexedDB and update screen.
                categoria.pgAddCategoriaeditCategoria(href);
            });
            //***** Add Page - End *****
            //***** Listing Page *****
            // code to run when a listview item is clicked.
            //listview item click eventt.
            $(document).on('click', '#pgCategoriaList a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //save id of record to edit;
                $('#pgEditCategoria').data('id', href);
                //change page to edit page.
                $.mobile.changePage('#pgEditCategoria', { transition: pgtransition });
            });
            // code to run when New button on records listing is clicked.
            // New button click on records listing page
            $('#pgCategoriaNew').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //we are accessing a new record from records listing
                $('#pgAddCategoria').data('from', 'pgCategoria');
                // show the active and user type elements
                $('#pgAddCategoriaheader h1').text('Categorias Database > Add Categoria');
                $('#pgAddCategoriaMenu').show();
                // move to the add page screen
                $.mobile.changePage('#pgAddCategoria', { transition: pgtransition });
            });
            //***** Listing Page - End *****
            //***** Edit Page *****
            // code to run when the back button of the Edit Page is clicked.
            // Back click event on Edit page
            $('#pgEditCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                // go back to the listing screen
                $.mobile.changePage('#pgCategoria', { transition: pgtransition });
            });
            // code to run when the Update button is clicked in the Edit Page.
            // Update click event on Edit Page
            $('#pgEditCategoriaUpdate').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get contents of Edit page controls
                var CategoriaRec = pgEditCategoriaGetRec();
                //save updated records to IndexedDB
                categoria.updateCategoria(CategoriaRec);
            });
            // code to run when the Delete button is clicked in the Edit Page.
            // delete button on Edit Page
            $('#pgEditCategoriaDelete').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //read the record key from form control
                var Nome = $('#pgEditCategoriaNome').val().trim();
                //show a confirm message box
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
            //listview item click eventt.
            $(document).on('click', '#pgEditCategoriaRightPnlLV a', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //get href of selected listview item and cleanse it
                var href = $(this).data('id');
                href = href.split(' ').join('-');
                //read record from IndexedDB and update screen.
                categoria.pgEditCategoriaeditCategoria(href);
            });
            //***** Edit Page - End *****
            //***** Report Page *****
            //back button on Report page
            // Back click event on Report page
            $('#pgRptCategoriaBack').on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var pgFrom = $('#pgRptCategoriaBack').data('from');
                switch (pgFrom) {
                    case "pgAddCategoria":
                        $.mobile.changePage('#pgCategoria', { transition: pgtransition });
                        break;
                    case "pgEditCategoria":
                        $.mobile.changePage('#pgCategoria', { transition: pgtransition });
                        break;
                    case "pgCategoria":
                        $.mobile.changePage('#pgCategoria', { transition: pgtransition });
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
        categoria.CategoriaRpt = function() {
            $.mobile.loading("show", {
                text: "Loading report...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //clear the table and leave the header
            $('#RptCategoria tbody tr').remove();
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
                    //create each row
                    var eachrow = '<tr>';
                    eachrow += '<td class="ui-body-c">' + n + '</td>';
                    eachrow += '<td class="ui-body-c">' + CategoriaRec.CategoriaYear + '</td>';
                    eachrow += '<td class="ui-body-c">' + CategoriaRec.CategoriaGenre + '</td>';
                    eachrow += '</tr>';
                    //append each row to the table;
                    $('#RptCategoria').append(eachrow);
                    // process another record
                    cursor.continue();
                }
                // update the table
                //$('#RptCategoria').append(newrows);
                // refresh the table with new details
                $('#RptCategoria').table('refresh');
            }
            $.mobile.loading("hide");
        };
        // save the defined Add page object to IndexedDB
        // add a new record to IndexedDB storage.
        categoria.addCategoria = function(CategoriaRec) {
            $.mobile.loading("show", {
                text: "Creating record...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            // clean the primary key to store
            var Nome = CategoriaRec.Nome;
            Nome = Nome.split(' ').join('-');
            CategoriaRec.Nome = Nome;
            // store the json object in the database
            //define a transaction to execute
            var tx = dbDatabase.transaction(["Categoria"], "readwrite");
            //get the record store to create a record on
            var store = tx.objectStore("Categoria");
            // add to store
            var request = store.add(CategoriaRec);
            request.onsuccess = function(e) {
                //show a toast message that the record has been added
                toastr.success('Categoria record successfully added.', 'Categorias Database');
                //find which page are we coming from, if from sign in go back to it
                var pgFrom = $('#pgAddCategoria').data('from');
                switch (pgFrom) {
                    case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: pgtransition });
                        break;
                    default:
                        // clear the edit page form fields
                        pgAddCategoriaClear();
                        //stay in the same page to add more records
                }
            }
            request.onerror = function(e) {
                //show a toast message that the record has not been added
                toastr.error('Categoria record NOT successfully added.', 'Categorias Database');
            }
            $.mobile.loading("hide");
        };
        // add a new record to IndexedDB storage.
        categoria.addMultCategoria = function(multiNome) {
            $.mobile.loading("show", {
                text: "Creating records...",
                textVisible: true,
                textonly: false,
                html: ""
            });
            //loop through each record and add it to the database
            var NomeCnt, NomeTot, NomeItems, CategoriaRec, Nome;
            var NomeItem, addedRec = 0,
                addedRecNot = 0;
            //split the items as they are delimited by ;
            NomeItems = Split(multiNome, ";");
            NomeTot = NomeItems.length - 1;
            //define a transaction to execute
            var tx = dbDatabase.transaction(["Categoria"], "readwrite");
            //get the record store to create a record on
            var store = tx.objectStore("Categoria");
            //loop through each record and add it to the store
            for (NomeCnt = 0; NomeCnt <= NomeTot; NomeCnt++) {
                //get each record being added
                NomeItem = NomeItems[NomeCnt];
                NomeItem = NomeItem.trim();
                if (Len(NomeItem) > 0) {
                    NomeItem = NomeItem.split(' ').join('-');
                    Nome = NomeItem;
                    CategoriaRec = {};
                    CategoriaRec.Nome = NomeItem;
                    // add to store
                    var request = store.add(CategoriaRec);
                    request.onsuccess = function(e) {
                        addedRec += 1;
                    }
                    request.onerror = function(e) {
                        addedRecNot += 1;
                    }
                }
            }
            if (addedRec >= 1) {
                //show a toast message that the record has not been added
                toastr.success(addedRec + 'Categoria record(s) successfully added.', 'Categorias Database');
            }
            if (addedRecNot >= 1) {
                //show a toast message that the record has not been added
                toastr.error(addedRecNot + 'Categoria record(s) could NOT be successfully added.', 'Categorias Database');
            }
            $('#pgAddMultCategoriaNome').val('');
            $.mobile.changePage('#pgCategoria', { transition: pgtransition });
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
            var tx = dbDatabase.transaction(["Categoria"], "readwrite");
            //get the record store to create a record on
            var store = tx.objectStore("Categoria");
            //get the record from the store
            store.get(Nome).onsuccess = function(e) {
                var request = store.put(CategoriaRec);
                request.onsuccess = function(e) {
                    //record has been saved
                    toastr.success('Categoria record updated.', 'Categorias Database');
                    // clear the edit page form fields
                    pgEditCategoriaClear();
                    // show the records listing page.
                    $.mobile.changePage('#pgCategoria', { transition: pgtransition });
                }
                request.onerror = function(e) {
                    toastr.error('Categoria record not updated, please try again.', 'Categorias Database');
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
            var tx = dbDatabase.transaction(["Categoria"], "readwrite");
            //get the record store to delete a record from
            var store = tx.objectStore("Categoria");
            //delete record by primary key
            var request = store.delete(Nome);
            request.onsuccess = function(e) {
                //record has been deleted
                toastr.success('Categoria record deleted.', 'Categorias Database');
                // show the page to display after a record is deleted, this case listing page
                $.mobile.changePage('#pgCategoria', { transition: pgtransition });
            }
            request.onerror = function(e) {
                toastr.error('Categoria record not deleted, please try again.', 'Categorias Database');
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
                var nItem = CategoriaLi;
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
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
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgCategoriaList').html(CategoriaHdr + noCategoria).listview('refresh');
            }
        };
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
            CategoriaRec.CategoriaYear = $('#pgEditCategoriaCategoriaYear').val().trim();
            CategoriaRec.CategoriaGenre = $('#pgEditCategoriaCategoriaGenre').val().trim();
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //get the record by primary key
            var request = store.get(Nome);
            request.onsuccess = function(e) {
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
                    $('#pgEditCategoriaCategoriaYear').val(CategoriaRec.CategoriaYear);
                    $('#pgEditCategoriaCategoriaGenre').val(CategoriaRec.CategoriaGenre);
                }
                // an error was encountered
            request.onerror = function(e) {
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
        //display records in listview during runtime on right panel.
        categoria.pgEditCategoriadisplayCategoriaR = function(CategoriaObj) {
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
                var nItem = CategoriaLiRi;
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
            $('#pgEditCategoriaRightPnlLV').html(html).listview('refresh');
            $.mobile.loading("hide");
        };
        //display records if they exist or tell user no records exist.
        categoria.pgEditCategoriacheckForCategoriaStorageR = function() {
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
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
                    categoria.pgEditCategoriadisplayCategoriaR(CategoriaObj);
                } else {
                    // nope, just show the placeholder
                    $('#pgEditCategoriaRightPnlLV').html(CategoriaHdr + noCategoria).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // an error was encountered
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgEditCategoriaRightPnlLV').html(CategoriaHdr + noCategoria).listview('refresh');
            }
        };
        //read record from IndexedDB and display it on edit page.
        categoria.pgEditCategoriaeditCategoria = function(Nome) {
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //get the record by primary key
            var request = store.get(Nome);
            request.onsuccess = function(e) {
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
            request.onerror = function(e) {
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
        // ***** Add Page *****
        //display records in listview during runtime on right panel.
        categoria.pgAddCategoriadisplayCategoriaR = function(CategoriaObj) {
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
                var nItem = CategoriaLiRi;
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
            $('#pgAddCategoriaRightPnlLV').html(html).listview('refresh');
            $.mobile.loading("hide");
        };
        //display records if they exist or tell user no records exist.
        categoria.pgAddCategoriacheckForCategoriaStorageR = function() {
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //open a cursor to read all the records
            var request = store.openCursor();
            request.onsuccess = function(e) {
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
                    categoria.pgAddCategoriadisplayCategoriaR(CategoriaObj);
                } else {
                    // nope, just show the placeholder
                    $('#pgAddCategoriaRightPnlLV').html(CategoriaHdr + noCategoria).listview('refresh');
                }
            }
            $.mobile.loading("hide");
            // an error was encountered
            request.onerror = function(e) {
                $.mobile.loading("hide");
                // just show the placeholder
                $('#pgAddCategoriaRightPnlLV').html(CategoriaHdr + noCategoria).listview('refresh');
            }
        };
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
            var tx = dbDatabase.transaction(["Categoria"], "readonly");
            //get the object store for the table
            var store = tx.objectStore("Categoria");
            //get the record by primary key
            var request = store.get(Nome);
            request.onsuccess = function(e) {
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
                    $('#pgAddCategoriaCategoriaYear').val(CategoriaRec.CategoriaYear);
                    $('#pgAddCategoriaCategoriaGenre').val(CategoriaRec.CategoriaGenre);
                }
                // an error was encountered
            request.onerror = function(e) {
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

        categoria.init();
    })(Database);
});
