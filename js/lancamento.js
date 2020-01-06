
$(document).ready(function (lancamento) {
	var MensagemNoCorpoDaLista = '<li><a data-id="Z2"><h2>Z1</h2><p><span class="ui-li-count">COUNTBUBBLE</span></p></a></li>';
	var MensagemNoCabecalhoDaLista = '<li data-role="list-divider">Seus Lancamentos</li>';
	var MensagemNaoTemRegistroNaLista = '<li id="noLancamento">Você não registros</li>';




	// ***** Eventos *****

	$(document).on('pagebeforechange', function (e, data) {
		var toPage = data.toPage[0].id;
		switch (toPage) {
			case 'pgLancamento':
				$('#pgRptLancamentoBack').data('from', 'pgLancamento');
				ListarLancamentos();
				break;
			case 'pgEditLancamento':
				$('#pgRptLancamentoBack').data('from', 'pgEditLancamento');
				break;
			case 'pgAddLancamento':
				$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
				break;
			case 'pgRptResumoLancamentoCategoria':
				$('#pgRptLancamentoBack').data('from', 'pgAddLancamento');
				ResumoPorCategoria();
				break;
			default:
		}
	});
	$(document).on('pagecontainershow', function (e, ui) {
		var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
		switch (pageId) {
			case 'pgEditLancamento':
				LimparCamposPgEdit();
				var LancamentoID = parseInt($('#pgEditLancamento').data('id'));
				PreencherCampos(LancamentoID);
				break;
			case 'pgAddLancamento':
				LimparCamposPgAdd();
				ValidarCampos();
				ListarCategorias();
				break;
			default:
		}
	});


	$('#pgAddLancamentoBack').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
	});

	$('#pgAddLancamentoSave').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		InserirLancamentos();
	});

	$(document).on('click', '#pgLancamentoList a', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var href = $(this).data('id');
		$('#pgEditLancamento').data('id', href);
		$.mobile.changePage('#pgEditLancamento', { transition: TransicaoDaPagina });
	});
	$('#pgLancamentoNew').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		$('#pgAddLancamento').data('from', 'pgLancamento');
		$('#pgAddLancamentoheader h1').text('Lancamentos BancoDeDados > Add Lancamento');
		$('#pgAddLancamentoMenu').show();
		$.mobile.changePage('#pgAddLancamento', { transition: TransicaoDaPagina });
	});


	$('#pgEditLancamentoBack').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
	});
	$('#pgEditLancamentoUpdate').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		AtualizarLancamentos();
	});
	$('#pgEditLancamentoDelete').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var ID = $('#pgEditLancamentoLancamentoID').val().trim();
		$('#msgboxheader h1').text('Confirm Delete');
		$('#msgboxtitle').text(ID.split('-').join(' '));
		$('#msgboxprompt').text('Are you sure that you want to delete this Lancamento? This action cannot be undone.');
		$('#msgboxyes').data('method', 'ApagarLancamento');
		$('#msgboxyes').data('id', ID.split(' ').join('-'));
		$('#msgboxyes').data('topage', 'pgEditLancamento');
		$('#msgboxno').data('topage', 'pgEditLancamento');
		$.mobile.changePage('#msgbox', { transition: 'pop' });
	});



	$('#msgboxyes').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var yesmethod = $('#msgboxyes').data('method');
		var yesid = $('#msgboxyes').data('id');
		lancamento[yesmethod](yesid);
	});
	$('#msgboxno').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var toPage = $('#msgboxno').data('topage');
		$.mobile.changePage('#' + toPage, { transition: TransicaoDaPagina });

	});
	$('#alertboxok').on('click', function (e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var toPage = $('#alertboxok').data('topage');
		$.mobile.changePage('#' + toPage, { transition: TransicaoDaPagina });
	});



	// ***** Metodos da Página Listar Lançamentos *****

	ListarLancamentos = function (ListaDeLancamentos) {
		$.mobile.loading("show", {
			text: "Displaying records...",
			textVisible: true,
			textonly: false,
			html: ""
		});


		var ListaDeLancamentos = {};
		var tx = BancoDeDados.transaction(["Lancamento"], "readonly");
		var TabelaLancamento = tx.objectStore('Lancamento');
		var RequisicaoNaTabelaLancamento = TabelaLancamento.openCursor();

		RequisicaoNaTabelaLancamento.onsuccess = function (e) {
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
					
					if(UmObjetoLancamento.MesAno!=MesAno )
						continue;
							
					var nItem = MensagemNoCorpoDaLista;
					nItem = nItem.replace(/Z2/g, String(UmObjetoLancamento.LancamentoID));
					var nTitle = '';
					nTitle = UmObjetoLancamento.Categoria;
					if (UmObjetoLancamento.Descricao) {
						nTitle += " --> ";
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
			} else {
				$('#pgLancamentoList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');
			};
			$.mobile.loading("hide");
		};
		RequisicaoNaTabelaLancamento.onerror = function (e) {
			$('#pgLancamentoList').html(MensagemNoCabecalhoDaLista + MensagemNaoTemRegistroNaLista).listview('refresh');
			$.mobile.loading("hide");
		}
	};


	// ***** Metodos da Página Adicionar Lançamentos *****
	ListarCategorias = function () {
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
		RequisicaoNaTabelaLancamento.onsuccess = function (e) {
			var cursor = e.target.result;
			if (cursor) {

				CategoriaRec = cursor.value;

				var option = '<option value="' + CategoriaRec.Nome + '">' + CategoriaRec.Nome + '</option>';
				$('#pgAddLancamentoCategoria').append(option);
				cursor.continue();
			}
		}
		$('#pgAddLancamentoCategoria').selectmenu("refresh", true);

		$.mobile.loading("hide");
		RequisicaoNaTabelaLancamento.onerror = function (e) {
			$.mobile.loading("hide");
		}
	};


	LimparCamposPgAdd = function () {
		$('#pgAddLancamentoCategoria').empty();
		$('#pgAddLancamentoValor').val('');
		$('#pgAddLancamentoDescricao').val('');
		$("#pgAddLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
		$("#pgAddLancamentoTipoB").prop('checked', false).checkboxradio("refresh");
	}

	ValidarCampos = function () {
		$('#pgAddLancamentoValor').on('keyup', function (e) {
			var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAddLancamentoValor').val());
			$('#pgAddLancamentoValor').val(ValorFormatado);
		});
	}

	InserirLancamentos = function () {
		$.mobile.loading("show",
			{
				text: "Creating record...",
				textVisible: true,
				textonly: false,
				html: ""
			});

		var UmObjetoLancamento = {};
		UmObjetoLancamento.Descricao = $('#pgAddLancamentoDescricao').val().trim();
		UmObjetoLancamento.Categoria = $('#pgAddLancamentoCategoria').val().trim();
		UmObjetoLancamento.MesAno = MesAno;

		if ($("#pgAddLancamentoTipoA").is(":checked") )
			UmObjetoLancamento.Valor = "-" + $('#pgAddLancamentoValor').val().trim();
		else
			UmObjetoLancamento.Valor = $('#pgAddLancamentoValor').val().trim();


		var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");

		var retorno = tx.objectStore("Lancamento").add(UmObjetoLancamento);

		retorno.onsuccess = function (e) {

			toastr.success('Lancamento gravado com sucesso.', 'Cash');

			LimparCamposPgAdd();
			ListarCategorias();


		};
		retorno.onerror = function (e) {
			toastr.error('Erro. Lancamento não foi gravado.', 'Cash');
		};
		$.mobile.loading("hide");
	};


	// ***** Metodos da Página Editar Lançamentos *****

	LimparCamposPgEdit = function () {
		$('#pgEditLancamentoDescricao').val("");
		$('#pgEditLancamentoValor').val("");
		$("#pgEditLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
		$("#pgEditLancamentoTipoB").prop('checked', false).checkboxradio("refresh");

	}


	PreencherCampos = function (LancamentoID) {
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
		request1.onsuccess = function (e) {
			UmObjetoLancamento = e.target.result;
			ListarCategoriaPgEdit(UmObjetoLancamento.Categoria);

			$('#pgEditLancamentoLancamentoID').attr('readonly', 'readonly');
			$('#pgEditLancamentoLancamentoID').attr('data-clear-btn', 'false');
			$('#pgEditLancamentoLancamentoID').val(UmObjetoLancamento.LancamentoID);
			$('#pgEditLancamentoDescricao').val(UmObjetoLancamento.Descricao);
			$('#pgEditLancamentoValor').val(UmObjetoLancamento.Valor);
			if (parseInt(UmObjetoLancamento.Valor) >= 0) {
				$("#pgEditLancamentoTipoA").prop('checked', false).checkboxradio("refresh");
				$("#pgEditLancamentoTipoB").prop('checked', true).checkboxradio("refresh");
			} else {
				$("#pgEditLancamentoTipoA").prop('checked', true).checkboxradio("refresh");
				$("#pgEditLancamentoTipoB").prop('checked', false).checkboxradio("refresh");
			}

		}
		request1.onerror = function (e) {
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

	ListarCategoriaPgEdit = function (Categoria) {
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
		RequisicaoNaTabelaLancamento.onsuccess = function (e) {
			var cursor = e.target.result;
			if (cursor) {

				CategoriaRec = cursor.value;
				var option = '<option value="' + CategoriaRec.Nome + '">' + CategoriaRec.Nome + '</option>';
				$('#pgEditLancamentoCategoria').append(option);
				cursor.continue();
			}
			$('#pgEditLancamentoCategoria option[value="' + Categoria + '"]').attr({ selected: "selected" });

			$('#pgEditLancamentoCategoria').selectmenu("refresh", true);
		}
		$.mobile.loading("hide");
		RequisicaoNaTabelaLancamento.onerror = function (e) {
			$.mobile.loading("hide");
		}

	};


	AtualizarLancamentos = function () {
		$.mobile.loading("show",
			{
				text: "Update record...",
				textVisible: true,
				textonly: false,
				html: ""
			});

		var UmObjetoLancamento = {};
		UmObjetoLancamento.LancamentoID = parseInt($('#pgEditLancamentoLancamentoID').val());
		UmObjetoLancamento.MesAno = MesAno;
		UmObjetoLancamento.Categoria = $('#pgEditLancamentoCategoria').val();
		UmObjetoLancamento.Descricao = $('#pgEditLancamentoDescricao').val();
		UmObjetoLancamento.Valor = $('#pgEditLancamentoValor').val().trim()

		if ($("#pgEditLancamentoTipoA").is(":checked") && UmObjetoLancamento.Valor > 0)
			UmObjetoLancamento.Valor = "-" + UmObjetoLancamento.Valor;
		else
			UmObjetoLancamento.Valor = $('#pgEditLancamentoValor').val().trim();

		var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
		var TabelaLancamento = tx.objectStore("Lancamento");
		TabelaLancamento.get(UmObjetoLancamento.LancamentoID).onsuccess = function (e) {
			var RequisicaoNaTabelaLancamento = TabelaLancamento.put(UmObjetoLancamento);
			RequisicaoNaTabelaLancamento.onsuccess = function (e) {
				toastr.success('Lancamento record updated.', 'Lancamentos BancoDeDados');
				LimparCamposPgEdit();
				$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
			}
			RequisicaoNaTabelaLancamento.onerror = function (e) {
				toastr.error('Lancamento record not updated, please try again.', 'Lancamentos BancoDeDados');
				return;
			}
		};
		$.mobile.loading("hide");
	};

	lancamento.ApagarLancamento = function (LancamentoID) {
		$.mobile.loading("show", {
			text: "Deleting record...",
			textVisible: true,
			textonly: false,
			html: ""
		});
		var tx = BancoDeDados.transaction(["Lancamento"], "readwrite");
		var TabelaLancamento = tx.objectStore("Lancamento");
		var RequisicaoNaTabelaLancamento = TabelaLancamento.delete(parseInt(LancamentoID));
		RequisicaoNaTabelaLancamento.onsuccess = function (e) {
			toastr.success('Lancamento record deleted.', 'Lancamentos BancoDeDados');
			$.mobile.changePage('#pgLancamento', { transition: TransicaoDaPagina });
		}
		RequisicaoNaTabelaLancamento.onerror = function (e) {
			toastr.error('Lancamento record not deleted, please try again.', 'Lancamentos BancoDeDados');
			return;
		}
		$.mobile.loading("hide");
	};


});
