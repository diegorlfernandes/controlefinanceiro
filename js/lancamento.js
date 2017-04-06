
$(function() {
    (function(lancamento) {
        var LancamentoLi = '<li><a data-id="Z2"><h2>Z1</h2><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var LancamentoLiRi = '<li><a data-id="Z2">Z1</a></li>';
        var LancamentoHdr = '<li data-role="list-divider">Seus Lancamentos</li>';
        var noLancamento = '<li id="noLancamento">Voc� n�o tem Lancamentos</li>';
		
		
		
		lancamento.iniciar = function() 
		{
            lancamento.ExecutarEventosTodasAsPaginas();			
		};
		
		lancamento.ExecutarEventosTodasAsPaginas = function(){
            // code to run before showing the page that lists the records.
            //run before the page is shown
            $(document).on('pagebeforechange', function(e, data) 
			{
                //get page to go to
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgLancamento':
					$('#pgRptLancamentoBack').data('from', 'pgLancamento');
					
					// restart the storage check
					lancamento.VerificaSeExistemRegistrosNaTabelaLancamentoEMostraMensagemNaPaginaDeListarLancamentos();
					break;
                    case 'pgEditLancamento':
					$('#pgRptLancamentoBack').data('from', 'pgEditLancamento');
					//load related select menus before the page shows
					var LancamentoID = parseInt($('#pgEditLancamento').data('id'));
					//read record from IndexedDB and update screen.
					lancamento.PreencheOsCamposDaTelaEditarLancamentoBuscandoDoBancoDeDados(LancamentoID);
					break;
                    case 'pgAddLancamento':
					$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
					break;
                    case 'pgRptResumoLancamentoCategoria':
					$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
					lancamento.RelatorioDeResumoDeLancamentosPorCategoria();
					break;
					
					
				}
			});
            //run after the page has been displayed
            $(document).on('pagecontainershow', function(e, ui) 
			{
                var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
                switch (pageId) {
                    case 'pgEditLancamento':
					break;
                    case 'pgAddLancamento':
					lancamento.LimparCamposDaPaginaAdicionarLancamentos();
					lancamento.ValidarCamposDaPaginaAdicionarLancamentos();                        
					lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento();
					break;
                    default:
				}
			});
			//{***** Add Page *****
				// code to run when back button is clicked on the add record page.
				// Back click event from Add Page
				$('#pgAddLancamentoBack').on('click', function(e) 
				{
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
				$('#pgAddMultLancamentoBack').on('click', function(e) 
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
				});
				
				$('#pgAddLancamentoSave').on('click', function(e) 
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					
					var LancamentoRec = lancamento.PegaDadosDaPaginaAdicionarLancamentoERetornaComoObjetoLancamento();
					
					lancamento.InsereDadosDoObjetoLancamentoNoBancoDeDados(LancamentoRec);
				});
				// Save click event on Add Multiple page
				$('#pgAddMultLancamentoSave').on('click', function(e) 
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					//get form contents of multi entries
					var multiNome = $('#pgAddMultLancamentoNome').val().trim();
					//save multi Nome to IndexedDB
					lancamento.addMultLancamento(multiNome);
				});
				// code to run when a get location button is clicked on the Add page.
				//listview item click eventt.
				$(document).on('click', '#pgAddLancamentoRightPnlLV a', function(e) 
				{
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
				$(document).on('click', '#pgLancamentoList a', function(e) 
				{
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
				$('#pgLancamentoNew').on('click', function(e) 
				{
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
				$('#pgEditLancamentoBack').on('click', function(e) 
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					// go back to the listing screen
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
				});
				// code to run when the Update button is clicked in the Edit Page.
				// Update click event on Edit Page
				$('#pgEditLancamentoUpdate').on('click', function(e) 
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					//get contents of Edit page controls
					var LancamentoRec = lancamento.PegaCamposDaPaginaEditarLancamentosERetornaUmObjetoLancamento();
					//save updated records to IndexedDB
					lancamento.AtualizarObjetoLancamentoNoBancoDeDados(LancamentoRec);
				});
				// code to run when the Delete button is clicked in the Edit Page.
				// delete button on Edit Page
				$('#pgEditLancamentoDelete').on('click', function(e) 
				{
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
				$(document).on('click', '#pgEditLancamentoRightPnlLV a', function(e) 
				{
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
				$('#pgRptLancamentoBack').on('click', function(e) 
				{
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
		//};	
						
				
		// ***** Metodos da P�gina Listar Lan�amentos *****
		lancamento.MostraOsLancamentosNaPaginaDeListarLancamentos = function(LancamentoObj) {
			$.mobile.loading("show", {
				text: "Displaying records...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			var html = '';
			var n;
			
			for (n in LancamentoObj) {
				var LancamentoRec = LancamentoObj[n];
				var nItem = LancamentoLi;
				nItem = nItem.replace(/Z2/g, String(LancamentoRec.LancamentoID));
				var nTitle = '';
				nTitle = LancamentoRec.Categoria;
				if(LancamentoRec.Descricao)
				{
					nTitle +=" --> ";
					nTitle += LancamentoRec.Descricao;
				}
				nItem = nItem.replace(/Z1/g, nTitle);
				var nCountBubble = '';
				nCountBubble += LancamentoRec.Valor;
				nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
				var nDescription = '';
				nDescription += LancamentoRec.Categoria;
				nItem = nItem.replace(/DESCRIPTION/g, nDescription);
				html += nItem;
			}
			
			$('#pgLancamentoList').html(LancamentoHdr + html).listview('refresh');
			$.mobile.loading("hide");
		};
		
		lancamento.VerificaSeExistemRegistrosNaTabelaLancamentoEMostraMensagemNaPaginaDeListarLancamentos = function() {
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
			//get the object TabelaLancamento for the table
			var TabelaLancamento = tx.objectStore("Lancamento");
			//open a cursor to read all the records
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
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
					lancamento.MostraOsLancamentosNaPaginaDeListarLancamentos(LancamentoObj);
					} else {
					// nope, just show the placeholder
					$('#pgLancamentoList').html(LancamentoHdr + noLancamento).listview('refresh');
				}
			}
			$.mobile.loading("hide");
			// an error was encountered
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$.mobile.loading("hide");
				// just show the placeholder
				$('#pgLancamentoList').html(LancamentoHdr + noLancamento).listview('refresh');
			}
		};
		
		
		
		// ***** Metodos da P�gina Adicionar Lan�amentos *****
		lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento = function() {
			$.mobile.loading("show", {
				text: "Loading ...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			$('pgAddLancamentoCategoria').empty();
			var n, CategoriaRec;
			var tx = BancoDeDados.transaction(["Categoria"], "readonly");
			var TabelaLancamento = tx.objectStore("Categoria");
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();
			
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					
					CategoriaRec = cursor.value;
					
					var option = '<option value="'+CategoriaRec.Nome+'">'+CategoriaRec.Nome+'</option>';
					$('#pgAddLancamentoCategoria').append(option);
					cursor.continue();
				}
				$('#pgAddLancamentoCategoria').trigger("chosen:updated");
			}
			$.mobile.loading("hide");
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$.mobile.loading("hide");
			}
		};
		
		lancamento.PegaDadosDaPaginaAdicionarLancamentoERetornaComoObjetoLancamento = function() {
			var LancamentoRec = {};
			LancamentoRec.Descricao = $('#pgAddLancamentoDescricao').val().trim();
			LancamentoRec.Categoria = $('#pgAddLancamentoCategoria').val().trim();
			if ($("#pgAddLancamentoTipoA").is(":checked"))
			LancamentoRec.Valor = "-"+$('#pgAddLancamentoValor').val().trim();
			else
			LancamentoRec.Valor = $('#pgAddLancamentoValor').val().trim();
			LancamentoRec.MesAno = MesAno;
			return LancamentoRec;
		}
		
		lancamento.LimparCamposDaPaginaAdicionarLancamentos = function() {
			$('#pgAddLancamentoCategoria').empty();
			$('#pgAddLancamentoValor').val('');
			$('#pgAddLancamentoDescricao').val('');
			($("#pgAddLancamentoTipoA").prop(":checked"));
		}
		
		lancamento.ValidarCamposDaPaginaAdicionarLancamentos = function() {				
			$('#pgAddLancamentoValor').on('keyup', function(e) 
			{
				var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
				$('#pgAddLancamentoValor').val(ValorFormatado);
			});			
		}     
		
		lancamento.InsereDadosDoObjetoLancamentoNoBancoDeDados = function(LancamentoRec) {
			$.mobile.loading("show", 
			{
				text: "Creating record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			
			var TabelaLancamento = tx.objectStore("Lancamento");
			
			var RequisicaoNaTabelaLancamento = TabelaLancamento.add(LancamentoRec);
			RequisicaoNaTabelaLancamento.onsuccess = function(e) 
			{
				
				toastr.success('Lancamento gravado com sucesso.', 'Cash');
				
				lancamento.LimparCamposDaPaginaAdicionarLancamentos();
				lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento();
				
				
			};
			RequisicaoNaTabelaLancamento.onerror = function(e) 
			{
				toastr.error('Erro. Lancamento n�o foi gravado.', 'Cash');
			};
			$.mobile.loading("hide");
		};	
		
		
		
		// ***** Metodos da P�gina Editar Lan�amentos *****
		
		lancamento.LimparCamposDaPaginaEditarLancamentos = function() {
			($("#pgAddLancamentoTipoA").prop(":checked"));
			$('#pgEditLancamentoDescricao').val("");
			$('#pgEditLancamentoValor').val("");
			
		}
		
		lancamento.PegaCamposDaPaginaEditarLancamentosERetornaUmObjetoLancamento = function(){
			var LancamentoRec = {};
			LancamentoRec.LancamentoID = parseInt($('#pgEditLancamentoLancamentoID').val());
			LancamentoRec.Categoria = $('#pgEditLancamentoCategoria').val();
			LancamentoRec.Descricao = $('#pgEditLancamentoDescricao').val();
			LancamentoRec.Valor = $('#pgEditLancamentoValor').val();
			return LancamentoRec;
		}
		
		lancamento.PreencheOsCamposDaTelaEditarLancamentoBuscandoDoBancoDeDados = function(LancamentoID) {
			$.mobile.loading("show", {
				text: "Reading record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			// clear the form fields
			lancamento.LimparCamposDaPaginaEditarLancamentos();
			
			
			var LancamentoRec = {};
			//define a transaction to read the record from the table
			var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
			//get the object TabelaLancamento for the table
			var TabelaLancamento = tx.objectStore("Lancamento");
			//get the record by primary key
			var request1 = TabelaLancamento.get(LancamentoID);
			request1.onsuccess = function(e) {
				LancamentoRec = e.target.result;
				//everything is fine, continue
				lancamento.CriaListaDoCampoCategoriaNaPaginaEditarLancamento(LancamentoRec.Categoria);	
				
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
		
		lancamento.CriaListaDoCampoCategoriaNaPaginaEditarLancamento = function(Categoria) {
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
			//get the object TabelaLancamento for the table
			var TabelaLancamento = tx.objectStore("Categoria");
			//open a cursor to read all the records
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
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
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$.mobile.loading("hide");
				// just show the placeholder
			}
			
		};

		lancamento.AtualizarObjetoLancamentoNoBancoDeDados = function(LancamentoRec) {
			$.mobile.loading("show", 
			{
				text: "Update record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			//define a transaction to execute
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			//get the record TabelaLancamento to create a record on
			var TabelaLancamento = tx.objectStore("Lancamento");
			//get the record from the TabelaLancamento
			TabelaLancamento.get(LancamentoRec.LancamentoID).onsuccess = function(e) 
			{
				var RequisicaoNaTabelaLancamento = TabelaLancamento.put(LancamentoRec);
				RequisicaoNaTabelaLancamento.onsuccess = function(e) {
					//record has been saved
					toastr.success('Lancamento record updated.', 'Lancamentos BancoDeDados');
					// clear the edit page form fields
					lancamento.LimparCamposDaPaginaEditarLancamentos();
					// show the records listing page.
					$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
				}
				RequisicaoNaTabelaLancamento.onerror = function(e) {
					toastr.error('Lancamento record not updated, please try again.', 'Lancamentos BancoDeDados');
					return;
				}
			};
			$.mobile.loading("hide");
		};
		
		lancamento.ApagaUmLancamentoDoBancoDeDados = function(LancamentoID) {
			$.mobile.loading("show", {
				text: "Deleting record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			//define a transaction to execute
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			//get the record TabelaLancamento to delete a record from
			var TabelaLancamento = tx.objectStore("Lancamento");
			//delete record by primary key
			var RequisicaoNaTabelaLancamento = TabelaLancamento.delete(parseInt(LancamentoID));
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				//record has been deleted
				toastr.success('Lancamento record deleted.', 'Lancamentos BancoDeDados');
				// show the page to display after a record is deleted, this case listing page
				$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
			}
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				toastr.error('Lancamento record not deleted, please try again.', 'Lancamentos BancoDeDados');
				return;
			}
			$.mobile.loading("hide");
		};
		
		
		//*****Metodos da P�gina Resumo **********
		lancamento.RelatorioDeResumoDeLancamentosPorCategoria = function () {
			$.mobile.loading("show", 
			{
				text: "Loading report...",
				textVisible: true, 
				textonly: false, 
				html: ""
			});
			
			$('#RptResumoLancamentoCategoria tbody tr').remove();
			
			var  UmObjetoLancamento, ValorTotalDoLancamentoAgrupadoPorCategoria=0.00, categoria, ValorTotalDeTodosOsLancamentos=0.00;
			
			var ListaDeObjetosLancamentoAgrupadoPorCategoria = new Array();
			var ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorPositivo = new Array();
			var ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorNegativo = new Array();
			
			var transaction = BancoDeDados.transaction(['Lancamento'], "readonly");
			var store = transaction.objectStore('Lancamento').index('Categoria');
			
			store.openCursor().onsuccess = function(e) 
			{
				
				var cursor = e.target.result;
				
				if (cursor) 
				{
					
					UmObjetoLancamento = cursor.value;
					
					
					if(!categoria)
					categoria=UmObjetoLancamento.Categoria;
					
					var ValorDoLancamentoConvertidoParaNumeroDicimal =  Number(UmObjetoLancamento.Valor.replace(".","").replace(",","."));
					
					
					if(categoria == UmObjetoLancamento.Categoria )
					{
						ValorTotalDoLancamentoAgrupadoPorCategoria+= ValorDoLancamentoConvertidoParaNumeroDicimal;
					}
					else
					{
						if(ValorTotalDoLancamentoAgrupadoPorCategoria>0)
						ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorPositivo.push(new Array(categoria,ValorTotalDoLancamentoAgrupadoPorCategoria));
						else
						ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorNegativo.push(new Array(categoria,ValorTotalDoLancamentoAgrupadoPorCategoria));
						
						ValorTotalDoLancamentoAgrupadoPorCategoria = ValorDoLancamentoConvertidoParaNumeroDicimal;
						categoria = UmObjetoLancamento.Categoria;				
					}
					
					ValorTotalDeTodosOsLancamentos += ValorTotalDoLancamentoAgrupadoPorCategoria;
					
					cursor.continue();
				}
				else
				{
					if(ValorTotalDoLancamentoAgrupadoPorCategoria>0)
					ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorPositivo.push(new Array(categoria,ValorTotalDoLancamentoAgrupadoPorCategoria));
					else
					ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorNegativo.push(new Array(categoria,ValorTotalDoLancamentoAgrupadoPorCategoria));
					
					ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorPositivo.forEach (lancamento.AdicionaUmaLinhaNaTabelaDaPaginaDoRelatorioDeResumo);
					ListaDeObjetosLancamentoAgrupadoPorCategoriaComValorNegativo.forEach (lancamento.AdicionaUmaLinhaNaTabelaDaPaginaDoRelatorioDeResumo);						
					
					lancamento.AdicionaUmaLinhaDeTotalNaTabelaDaPaginaDoRelatorioDeResumo(ValorTotalDeTodosOsLancamentos);								
				}
			}
			$('#RptResumoLancamentoCategoria').table('refresh');
			$.mobile.loading("hide");
		};
		
		lancamento.AdicionaUmaLinhaNaTabelaDaPaginaDoRelatorioDeResumo = function (value, index, ar) {
			var eachrow = '<tr>';
			eachrow += '<td class="ui-body-c">' + value[0] + '</td>';
			eachrow += '<td class="ui-body-c" style="text-align:right;">' + value[1].toFixed(2) + '</td>';
			eachrow += '</tr>';
			$('#RptResumoLancamentoCategoria').append(eachrow);				
		}
		
		lancamento.AdicionaUmaLinhaDeTotalNaTabelaDaPaginaDoRelatorioDeResumo = function (ValorTotalDeTodosOsLancamentos) {
			var eachrow = '<tr>';
			eachrow += '<td class="ui-body-c" style="font-weight:bold"> Saldo </td>';
			eachrow += '<td class="ui-body-c" style="text-align:right;font-weight:bold">' + ValorTotalDeTodosOsLancamentos.toFixed(2) + '</td>';
			eachrow += '</tr>';
			$('#RptResumoLancamentoCategoria').append(eachrow);				
		}
		
				
		lancamento.iniciar();
	})(BancoDeDados);
});
