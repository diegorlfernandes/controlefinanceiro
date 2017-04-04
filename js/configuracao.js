
$(function() {
    (function(configuracao) 
	{
		configuracao.iniciar = function()
		{
			configuracao.ExecutarEventosTodasAsPaginas();
		}
		
		configuracao.ExecutarEventosTodasAsPaginas = function()
		{
			$(document).on('pagebeforechange',function(e,data){
                var toPage = data.toPage[0].id;
                switch (toPage)	{
                    case 'pgConfiguracao':
					$('#pgAltConfiguracaoMesAno').val(MesAno);
					break;
				}
			});
			
			$(document).on('pagecontainershow', function(e, ui) {
                var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
                switch (pageId) {
                    case 'pgConfiguracao':
					//configuracao.MascaraNoCampoSaldoInicial();
					break;
                    default:
				}				
			});
			
			$('#pgAltConfiguracaoBack').on('click', function(e) 
			{
                e.preventDefault();
                e.stopImmediatePropagation(); 
				$.mobile.changePage('#pgMenu', { transition: TransicaoDaPagina });
			});
			
			$('#pgAltConfiguracaoSaldoInicial').on('keyup', function(e) 
			{
				var ValorFormatado = formataValorNCasasMilhar(2, $('#pgAltConfiguracaoSaldoInicial').val());
				$('#pgAltConfiguracaoSaldoInicial').val(ValorFormatado);
			});			
		};
		
		
		
		configuracao.iniciar();
	})(BancoDeDados);
	
});

