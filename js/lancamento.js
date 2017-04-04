
$(function() {
    (function(lancamento) {
        var LancamentoLi = '<li><a data-id="Z2"><h2>Z1</h2><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var LancamentoLiRi = '<li><a data-id="Z2">Z1</a></li>';
        var LancamentoHdr = '<li data-role="list-divider">Seus Lancamentos</li>';
        var noLancamento = '<li id="noLancamento">Voc� n�o tem Lancamentos</li>';
		
		
		
		lancamento.iniciar = function() {
            // hide the address bar when the window is ready
            window.addEventListener("load", function() {
                setTimeout(function() { window.scrollTo(0, 1) }, 0);
			});
            // open the indexedDB BancoDeDados
            var request = indexedDB.open(NomeDoBanco, VersaoDoBanco);
			
            //the BancoDeDados was opened successfully
            request.onsuccess = function(e) {
                BancoDeDados = e.target.result;
			}
            lancamento.ExecutarEventos();
			
		};
        // define events to be fired during app execution.
        lancamento.ExecutarEventos = function() {
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
                    case 'pgEditLancamento':
					$('#pgRptLancamentoBack').data('from', 'pgEditLancamento');
					//load related select menus before the page shows
					var LancamentoID = parseInt($('#pgEditLancamento').data('id'));
					//read record from IndexedDB and update screen.
					lancamento.editLancamento(LancamentoID);
					break;
                    case 'pgAddLancamento':
					$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
					break;
                    case 'pgRptResumoLancamentoCategoria':
					$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
					lancamento.ResumoLancamentoCategoriaRpt();
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
					pgAddLancamentoClear();
					pgAddLancamentoValidar();                        
					lancamento.CategoriaSelectAdd();
					break;
                    default:
				}
			});
			//{***** Add Page *****
				// code to run when back button is clicked on the add record page.
				// Back click event from Add Page
				$('#pgAddLancamentoBack').on('click', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					//which page are we coming from, if from sign in go back to it
					var pgFrom = $('#pgAddLancamento').data('from');
					switch (pgFrom) {
						case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: TransicaoDaPagina });
                        break;
						default:
                        // go back to the records listing screen
                        $.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
					}
				});
				// Back click event from Add Multiple Page
				$('#pgAddMultLancamentoBack').on('click', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
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
				//***** Add Page - End *****}
				//***** Listing Page *****
				// code to run when a listview item is clicked.
				//listview item click eventt.
				$(document).on('click', '#pgLancamentoList a', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					//get href of selected listview item and cleanse it
					var href = $(this).data('id');
					//save id of record to edit;
					$('#pgEditLancamento').data('id', href);
					//change page to edit page.
					$.mobile.changePage('#pgEditLancamento', { transition: TransicaoDaPagina });
				});
				// code to run when New button on records listing is clicked.
				// New button click on records listing page
				$('#pgLancamentoNew').on('click', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					//we are accessing a new record from records listing
					$('#pgAddLancamento').data('from', 'pgLancamento');
					// show the active and user type elements
					$('#pgAddLancamentoheader h1').text('Lancamentos BancoDeDados > Add Lancamento');
					$('#pgAddLancamentoMenu').show();
					// move to the add page screen
					$.mobile.changePage('#pgAddLancamento', { transition: TransicaoDaPagina });
				});
				//***** Listing Page - End *****
				//***** Edit Page *****
				// code to run when the back button of the Edit Page is clicked.
				// Back click event on Edit page
				$('#pgEditLancamentoBack').on('click', function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					// go back to the listing screen
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
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
					var ID = $('#pgEditLancamentoLancamentoID').val().trim();
					//show a confirm message box
					$('#msgboxheader h1').text('Confirm Delete');
					$('#msgboxtitle').text(ID.split('-').join(' '));
					$('#msgboxprompt').text('Are you sure that you want to delete this Lancamento? This action cannot be undone.');
					$('#msgboxyes').data('method', 'deleteLancamento');
					$('#msgboxno').data('method', 'editLancamento');
					$('#msgboxyes').data('id', ID.split(' ').join('-'));
					$('#msgboxno').data('id', ID.split(' ').join('-'));
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
					lancamento.pgEditLancamento(href);
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
                        $.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
                        break;
						case "pgEditLancamento":
                        $.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
                        break;
						case "pgLancamento":
                        $.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
                        break;
						default:
                        // go back to the listing screen
                        $.mobile.changePage('#pgReports', { transition: TransicaoDaPagina });
					}
				}); //***** Report Page - End *****
				//Our events are now fully defined.
			};
			// Pega registro da pagina de Adicionar lancamento e grava no banco
			lancamento.addLancamento = function(LancamentoRec) {
				$.mobile.loading("show", {
					text: "Creating record...",
					textVisible: true,
					textonly: false,
					html: ""
				});
				
				// store the json object in the BancoDeDados
				//define a transaction to execute
				var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
				//get the record store to create a record on
				var store = tx.objectStore("Lancamento");
				// add to store
				//var request = store.add({Descricao:"note 1",Categoria:"this is the body ",Valor:10000,Teste:"teste"});
				var request = store.add(LancamentoRec);
				request.onsuccess = function(e) {
					//show a toast message that the record has been added
					toastr.success('Lancamento record successfully added.', 'Lancamentos BancoDeDados');
					//find which page are we coming from, if from sign in go back to it
					var pgFrom = $('#pgAddLancamento').data('from');
					switch (pgFrom) {
						case "pgSignIn":
                        $.mobile.changePage('#pgSignIn', { transition: TransicaoDaPagina });
                        break;
						default:
                        // clear the edit page form fields
                        pgAddLancamentoClear();
                        //stay in the same page to add more records
					}
				}
				request.onerror = function(e) {
					//show a toast message that the record has not been added
					toastr.error('Lancamento record NOT successfully added.', 'Lancamentos BancoDeDados');
				}
				$.mobile.loading("hide");
			};
			
			//Salva a pagina de Editar lancamento no banco
			lancamento.updateLancamento = function(LancamentoRec) {
				$.mobile.loading("show", {
					text: "Update record...",
					textVisible: true,
					textonly: false,
					html: ""
				});
				
				//define a transaction to execute
				var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
				//get the record store to create a record on
				var store = tx.objectStore("Lancamento");
				//get the record from the store
				store.get(LancamentoRec.LancamentoID).onsuccess = function(e) {
					var request = store.put(LancamentoRec);
					request.onsuccess = function(e) {
						//record has been saved
						toastr.success('Lancamento record updated.', 'Lancamentos BancoDeDados');
						// clear the edit page form fields
						pgEditLancamentoClear();
						// show the records listing page.
						$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
					}
					request.onerror = function(e) {
						toastr.error('Lancamento record not updated, please try again.', 'Lancamentos BancoDeDados');
						return;
					}
				};
				$.mobile.loading("hide");
			};
			//Apaga o lancamento
			lancamento.deleteLancamento = function(LancamentoID) {
				$.mobile.loading("show", {
					text: "Deleting record...",
					textVisible: true,
					textonly: false,
					html: ""
				});
				//define a transaction to execute
				var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
				//get the record store to delete a record from
				var store = tx.objectStore("Lancamento");
				//delete record by primary key
				var request = store.delete(parseInt(LancamentoID));
				request.onsuccess = function(e) {
					//record has been deleted
					toastr.success('Lancamento record deleted.', 'Lancamentos BancoDeDados');
					// show the page to display after a record is deleted, this case listing page
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
				}
				request.onerror = function(e) {
					toastr.error('Lancamento record not deleted, please try again.', 'Lancamentos BancoDeDados');
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
					nItem = nItem.replace(/Z2/g, String(LancamentoRec.LancamentoID));
					//update the title to display, this might be multi fields
					var nTitle = '';
					// assign cleaned title
					nTitle = LancamentoRec.Categoria;
					if(LancamentoRec.Descricao)
					{
						nTitle +=" --> ";
						nTitle += LancamentoRec.Descricao;
					}
					//replace the title;
					nItem = nItem.replace(/Z1/g, nTitle);
					//there is a count bubble, update list item
					var nCountBubble = '';
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
				var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
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
			
			
			
			//{ ***** Add Page *****
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
					var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
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
				//Preenche o Select de categorias na tela de Adicionar Lan�amentos
				lancamento.CategoriaSelectAdd = function() {
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
					var tx = BancoDeDados.transaction(["Categoria"], "readonly");
					//get the object store for the table
					var store = tx.objectStore("Categoria");
					//open a cursor to read all the records
					var request = store.openCursor();
					request.onsuccess = function(e) {
						//return the resultset
						var cursor = e.target.result;
						if (cursor) {
							
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
					request.onerror = function(e) {
						$.mobile.loading("hide");
						// just show the placeholder
					}
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
					LancamentoRec.MesAno = MesAno;
					return LancamentoRec;
				}
				// clear the contents of the Add page controls
				//clear the form controls for data entry
				function pgAddLancamentoClear() {
					$('#pgAddLancamentoValor').val('');
					$('#pgAddLancamentoDescricao').val('');
				}
			//}
			
			
			//{ ***** Edit Page *****
				//Validar campo da tela de Editar Lancamento
				function pgAddLancamentoValidar() 
				{
					
					$('#pgAddLancamentoValor').on('keyup', function(e) 
					{
						var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
						$('#pgAddLancamentoValor').val(ValorFormatado);
					});			
				}     
				// clear the contents of the Edit Page controls
				//clear the form controls for data entry
				$('#pgAddLancamentoValor').on('keyup', function(e) 
				{
					var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
					$('#pgAddLancamentoValor').val(ValorFormatado);
				});			
			//}     
			// // clear the contents of the Edit Page controls
			//clear the form controls for data entry
			
			function pgEditLancamentoClear() 
			{
				$('#pgEditLancamentoDescricao').val("");
				$('#pgEditLancamentoValor').val("");
				
			}
			// get the contents of the edit screen controls and store them in an object.
			//get the record to be saved and put it in a record array
			//read contents of each form input
			function pgEditLancamentoGetRec() 
			{
				//define the new record
				var LancamentoRec = {};
				LancamentoRec.LancamentoID = parseInt($('#pgEditLancamentoLancamentoID').val());
				LancamentoRec.Categoria = $('#pgEditLancamentoCategoria').val();
				LancamentoRec.Descricao = $('#pgEditLancamentoDescricao').val();
				LancamentoRec.Valor = $('#pgEditLancamentoValor').val();
				return LancamentoRec;
			}
			// display content of selected record on Edit Page
			//read record from IndexedDB and display it on edit page.
			lancamento.editLancamento = function(LancamentoID) 
			{
				$.mobile.loading("show", {
					text: "Reading record...",
					textVisible: true,
					textonly: false,
					html: ""
				});
				// clear the form fields
				pgEditLancamentoClear();
				
				
				var LancamentoRec = {};
				//define a transaction to read the record from the table
				var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
				//get the object store for the table
				var store = tx.objectStore("Lancamento");
				//get the record by primary key
				var request1 = store.get(LancamentoID);
				request1.onsuccess = function(e) {
					LancamentoRec = e.target.result;
					//everything is fine, continue
					lancamento.CategoriaSelectEdit(LancamentoRec.Categoria);	
					
					//make the record key read only
					$('#pgEditLancamentoLancamentoID').attr('readonly', 'readonly');
					//ensure the record key control cannot be clearable
					$('#pgEditLancamentoLancamentoID').attr('data-clear-btn', 'false');
					$('#pgEditLancamentoLancamentoID').val(LancamentoRec.LancamentoID);
					$('#pgEditLancamentoDescricao').val(LancamentoRec.Descricao);
					$('#pgEditLancamentoValor').val(LancamentoRec.Valor);
				}
				// an error was encountered
				request1.onerror = function(e) {
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
			
			//Preenche o Select de categorias na tela de editar Lan�amentos
			lancamento.CategoriaSelectEdit = function(Categoria) {
				$.mobile.loading("show", {
					text: "Loading ...",
					textVisible: true,
					textonly: false,
					html: ""
				});
				//clear the table and leave the header
				$('pgEditLancamentoCategoria').empty();
				// create an empty string to contain all rows of the table
				var n, CategoriaRec;
				//get records from IndexedDB.
				//define a transaction to read the records from the table
				var tx = BancoDeDados.transaction(["Categoria"], "readonly");
				//get the object store for the table
				var store = tx.objectStore("Categoria");
				//open a cursor to read all the records
				var request = store.openCursor();
				request.onsuccess = function(e) {
					//return the resultset
					var cursor = e.target.result;
					if (cursor) {
						
						//get each record
						CategoriaRec = cursor.value;
						//append each row to the table;
						var option = '<option value="'+CategoriaRec.Nome+'">'+CategoriaRec.Nome+'</option>';
						$('#pgEditLancamentoCategoria').append(option);
						// process another record
						cursor.continue();
					}
					$('#pgEditLancamentoCategoria option[value="' + Categoria + '"]').attr({ selected : "selected" });	
					
					// update the table
					$('#pgEditLancamentoCategoria').selectmenu("refresh", true);
					//$('#pgEditLancamentoCategoria').trigger("chosen:updated");
				}
				$.mobile.loading("hide");
				request.onerror = function(e) {
					$.mobile.loading("hide");
					// just show the placeholder
				}
				
			};
		//}
		
		//{******Relat�rios**********
			lancamento.ResumoLancamentoCategoriaRpt = function () {
				$.mobile.loading("show", {
					text: "Loading report...",
					textVisible: true, 
					textonly: false, 
					html: ""
				});
				//clear the table and leave the header
				$('#RptResumoLancamentoCategoria tbody tr').remove();
				// create an empty string to contain all rows of the table
				var n, Rec, total=0.00, categoria, TotalGeral=0.00;
				//get records from IndexedDB.
				//define a transaction to read the records from the table
				var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
				//get the object store for the table
				var store = tx.objectStore("Lancamento").index('Categoria');
				//open a cursor to read all the records
				var request = store.openCursor();
				
				
				request.onsuccess = function(e) 
				{
					//return the resultset
					
					var cursor = e.target.result;
					
					
					if (cursor) {
						n = cursor.key;
						//get each record
						Rec = cursor.value;
						
						if(!categoria)
						categoria=Rec.Categoria;

						var valor =  Number(Rec.Valor.replace(".","").replace(",","."));
						
						if(categoria == Rec.Categoria )
						{
							total+= valor;							
							
						}
						else
						{							
							lancamento.ResumoLancamentoCategoriaRptGerarTable(categoria,total);
							
							categoria=Rec.Categoria;
							total = valor;
						}
						
						TotalGeral += total;
						
						cursor.continue();
					}
					else
					{
						lancamento.ResumoLancamentoCategoriaRptGerarTable(categoria,total);
						lancamento.ResumoLancamentoCategoriaRptGerarTable("Total",TotalGeral);
					}
				}
				// refresh the table with new details
				$('#RptResumoLancamentoCategoria').table('refresh');
				$.mobile.loading("hide");
			};
			
			lancamento.ResumoLancamentoCategoriaRptGerarTable = function (categoria,total) 
			{
				//create each row
				var eachrow = '<tr>';
				// eachrow += '<td class="ui-body-c">' + n + '</td>';
				eachrow += '<td class="ui-body-c">' + categoria + '</td>';
				eachrow += '<td class="ui-body-c" style="text-align:right;">' + total.toFixed(2) + '</td>';
				eachrow += '</tr>';
				//append each row to the table;
				$('#RptResumoLancamentoCategoria').append(eachrow);				
			}
		//}
		
		lancamento.iniciar();
	})(BancoDeDados);
});
