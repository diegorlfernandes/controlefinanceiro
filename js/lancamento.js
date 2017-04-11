
$(function() {
    (function(lancamento) {
        var MensagemNoCorpoDaLista = '<li><a data-id="Z2"><h2>Z1</h2><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
        var MensagemNoCabecalhoDaLista = '<li data-role="list-divider">Seus Lancamentos</li>';
        var MensagemNaoTemRegistroNaLista = '<li id="noLancamento">Você não registros</li>';
		
		
		
		lancamento.iniciar = function()	{
			lancamento.ExecutarEventosTodasAsPaginas();			
			lancamento.ExecutarEventosNaPaginaDeAdicionarLancamentos();
			lancamento.ExecutarEventosDaPaginaListarLancamentos();
			lancamento.ExecutarEventosDaPaginaEditarLancamentos();
		};
		
		
		// ***** Eventos *****
		lancamento.ExecutarEventosTodasAsPaginas = function(){
			
            $(document).on('pagebeforechange', function(e, data){
                var toPage = data.toPage[0].id;
                switch (toPage) {
                    case 'pgLancamento':
						$('#pgRptLancamentoBack').data('from', 'pgLancamento');
						lancamento.MostrarLancamentosNaPaginaDeListarLancamentos();
					break;
                    case 'pgEditLancamento':
						$('#pgRptLancamentoBack').data('from', 'pgEditLancamento');
					break;
                    case 'pgAddLancamento':
						$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
					break;
                    case 'pgRptResumoLancamentoCategoria':
						$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
						lancamento.RelatorioDeResumoDeLancamentosPorCategoria();
					break;
					default:
				}
			});
			$(document).on('pagecontainershow', function(e, ui){
				var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
				switch (pageId) {
					case 'pgEditLancamento':
						lancamento.LimparCamposDaPaginaEditarLancamentos();
						var LancamentoID = parseInt($('#pgEditLancamento').data('id'));
						lancamento.PreencheOsCamposDaTelaEditarLancamento(LancamentoID);
					break;
					case 'pgAddLancamento':
						lancamento.LimparCamposDaPaginaAdicionarLancamentos();
						lancamento.ValidarCamposDaPaginaAdicionarLancamentos();                        
						lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento();
					break;
					default:
				}
			});										
			
		};
		
		lancamento.ExecutarEventosNaPaginaDeAdicionarLancamentos = function(){
			$('#pgAddLancamentoBack').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				
				$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
			});
			
			$('#pgAddLancamentoSave').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				
				var UmObjetoLancamento = lancamento.PegaDadosDaPaginaAdicionarLancamentoERetornaComoObjetoLancamento();
				
				lancamento.InsereDadosDoObjetoLancamentoNoBancoDeDados(UmObjetoLancamento);
			});
		};
		
		lancamento.ExecutarEventosDaPaginaListarLancamentos = function(){
			$(document).on('click', '#pgLancamentoList a', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var href = $(this).data('id');
				$('#pgEditLancamento').data('id', href);
				$.mobile.changePage('#pgEditLancamento', { transition: TransicaoDaPagina });
			});
			$('#pgLancamentoNew').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				$('#pgAddLancamento').data('from', 'pgLancamento');
				$('#pgAddLancamentoheader h1').text('Lancamentos BancoDeDados > Add Lancamento');
				$('#pgAddLancamentoMenu').show();
				$.mobile.changePage('#pgAddLancamento', { transition: TransicaoDaPagina });
			});
			
		};
		
		lancamento.ExecutarEventosDaPaginaEditarLancamentos = function(){
			$('#pgEditLancamentoBack').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
			});
			$('#pgEditLancamentoUpdate').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var UmObjetoLancamento = lancamento.PegaCamposDaPaginaEditarLancamentosERetornaUmObjetoLancamento();
				lancamento.AtualizarObjetoLancamentoNoBancoDeDados(UmObjetoLancamento);
			});
			$('#pgEditLancamentoDelete').on('click', function(e) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				var ID = $('#pgEditLancamentoLancamentoID').val().trim();
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
		};
		
		
		// ***** Metodos da Página Listar Lançamentos *****
		
		lancamento.MostrarLancamentosNaPaginaDeListarLancamentos = function(ListaDeLancamentos) {
			$.mobile.loading("show", {
				text: "Displaying records...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			
			var ListaDeLancamentos = {};
			var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
			var TabelaLancamento = tx.objectStore('Lancamento').index('MesAno, Categoria');
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor(IDBKeyRange.bound([MesAno,"A"],[MesAno,"Z"]));
		
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					ListaDeLancamentos[cursor.key] = cursor.value;
					cursor.continue();
				}
				if (!$.isEmptyObject(ListaDeLancamentos)) {
					var html = '';
					var n;
					for (n in ListaDeLancamentos) {
						var UmObjetoLancamento = ListaDeLancamentos[n];
						var nItem = MensagemNoCorpoDaLista;
						nItem = nItem.replace(/Z2/g, String(UmObjetoLancamento.LancamentoID));
						var nTitle = '';
						nTitle = UmObjetoLancamento.Categoria;
						if(UmObjetoLancamento.Descricao)
						{
							nTitle +=" --> ";
							nTitle += UmObjetoLancamento.Descricao;
						}
						nItem = nItem.replace(/Z1/g, nTitle);
						var nCountBubble = '';
						nCountBubble += UmObjetoLancamento.Valor;
						nItem = nItem.replace(/COUNTBUBBLE/g, nCountBubble);
						var nDescription = '';
						nDescription += UmObjetoLancamento.Categoria;
						nItem = nItem.replace(/DESCRIPTION/g, nDescription);
						html += nItem;
						$('#pgLancamentoList').html(MensagemNoCabecalhoDaLista + html).listview('refresh');
					};
					}else{
					$('#pgLancamentoList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');
				};
				$.mobile.loading("hide");				
			};
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$('#pgLancamentoList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');					
				$.mobile.loading("hide");
			}							
		};
		
		
		// ***** Metodos da Página Adicionar Lançamentos *****
		lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento = function() {
			$.mobile.loading("show", {
				text: "Loading ...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			var n, CategoriaRec;
			var tx = BancoDeDados.transaction(["Categoria"], "readonly");
			var TabelaLancamento = tx.objectStore("Categoria");
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();
			
			$('#pgAddLancamentoCategoria').append("<option value='0'>Selecione ...</option>");
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					
					CategoriaRec = cursor.value;
					
					var option = '<option value="'+CategoriaRec.Nome+'">'+CategoriaRec.Nome+'</option>';
					$('#pgAddLancamentoCategoria').append(option);
					cursor.continue();
				}								
			}
			$('#pgAddLancamentoCategoria').selectmenu("refresh", true);
			
			$.mobile.loading("hide");
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$.mobile.loading("hide");
			}
		};
		
		lancamento.PegaDadosDaPaginaAdicionarLancamentoERetornaComoObjetoLancamento = function() {
			var UmObjetoLancamento = {};
			UmObjetoLancamento.Descricao = $('#pgAddLancamentoDescricao').val().trim();
			UmObjetoLancamento.Categoria = $('#pgAddLancamentoCategoria').val().trim();
			if ($("#pgAddLancamentoTipoA").is(":checked"))
			UmObjetoLancamento.Valor = "-"+$('#pgAddLancamentoValor').val().trim();
			else
			UmObjetoLancamento.Valor = $('#pgAddLancamentoValor').val().trim();
			UmObjetoLancamento.MesAno = MesAno;
			return UmObjetoLancamento;
		}
		
		lancamento.LimparCamposDaPaginaAdicionarLancamentos = function() {
			$('#pgAddLancamentoCategoria').empty();
			$('#pgAddLancamentoValor').val('');
			$('#pgAddLancamentoDescricao').val('');
			$("#pgAddLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
			$("#pgAddLancamentoTipoB").prop('checked', false).checkboxradio("refresh");
		}
		
		lancamento.ValidarCamposDaPaginaAdicionarLancamentos = function() {				
			$('#pgAddLancamentoValor').on('keyup', function(e) 
			{
				var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
				$('#pgAddLancamentoValor').val(ValorFormatado);
			});			
		}     
		
		lancamento.InsereDadosDoObjetoLancamentoNoBancoDeDados = function(UmObjetoLancamento) {
			$.mobile.loading("show", 
			{
				text: "Creating record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			
			var TabelaLancamento = tx.objectStore("Lancamento");
			
			var RequisicaoNaTabelaLancamento = TabelaLancamento.add(UmObjetoLancamento);
			RequisicaoNaTabelaLancamento.onsuccess = function(e) 
			{
				
				toastr.success('Lancamento gravado com sucesso.', 'Cash');
				
				lancamento.LimparCamposDaPaginaAdicionarLancamentos();
				lancamento.CriaListaDoCampoCategoriaNaPaginaAdicionarLancamento();
				
				
			};
			RequisicaoNaTabelaLancamento.onerror = function(e) 
			{
				toastr.error('Erro. Lancamento não foi gravado.', 'Cash');
			};
			$.mobile.loading("hide");
		};	
		
		
		// ***** Metodos da Página Editar Lançamentos *****
		
		lancamento.LimparCamposDaPaginaEditarLancamentos = function() {
			$('#pgEditLancamentoDescricao').val("");
			$('#pgEditLancamentoValor').val("");
			$("#pgEditLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
			$("#pgEditLancamentoTipoB").prop('checked', false).checkboxradio("refresh");
			
		}
		
		
		lancamento.PreencheOsCamposDaTelaEditarLancamento = function(LancamentoID) {
			$.mobile.loading("show", {
				text: "Reading record...",
				textVisible: true,
				textonly: false,
				html: ""
			});			
			
			var UmObjetoLancamento = {};
			var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
			var TabelaLancamento = tx.objectStore("Lancamento");
			var request1 = TabelaLancamento.get(LancamentoID);
			request1.onsuccess = function(e) {
				UmObjetoLancamento = e.target.result;
				lancamento.CriaListaDoCampoCategoriaNaPaginaEditarLancamento(UmObjetoLancamento.Categoria);	
				
				$('#pgEditLancamentoLancamentoID').attr('readonly', 'readonly');
				$('#pgEditLancamentoLancamentoID').attr('data-clear-btn', 'false');
				$('#pgEditLancamentoLancamentoID').val(UmObjetoLancamento.LancamentoID);
				$('#pgEditLancamentoDescricao').val(UmObjetoLancamento.Descricao);
				$('#pgEditLancamentoValor').val(UmObjetoLancamento.Valor);
				if (parseInt(UmObjetoLancamento.Valor)>=0){
					$("#pgEditLancamentoTipoA").prop('checked', false).checkboxradio("refresh");
					$("#pgEditLancamentoTipoB").prop('checked', true).checkboxradio("refresh");
				}else{
					$("#pgEditLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
					$("#pgEditLancamentoTipoB").prop('checked', false).checkboxradio("refresh");
				}
					
			}
			request1.onerror = function(e) {
				// $('#alertboxheader h1').text('Lancamento Error');
				// $('#alertboxtitle').text(Nome.split('-').join(' '));
				// $('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
				// $('#alertboxok').data('topage', 'pgEditLancamento');
				// $('#alertboxok').data('id', Nome.split(' ').join('-'));
				// $.mobile.changePage('#alertbox', { transition: 'pop' });
				// return;
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
			$('pgEditLancamentoCategoria').empty();
			var n, CategoriaRec;
			var tx = BancoDeDados.transaction(["Categoria"], "readonly");
			var TabelaLancamento = tx.objectStore("Categoria");
			var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					
					CategoriaRec = cursor.value;
					var option = '<option value="'+CategoriaRec.Nome+'">'+CategoriaRec.Nome+'</option>';
					$('#pgEditLancamentoCategoria').append(option);
					cursor.continue();
				}
				$('#pgEditLancamentoCategoria option[value="' + Categoria + '"]').attr({ selected : "selected" });	
				
				$('#pgEditLancamentoCategoria').selectmenu("refresh", true);
			}
			$.mobile.loading("hide");
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				$.mobile.loading("hide");
			}
			
		};
		
		lancamento.PegaCamposDaPaginaEditarLancamentosERetornaUmObjetoLancamento = function(){
			var UmObjetoLancamento = {};
			UmObjetoLancamento.LancamentoID = parseInt($('#pgEditLancamentoLancamentoID').val());
			UmObjetoLancamento.MesAno = MesAno;
			UmObjetoLancamento.Categoria = $('#pgEditLancamentoCategoria').val();
			UmObjetoLancamento.Descricao = $('#pgEditLancamentoDescricao').val();
			
			if ($("#pgEditLancamentoTipoA").is(":checked"))
				UmObjetoLancamento.Valor = "-"+$('#pgEditLancamentoValor').val().trim();
			else
				UmObjetoLancamento.Valor = $('#pgEditLancamentoValor').val().trim();
			
			return UmObjetoLancamento;
		}

		lancamento.AtualizarObjetoLancamentoNoBancoDeDados = function(UmObjetoLancamento) {
			$.mobile.loading("show", 
			{
				text: "Update record...",
				textVisible: true,
				textonly: false,
				html: ""
			});
			
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			var TabelaLancamento = tx.objectStore("Lancamento");
			TabelaLancamento.get(UmObjetoLancamento.LancamentoID).onsuccess = function(e) 
			{
				var RequisicaoNaTabelaLancamento = TabelaLancamento.put(UmObjetoLancamento);
				RequisicaoNaTabelaLancamento.onsuccess = function(e) {
					toastr.success('Lancamento record updated.', 'Lancamentos BancoDeDados');
					lancamento.LimparCamposDaPaginaEditarLancamentos();
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
			var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
			var TabelaLancamento = tx.objectStore("Lancamento");
			var RequisicaoNaTabelaLancamento = TabelaLancamento.delete(parseInt(LancamentoID));
			RequisicaoNaTabelaLancamento.onsuccess = function(e) {
				toastr.success('Lancamento record deleted.', 'Lancamentos BancoDeDados');
				$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
			}
			RequisicaoNaTabelaLancamento.onerror = function(e) {
				toastr.error('Lancamento record not deleted, please try again.', 'Lancamentos BancoDeDados');
				return;
			}
			$.mobile.loading("hide");
		};
		
		
		//*****Metodos da Página Resumo **********
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
			var store = transaction.objectStore('Lancamento').index('MesAno, Categoria');
			
			store.openCursor(IDBKeyRange.bound([MesAno,"A"],[MesAno,"Z"])).onsuccess = function(e) 
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
