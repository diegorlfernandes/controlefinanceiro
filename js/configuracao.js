
$(function() {
    (function(configuracao) {
		configuracao.iniciar = function(){
			configuracao.ExecutarEventos();
		}
		
		configuracao.ExecutarEventos = function(){
			$(document).on('pagebeforechange',function(e,data){
                var toPage = data.toPage[0].id;
                switch (toPage)	{
                    case 'pgConfiguracao':
						$('#pgAltConfiguracaoMesAno').datepicker( "setDate",new Date());
					break;
				}
			});
		}
		configuracao.iniciar();
    })(BancoDeDados);

});

