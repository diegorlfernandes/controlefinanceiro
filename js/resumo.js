
$(document).ready(function(resumo) {
       
    //*****Metodos da Página Resumo **********
    ResumoPorCategoria = function () {
        $.mobile.loading("show", 
        {
            text: "Loading report...",
            textVisible: true, 
            textonly: false, 
            html: ""
        });
        
        $('#RptResumoLancamentoCategoria tbody tr').remove();
        $('#pgRptResumoLancamentoCategoriaFoot td').remove();
        
        var  UmObjetoLancamento, TotalPorCategoria=0.00, categoria, TotalGeral=0.00;
        
        var Lancamentos = new Array();
        var LancamentosComValorPositivo = new Array();
        var LancamentosComValorNegativo = new Array();
        
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
                
                var ValorDecimal =  Number(UmObjetoLancamento.Valor.replace(".","").replace(",","."));
                
                
                if(categoria == UmObjetoLancamento.Categoria )
                {
                    TotalPorCategoria+= ValorDecimal;
                }
                else
                {
                    if(TotalPorCategoria>0)
                    LancamentosComValorPositivo.push(new Array(categoria,TotalPorCategoria));
                    else
                    LancamentosComValorNegativo.push(new Array(categoria,TotalPorCategoria));
                    
                    TotalPorCategoria = ValorDecimal;
                    categoria = UmObjetoLancamento.Categoria;				
                }
                
                TotalGeral += TotalPorCategoria;
                
                cursor.continue();
            }
            else
            {
                if(TotalPorCategoria>0)
                LancamentosComValorPositivo.push(new Array(categoria,TotalPorCategoria));
                else
                LancamentosComValorNegativo.push(new Array(categoria,TotalPorCategoria));
                
                LancamentosComValorPositivo.forEach (AdicionarLinha);
                LancamentosComValorNegativo.forEach (AdicionarLinha);						
                
                var TotalDecimal = TotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                AdicionarTotal(TotalDecimal);								
            }
        }
        $('#RptResumoLancamentoCategoria').table('refresh');
        $.mobile.loading("hide");
    };
    
    AdicionarLinha = function (value, index, ar) {
        var eachrow = '<tr>';
        eachrow+= '<td> '+value[0]+'</th>';
        eachrow+= '	<td>'+ value[1].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) +'</td>';
        eachrow+= '</tr>';
        $('#RptResumoLancamentoCategoria').append(eachrow);				
    }

    
    AdicionarTotal = function (TotalGeral) {
        var eachrow = '<tr>';
        eachrow+= '<td> Total</th>';
        eachrow+= '	<td>'+ TotalGeral +'</td>';
        eachrow+= '</tr>';
        $('#RptResumoLancamentoCategoria').append(eachrow);				
    }


    // AdicionarTotal = function (TotalGeral) {
    //     var eachrow = '<td>Saldo Total: '+TotalGeral.toFixed(2)+'</td>';
    //     $('#pgRptResumoLancamentoCategoriaFoot').append(eachrow);				
    // }		
});
