/// <reference path="~/Scripts/jQuery/jquery-1.7.1.js" />

/************************************************************* 
* SGI
* ***********************************************************
* Diversas funções úteis em JavaScript.
* Usado e quase todas as telas.
*
* Obs.: Algumas coisas tranpostadas do FuncoesGlobais.js do AE.
*
* Dependências:
*   - jquery-1.5.1.min.js
* 
* 
* SGI - All rights reserved ©.
* Criado por: Renan Siravegna Moreira
* Data da Criação: ??/??/2011
* Modificado por: --
* Data da modificação: --
* Observação: --
* **********************************************************/

/**************************************************************************************
* Método extra para exibição de mensagens (popups, alertas, etc)
*
* Autor: Christian Bakargy de Souza
* E-mail: cbsouza@fazenda.ms.gov.br
*/
function Mensagem(options) {

    // botoes
    var btClose = null, btOk = null, btCancel = null;
    // títulos padrões
    var defaultTitle = ["Alerta", "Informação", "Erro", "Sucesso", "&nbsp;"];
    var modalLabel = null; // titulo do modal
    var title = null;
    var nMensagemContainer = document.createElement("div"); // cria  div container para a mensagem
    var nMensagem = document.createElement("div");          // cria  div para mensagem
    //
    var modalHeader = document.createElement("div");
    var modalBody = document.createElement("div");
    var modalFooter = document.createElement("div");

    var mClass = null, mTituloClass = null;                 // class para a div de mensagem
    var data = new Date();

    //Parâmetros defaults
    var defaults = {
        //modal: true,                  // modal popup        
        tipo: null, type: null,         // tipo de mensagem (alerta, aviso, erro, sucesso)    
        titulo: null, title: null,      // titulo da mensagem
        defaulttitle: true,             // seta título por default ( true or false)
        texto: null, text: null,        // texto da mensagem
        scroll: true,                   // scroll para o conteudo
        url: null,                      // req. ajax para renderização no corpo do modal
        dialog: false,                  // define se é um popup ou não
        confirm: false,                 // define se é uma tela deconfirmação
        close: true,                    // define se mostra ou não o botao de fechar
        closebutton: true,              // define se o botao de fechar deve aparecer na barra de botoes no rodapé
        cancelbutton: false,            // define se o botao de cancelar deve aparecer na barra de botoes no rodapé
        okbutton: false,                // define se o botao de OK deve aparecer na barra de botoes no rodapé
        divPai: null, target: null,     // define qual o target pai para o mensagem        
        height: 'auto',                 // seta o height da tela de mensagem
        maxheight: 300,
        width: null,                     // seta o width da tela de mensagem
        maxwidth: 500,
        timeOut: null,                 // seta um timeout para exibição da mensagem
        OkEvent: null,                  // customiza o evento onclick do botao de ok
        CancelEvent: null,              // customiza o evento onclick do botao de cancelar
        CloseEvent: null,               // customiza o evento onclick do botao de fechar
        tabindex: -1,
        // botoes customizados
        // ex: buttons: {
        //      ok: { name: "OK", id:"btOk", type:"button", class:"btn", click: function(){} },
        //      cancelar: { onclick: function(){} } 
        // }
        buttons: {}
    };

    options = $.extend(defaults, options);

    // seta o id da mensagem
    var id = "ModalPopUp" + data.getDate() + data.getTime();
    $(nMensagem).attr("id", id);

    // seta o id do container
    var containerId = "c" + id;
    $(nMensagemContainer).attr("id", containerId);

    // verifica se existe eventos para botões ok ou cancelar
    // se existir cria os bottoes
    if (options.OkEvent || options.okbutton || options.confirm) {
        options.buttons.ok = {
            name: "Ok",
            "class": 'btn btn-primary',
            click: function () {
                $("#" + id).modal("hide");
                setTimeout(function () { $('#' + containerId).remove(); }, 2000);
                if (options.OkEvent) options.OkEvent();
            }
        };
    }
    if (options.CancelEvent || options.cancelbutton || options.confirm) {
        options.buttons.cancel = {
            name: "Cancelar",
            "class": 'btn',
            click: function () {
                $("#" + id).modal("hide");
                setTimeout(function () { $('#' + containerId).remove(); }, 2000);
                if (options.CloseEvent) options.CloseEvent();
            }
        };
    }
    if (options.dialog && !options.confirm && (options.CloseEvent || options.closebutton)) {
        options.buttons.close = {
            name: "Fechar",
            "class": "btn",
            click: function () {
                $("#" + id).modal("hide");
                setTimeout(function () { $('#' + containerId).remove(); }, 2000);
                if (options.CloseEvent) options.CloseEvent();
            }
        };
        $(options.buttons.close).attr("aria-hidden", "true").attr("data-dismiss", "modal");
    }

    // inclução do botão fechar
    if (options.close) {
        // inclui o botão de fechar - cabeçalho
        btClose = document.createElement("button");
        $(btClose).attr("type", "button")
            .addClass("close")
            .click(function () {
                $("#" + id).modal("hide");
                setTimeout(function () { $('#' + containerId).remove(); }, 2000);
                if (options.CloseEvent) options.CloseEvent();
            })
            .html("&times;");
    }

    // verifica o tipo de mensagem
    if (options.tipo || options.type) {
        var type = options.tipo || options.type;
        var intRegex = /^\d+$/;
        if (!intRegex.test(type)) type = type.toLowerCase();
        switch (type) {
            case 'alerta': case 'alert': case 1:
                mClass = 'alert-block';
                mTituloClass = 'text-warning';
                if (options.defaulttitle && !(options.titulo || options.title))
                    options.title = defaultTitle[0];
                break;
            case 'aviso': case 'info': case 2:
                mClass = 'alert-info';
                mTituloClass = 'text-info';
                if (options.defaulttitle && !(options.titulo || options.title))
                    options.title = defaultTitle[1];
                break;
            case 'erro': case 'error': case 3:
                mClass = 'alert-error';
                mTituloClass = 'text-error';
                if (options.defaulttitle && !(options.titulo || options.title))
                    options.title = defaultTitle[2];
                break;
            case 'sucesso': case 'success': case 4:
                mClass = 'alert-success';
                mTituloClass = 'text-success';
                if (options.defaulttitle && !(options.titulo || options.title))
                    options.title = defaultTitle[3];
                break;
            default:
                mClass = null;
                mTituloClass = null;
                if (options.defaulttitle && !(options.titulo || options.title))
                    options.title = defaultTitle[4];
                break;
        }
    }

    // verifica se existe botões extras           
    if (typeof options.buttons === 'object' && options.buttons !== null) {
        var hasButtons = false;
        $.each(options.buttons, function () {
            return !(hasButtons = true);
        });
        // se existir botões extras
        if (hasButtons) {
            $.each(options.buttons, function (name, props) {
                props = $.isFunction(props) ? { click: props, text: name } : props;
                var btName = (props.name) ? props.name : name;
                var type = (props.type) ? props.type : "button";
                var button = $('<button type="' + type + '">' + btName + '</button>')
					.click(props.click || props.onclick);

                $.each(props, function (key, value) {
                    if (key === "click" || key === "type") {
                        return;
                    }
                    if (key in button) {
                        button[key](value);
                    } else {
                        button.attr(key, value);
                    }
                });
                $(modalFooter).append(button);
            });
        }
    }


    // configura o tipo de mensagem
    if (options.dialog) {
        $(nMensagem).attr("aria-hidden", "true")
           .attr("aria-labelledby", "ModalLabel")
           .attr("role", "dialog")
           .attr("tabindex", options.tabindex)
           .addClass("modal hide fade");

        if (options.width) {
            $(nMensagem).width(options.width);

            // verificando o tipo de tamanho
            if (typeof (options.width) == "string") {
                if (options.width.substring(options.width.length - 1) == '%') {
                    var tipo = options.width.split("%");
                    $(nMensagem).css("margin", "auto auto auto auto");
                    $(nMensagem).css("left", ((100 - tipo[0]) / 2) + "%");
                }
            }
        }

        $(modalHeader).addClass("modal-header");
        $(modalBody).addClass("modal-body");
        $(modalFooter).addClass("modal-footer");

        // inclução do botão fechar
        if (options.close) {
            // inclui o botão de fechar - cabeçalho               
            $(btClose).attr("aria-hidden", "true").attr("data-dismiss", "modal");
            $(modalHeader).append(btClose);
        }
        // seta o titulo para a caixa de dialogo  
        modalLabel = document.createElement("h4");
        $(modalLabel).attr("id", "ModalLabel");
        if (options.titulo || options.title) {
            title = options.titulo || options.title;
            $(modalLabel).attr("title", title)
                    .addClass(mTituloClass)
                    .html(title);
        }
        else {
            $(modalLabel).html("&nbsp;");
        }
        $(modalHeader).append(modalLabel);

        // seta o texto da mensagem
        if (options.texto || options.text) {
            $(modalBody).height(options.height).addClass("alert").addClass(mClass);
            $(modalBody).css({ "max-height": options.maxheight + "px" });
            if (options.scroll)
                $(modalBody).addClass("scroll");
            $(modalBody).append("<p>" + (options.texto || options.text) + "</p>");
        }
        //if (options.url) {
        //    var destino = "#" + id + " div[class='modal-body']";
        //    rAjax({
        //        destino: (options.destino) ? options.destino : destino,
        //        url: options.url,
        //        loading: (options.loading) ? options.loading : destino
        //    });
        //}

        $(nMensagem).append(modalHeader);
        $(nMensagem).append(modalBody);
        $(nMensagem).append(modalFooter);
        $(nMensagem).modal("show");
    }
        // caso nao seja um alert normal
    else {
        $(nMensagem).addClass("alert " + mClass + " fade in");
        // inclução do botão fechar
        if (options.close) {
            // inclui o botão de fechar - cabeçalho       
            $(btClose).attr("data-dismiss", "alert");
            $(nMensagem).append(btClose);
        }
        // seta o titulo para a caixa de dialogo  
        modalLabel = document.createElement("h4");
        $(modalLabel).attr("id", "ModalLabel");
        if (options.titulo || options.title) {
            title = (options.titulo || options.title);
            $(modalLabel).attr("title", title)
                .addClass(mTituloClass)
                .html(title);
        }
        else {
            $(modalLabel).html("&nbsp;");
        }
        $(nMensagem).append(modalLabel);
        // seta o texto da mensagem
        if (options.texto || options.texto) {
            $(nMensagem).append("<p>" + (options.texto || options.text) + "</p>");
            if (options.scroll)
                $(nMensagem).addClass("scroll");
        }
        $(nMensagem).append(modalFooter);
    }

    $(nMensagemContainer).prepend(nMensagem);

    // verifica se tem um div pai
    if (options.divPai) {
        options.divPai = (options.divPai.indexOf("#") == -1 && options.divPai.indexOf(".") == -1) ? "#" + options.divPai : options.divPai;
        $(options.divPai).prepend(nMensagemContainer);
    }
    else {
        $("body").prepend(nMensagemContainer);
    }

    // se tiver um timeOut
    if (options.timeOut) {
        setTimeout(function () {
            $("#" + containerId).animate({ height: 'toggle' }, 'slow');
            $("#" + id).modal("hide");
            setTimeout(function () { $('#' + containerId).remove(); }, 1500);
        }
        , options.timeOut);
    }

    return $(nMensagemContainer);
}


/********************************************************
* Função para diminuir a execução da função jQuery.ajax
* O uso de jQuery.post as vezes não é util por suas limitações.
* Um exemplo de sua limitação é quando um método necessita receber
* lista de entidades como paâmetro (em List ou Array) que para
* funcionar deve ser enviada em formato string (não funciona
* mandando o objeto direto), que o jQuery.post não
* suporta (suporta somente o objeto json).
*
* Autor: Renan Siravegna
* E-mail: rsmoreira@fazenda.ms.gov.br
*/
function ajax(action, data, success, error, beforeSend, complete, quote, paramAdicionais) {
    //URL do ajax, que sempre deverá ser uma Action do Controller
    action = action || "";

    //Parâmetros do ajax, podendo ser uma string json ou um objeto json
    data = data || "{}";

    /*
    Parâmetros de sucesso, erro, antes de enviar e ao completar do ajax.
    Devem ser enviados funções JS em variáveis, exemplo:

    var sucesso = function(data) {
    alert("Do something!");
    };

    var erro = function()...;
    var antesEnviar = function()...;
    var completar = function()...;

    Os parâmetros que recebem da função estão todos listados nos ajax
    events na jQuery.API no site oficial
    */
    success = success || "";
    error = error || "";
    beforeSend = beforeSend || "";
    complete = complete || "";

    /*
    Caso seja string e não usar JSON.stringify em um objeto json, pode
    optar por esta opção que substituirá todos os | (pipe) da string
    por aspas, não necessitando assim escapar as aspas na string ("\"").

    Exemplo:
    string original = "{ param1: |Nome|, param2: |Sobrenome| }";
    string depois do quote = "{ param1: \"Nome\", param2: \"Sobrenome\" }";
    */
    quote = quote || false;

    if (quote == true)
        data = data.replace(/\|/g, "\"");

    /*
    Propriedades muito relevantes estarão em parâmetros
    pre-definidos, os demais estarão deste JSON.
    */
    var async = paramAdicionais.async == false ? false : true;

    jQuery.ajax({
        url: action,
        type: "POST",
        data: data,
        async: async,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        beforeSend: beforeSend,
        complete: complete,
        success: success,
        error: error
    });
}

/********************************************************
* O nome diz tudo.
*
* Autor: Renan Siravegna
* E-mail: rsmoreira@fazenda.ms.gov.br
*/
String.prototype.padLeft = function (pchar, qtde) {
    var pfinal = "";

    if (qtde > this.length) {
        for (var i = 0; i < qtde - this.length; i++) {
            pfinal += pchar;
        }
    }

    return pfinal + this;
}


/********************************************************
* Função de apenas números
*
* Autor: Renan Siravegna
* E-mail: rsmoreira@fazenda.ms.gov.br
*/
function customNumeric(e, excecoes) {
    //var whichCode = (window.Event) ? e.which : e.keyCode;
    var whichCode = (e.which) ? e.which : event.keyCode;

    //Teclas funcionais permitidas.
    switch (whichCode) {
        case (8): return true; //Backspace
        case (9): return true; //Tab
        case (13): return true; //Enter
        case (16): return true; //Shift
        case (17): return true; //Ctrl
        case (35): return true; //End
        case (36): return true; //Home
        case (37): return true; //Seta esquerda
        case (39 && String.fromCharCode(39) != "'"): return true; //Seta direita, (aspas tem o mesmo númeric, por isso o if)
        case (46 && String.fromCharCode(46) != "."): return true; //Delete

        case (67): if (e.ctrlKey) return true; //Ctrl + C
        case (88): if (e.ctrlKey) return true; //Ctrl + X
        case (118): if (e.ctrlKey) return true; //Ctrl + V

            //Tratamento para as demais.
        default:
            key = String.fromCharCode(whichCode);

            var strCheck = "0123456789";

            if (excecoes) strCheck += excecoes;

            if (strCheck.indexOf(key) == -1) {
                //e.returnValue = false;
                return false;
            }

            return true;
    }
}

/********************************************************
* Função para criar o método trim();
*
* Autor: Rauni Marques
* E-mail: ramarques@fazenda.ms.gov.br
*/
String.prototype.trim = function () { return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")); };

/*********************************************************
*Variáveis para setar os dias e meses para o datepicker do jQuery, pois ele trás o default em inglês.
*
* Autor: Rauni Marques
* E-mail: ramarques@fazenda.ms.gov.br
*/
var dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"];
var dayNamesMin = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
var monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var monthNamesShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Numeric only control handler
jQuery.fn.SoNumeros = function () {
    return this.each(function () {
        jQuery(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};


/********************************************************
* Validação de Data no formato dd/MM/yyyy.
* Recebe o elemento completo onde esta a data. Ex de uso.: onblur="validaData(this.value);"
*
* Autor: Renan Siravegna
* E-mail: rsmoreira@fazenda.ms.gov.br
*/
function validaData(valor) {

    var date = valor;

    //Ao deixar vazio, vem com a máscara __/__/____ e quando não vem completo vem xx/y_/_____ ou algo do tipo.
    //Aqui eu dou replace nas / e _ para então verificar se os número somam 8 digitos, sendo assim uma data completa.
    if (date.replace(/\//gi, "").replace(/_/gi, "").length != 8) return false;

    //Quebrando a data em vetores
    date = date.split("/");

    //Quando é 08 o parseInt do JS retorna 0, então aqui eu removo os zeros
    if (date[0].substring(0, 1) == "0")
        date[0] = date[0].substring(1);

    if (date[1].substring(0, 1) == "0")
        date[1] = date[1].substring(1);

    //Já validando se o ano é pelo menos maior do que o menor permitido pelo sql server
    if (parseInt(date[2]) < 1900)
        return false;

    //Criando a data
    var dt = new Date(date[2], date[1] - 1, date[0]);

    //Verificando se os valores criados batem com os digitados (JS cria data diferente para datas inválidas)
    var vYear = parseInt(date[2]) == parseInt(dt.getFullYear());
    var vMonth = parseInt(date[1]) == parseInt(dt.getMonth() + 1);
    var vDay = parseInt(date[0]) == parseInt(dt.getDate());

    if (!(vYear && vMonth && vDay)) {
        return false;
    }

    return true;
}


jQuery.fn.DataValida = function () {
    jQuery(this).blur(function (e) {
        if (!validaData(jQuery(this).val()))
            jQuery(this).val("");
    });
};

jQuery.fn.Date = function () {
    if (!validaData(jQuery(this).val()))
        return "";
    else
        return jQuery(this).val();
};

/* ********* ToMascara() *********
 * Função para formatar qualquer string para a máscara informada
 *
 * Exemplo: 
 *          var telefone = 6798765432; 
 *          telefone.ToMascara("(99)9999-9999"); 
 * retorna: (67)9876-5432
 *
 * Autor: Ycaro Afonso
 * Data da Criação: 03/10/2013
 * E-mail: ysmsouza@fazenda.ms.gov.br
 */
String.prototype.ToMascara = function (mascara) {
    var x = 1;
    var rp = mascara.replace(/(\w)/gi, function (match, contents, offset, s) { return "$" + x++; });
    return this.replace(new RegExp(this.replace(/([\w])/gi, "([\\w])")), rp);
};

String.prototype.RemoveMascara = function () {
    return this.replace(/[^\d+]/gi, "");
};

/* ********* this.ToIE_CPF_CNPJ() *********
 * Função para formatar automáticamente um campo string para IE, CPF ou CNPJ
 *
 * Exemplo: 
 *          $("#IdObj").val().ToIE_CPF_CNPJ();
 *          retorna: 12.345.678-9
 *
 *          var campo = "12345678912";
 *          campo.ToIE_CPF_CNPJ();
 *          retorna 123.456.789-12
 *
 * Autor: Ycaro Afonso
 * Data da Criação: 03/10/2013
 * E-mail: ysmsouza@fazenda.ms.gov.br
 */
String.prototype.ToIE_CPF_CNPJ = function () {
    switch (this.length) {
        case 9: // IE
            return this.ToMascara("99.999.999-9");
        case 11: // CPF
            return this.ToMascara("999.999.999-99");
        case 14: // CNPJ
            return this.ToMascara("99.999.999/9999-99");
    }
    return null;
};

String.prototype.ToTipoIdentificacao = function () {
    switch (this.length) {
        case 9:
            return "IE";
        case 11:
            return "CPF";
        case 14:
            return "CNPJ";
    }
    return null;
};

/* ********* this.BotaoFlutuante() *********
 * Torna o objeto flutuante quando o objeto sai da área visível do browser.
 * 
 * Exemplo: 
 *      $("#o1").BotaoFlutuante({
 *          tamanhoMenu: 47, // Define o altura da área do menu fixo na tela
 *          objetoRelacionado: $("#objeto2") // não é obrigatório, mas quando definido, o objeto flutuante só mostra quando o "objetoRelacionado" não estiver mostrando na área visível do browser
 *          });
 *
 *
 * Autor: Ycaro Afonso
 * Data da Criação: 05/06/2014
 * E-mail: ysmsouza@fazenda.ms.gov.br
 */
$.fn.BotaoFlutuante = function (options) {
    var settings = $.extend({
        tamanhoMenu: 47,
        objetoRelacionado: null,
        cssClassFlutuante: null,
        zIndex: 100002,
    }, options);

    var $obj = this,
		$window = $(window),
		offset = $obj.offset(),
		offsetObjetoRelacionado = settings.objetoRelacionado != null ? settings.objetoRelacionado.offset() : null,
        isMovimento = false;

    // Faz uma cópia do objeto flutuante
    var idObjCopiado = $obj.attr("id") + "_copia";
    $("body").append($("<div/>").attr("id", idObjCopiado).css({ display: "none" }).html(
        this.clone().addClass(settings.cssClassFlutuante).css({ display: "none" }).html()
    ));
    var objCopia = $("#" + idObjCopiado);


    $window.scroll(function () {
        if ($window.scrollTop() + settings.tamanhoMenu >= offset.top && (settings.objetoRelacionado == null || !(offsetObjetoRelacionado.top >= $window.scrollTop() + settings.tamanhoMenu && offsetObjetoRelacionado.top <= $window.scrollTop() + $window.height() - 10))) {
            objCopia.css({ display: "", position: "fixed", left: offset.left + "px", "top": settings.tamanhoMenu + "px", "z-index": settings.zIndex });
            isMovimento = true;
        } else if (isMovimento) {
            objCopia.css({ display: "none" });
            isMovimento = false;
        }
    });

    return this;
};

/* ********* Marcar Todos os CheckBoxs de um Formulario *********
 *  Passar o valor do do checkBoxs e o id do formulario
 *
 * Autor: Rafael Pagliari
 * Data da Criação: 30/07/2014
 * E-mail: rpagliari@fazenda.ms.gov.br
 */
$.fn.MarcarDesmarcarTodosCheckBox = function (isChecado) {
    this.find('input').prop("checked", isChecado);
};

/* ******* Marca se todos os checkboxs estão checados ou *******************
**** se checar o todos e depois desmarcar um ele desmarca o que marca todos ******
*
*  Passar o valor do do checkBoxs e o id do check todos e o do formulario
*/
$.fn.MarcarDesmarcarCheckTodos = function (isChecado, nomeTodos) {
    if (isChecado == false) {
        $(nomeTodos).prop("checked", isChecado);
    }
    if ($("tbody input[type=checkbox]:not(:checked)", this).length == 0) {
        $(nomeTodos).prop("checked", true);
    }
};

/**************************************************************************************
* Adaptado o método 'Mensagem' para exibição de mensagens usando Noty (popups, alertas, etc)
* Autor: Christian Bakargy de Souza
*
* Alterado por: Orlando Carlos da Silva Veiga
* E-mail: osveiga@fazenda.ms.gov.br
*
* Pluglin retirado da página: http://ned.im/noty/
* deve ser inserido a linha abaixo em '_layout.cshtml'
* <script type="text/javascript" src="js/noty/packaged/jquery.noty.packaged.min.js"></script>
*/
function MensagemNoty(options) {
    //
    // Definir o nome do id da mensagem
    var mId = "noty_" + (new Date).getTime() * Math.floor(1e6 * Math.random());
    if (options.id)
        mId = options.id;
    //
    // Layout a ser aprensentado na tela
    var mLayout = 'top';
    if (options.layout)
        mLayout = options.layout;
    var mModal = false;
    if (options.dialog || options.modal)
        mModal = true;
    //
    //

    //
    // Timeout para exibição da mensagem na tela.
    var mTimeOut = false;
    if (options.timeout)
        mTimeOut = options.timeout;
    //
    // Texto da mensagem a ser exibida na tela.
    var mTexto = '';
    if (options.text || options.texto)
        mTexto = options.text || options.texto;
    //
    //

    //
    // Instância o tipo de mensagem a ser mostrada na tela.
    mType = 'alert';
    if (options.tipo || options.type) {
        var type = options.tipo || options.type;
        var intRegex = /^\d+$/;
        if (!intRegex.test(type)) type = type.toLowerCase();
        switch (type) {
            case 'alerta': case 'alert': case 1:
                mType = 'warning';
                break;
            case 'aviso': case 'info': case 2:
                mType = 'information';
                break;
            case 'erro': case 'error': case 3:
                mType = 'error';
                break;
            case 'sucesso': case 'success': case 4:
                mType = 'success';
                break;
            default:
                mType = 'alert';
                break;
        }
    }
    //
    //

    //
    // Ação para fechar a janela
    var mClose = ['click', 'button'];
    if (options.btClose) {
        mClose = options.btClose;
    }

    //
    // Montar o array dos botões atribuidos em 'OPTIONS'
    var mButtons = false;

    if (options.OkEvent || options.okbutton || options.confirm) {
        if (mButtons == false)
            mButtons = Array();
        mButtons.push({
            text: "Ok",
            addClass: 'btn btn-primary',
            onClick: function ($noty) {
                if (options.OkEvent) options.OkEvent();
                $noty.close();
            }
        });
    }
    if (options.CancelEvent || options.cancelbutton || options.confirm) {
        if (mButtons == false)
            mButtons = Array();
        mButtons.push({
            text: "Cancelar",
            addClass: 'btn',
            onClick: function ($noty) {
                $noty.close();
                if (options.CloseEvent) options.CloseEvent();
            }
        });
    }
    if (options.dialog && !options.confirm && (options.CloseEvent || options.closebutton)) {
        if (mButtons == false)
            mButtons = Array();
        mButtons.push({
            text: "Fechar",
            addClass: "btn",
            onClick: function ($noty) {
                $noty.close();
                if (options.CloseEvent) options.CloseEvent();
            }
        });
    }
    // Fim do array
    //

    //
    // verifica se existe botões extras           
    if (typeof options.buttons === 'object' && options.buttons !== null) {
        var hasButtons = false;
        $.each(options.buttons, function () {
            return !(hasButtons = true);
        });
        // se existir botões extras
        if (hasButtons) {
            $.each(options.buttons, function (name, props) {
                var btName = (props.name) ? props.name : name;
                var btnCls = (props.class) ? props.class : 'btn';
                if (mButtons == false)
                    mButtons = Array();
                mButtons.push({
                    text: btName,
                    addClass: btnCls,
                    onClick: function ($noty) {
                        $noty.close();
                        if (props.click) props.click();
                        if (props.onclick) props.onclick();
                    }
                });
            });
        }
    }

    var n = {
        id: mId,
        layout: mLayout,
        theme: 'defaultTheme',
        type: mType,
        text: mTexto,             // can be html or string
        dismissQueue: true,       // If you want to use queue feature set this true
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation: {
            open: { height: 'toggle' },
            close: { height: 'toggle' },
            easing: 'swing',
            speed: 500           // opening & closing animation speed
        },
        timeout: mTimeOut,          // delay for closing event. Set false for sticky notifications
        force: false,            // adds notification to the beginning of queue when set to true
        modal: mModal,
        maxVisible: 5,           // you can set max visible notification for dismissQueue true option,
        killer: false,           // for close all notifications before show
        closeWith: mClose,       // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all open notifications
        callback: {
            onShow: function () { },
            afterShow: function () { },
            onClose: function () { },
            afterClose: function () { }
        },
        buttons: mButtons        // an array of buttons
    }

    //
    // Mostra a mensagem na tela.
    if (options.dialog || mLayout != 'top')
        noty(n);
    else
        $(".navbar").noty(n);

    return null;
}

function MensagemNotyConfirma(options) {
    options.modal = true;
    options.okbutton = true;
    options.cancelbutton = true;
    options.tipo = 'aviso';
    options.btClose = 'backdrop';
    MensagemNoty(options);
}

function MensagemNotyAlerta(options) {
    options.modal = true;
    options.okbutton = true;
    options.cancelbutton = true;
    options.tipo = 'alerta';
    options.btClose = 'backdrop';
    MensagemNoty(options);
}

function MensagemNotyCarregando() {
    var options = {
        id: 'noty_Carregando',
        theme: 'defaultTheme',
        text: "<h4>Carregando… <img src='" + content + "Content/img/ajax-loader-grande.gif' /></h4> ",
        layout: 'center',
        modal: true,
        okbutton: false,
        cancelbutton: false,
        btClose: 'backdrop'
    };
    MensagemNoty(options);
}

$.fn.MensagemNotyFlutuante = function (options) {
    var settings = $.extend({
        tamanhoMenu: 47,
        objetoRelacionado: null,
        cssClassFlutuante: null,
        zIndex: 100002,
    }, options);

    var $obj = this,
		$window = $(window),
		offset = $obj.offset(),
		offsetObjetoRelacionado = settings.objetoRelacionado != null ? settings.objetoRelacionado.offset() : null,
        isMovimento = false;

    // Faz uma cópia do objeto flutuante
    var idObjOrigem = $obj.attr("id");
    var idObjCopiado = $obj.attr("id") + "_copia";
    var vDisplay = $obj.css("display");
    //$("body").append($("<div/>").attr("id", idObjCopiado).css({ display: vDisplay }).html(
    //    this.clone().addClass(settings.cssClassFlutuante).css({ display: "block" }).html()
    //));
    var objCopia = $("#" + idObjCopiado);


    $window.scroll(function () {
        if ($("#" + idObjOrigem).css("display") != "none") {
            if ($window.scrollTop() + settings.tamanhoMenu >= $("#" + idObjOrigem).offset().top && (settings.objetoRelacionado == null || !(offsetObjetoRelacionado.top >= $window.scrollTop() + settings.tamanhoMenu && offsetObjetoRelacionado.top <= $window.scrollTop() + $window.height() - 10))) {
                if (!isMovimento) {
                    if (vDisplay == "none") {
                        vDisplay = "block";
                        $("#" + idObjCopiado).attr("style", "display:block");
                    }
                    MensagemNoty({ id: "noty_" + idObjCopiado, text: $("#" + idObjOrigem).html(), btClose: 'backdrop' });
                    isMovimento = true;
                }
            } else if (isMovimento) {
                $.noty.close("noty_" + idObjCopiado);
                isMovimento = false;
            }
        }
    });

    return this;
};

function formataValorNCasas(N, campo) {
    campo.value = filtraCampo(campo);
    vr = tiraZeros(campo.value);
    tam = vr.length;
    if (vr == "") {
        campo.value = vr;
        return;
    }
    if (tam <= N) {
        campo.value = '0,' + vr.padLeft('0', N);
    }
    if ((tam > N)) {
        campo.value = vr.substr(0, tam - N) + ',' + vr.substr(tam - N, tam);
    }
	
}
function formataValorNCasasMilhar(N, campo) {
    campo = filtraCampo(campo);
    vr = tiraZeros(campo);
    tam = vr.length;

    if (vr == "") {
        campo = vr;
        return;
    }
    if (tam <= N) {
        campo = '0,' + vr.padLeft('0', N);
    }
    if ((tam > N)) {
        var tmp = vr;
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");

        if (tam > 5)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        if (tam > 8)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2,$3");
        if (tam > 11)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2.$3,$4");

        campo = tmp;
    }
	return campo;
}
function filtraCampo(campo) {
    var s = "";
    var cp = "";
    var vr = campo;
    var tam = campo.length;
    for (var i = 0; i < tam; i++) {
        if (vr.substring(i, i + 1) != "/" && vr.substring(i, i + 1) != "-" && vr.substring(i, i + 1) != "." && vr.substring(i, i + 1) != ",") {
            s = s + vr.substring(i, i + 1);
        }
    }
    campo = s;
    return cp = campo;
}

function tiraZeros(valor) {
    var tam = valor.length;
    var cont = 0;
    var comzero = new String;
    for (var i = 0; i < tam; i++) {
        if (valor.substring(i, i + 1) == 0) {
            comzero = comzero;
            if (cont == 1) {
                comzero = comzero + valor.substring(i, i + 1);
            }
        } else {
            comzero = comzero + valor.substring(i, i + 1);
            cont = 1;
        }
    }
    return (comzero == "") ? "0" : comzero;
}

// metodos para comparação de datas
// return 0 datas iguais
// return 1 dataFinal Maior
// return -1 dataInicial Maior
// * Criado por: Rafael Rodrigo Pagliari
// * E-mail: rpagliari@fazenda.ms.gov.br

function CompararDatas(dataInicial, dataFinal) {
    if (moment.duration(moment(dataFinal, 'DD-MM-YYYY').diff(moment(dataInicial, 'DD-MM-YYYY'))) == 0)
        return 0;
    else if (moment(dataInicial, 'DD-MM-YYYY').isAfter(moment(dataFinal, 'DD-MM-YYYY')))
        return -1;
    else
        return 1;
}


function RegistraDateTime(id) {
    var obj = jQuery(id);
    obj.mask("99/99/9999").datepicker({
        beforeShow: function () {
            setZindexDatePicker();
        }, autoclose: true
    }).on('changeDate', function (ev) {
        obj.datepicker('hide').change();
    }).DataValida();
    $("#icon_" + id).on('click', function (ev) {
        obj.datepicker("show");
    });
}

/**********função Adcionar Erros***********
*
*  Adiciona erro padrão conforma a Validação  na Documentação
*   Autor: Nelson Nunes Campozano
*   E-mail: nncampozano@fazenda.ms.gov.br
*   Onde é necesssario enviar os *campo, idMensagen onde a mensagem será escrito,
*   idCampo o id do campo para adicionar o erro em vermelho, 
*   o idgrupo para adicionar o erro ao grupo e a mensagem para escrever no erro
*/

function adicionarErros(idmensagem, idcampo, idgrupo, decricaoMsg) {
    if (idmensagem != null)
        idmensagem.html("<span class=\"field-validation-error\">" + decricaoMsg + "</span>");
    if (idcampo != null)
        idcampo.addClass("input-validation-error");
    if (idgrupo != null)
        idgrupo.addClass("error");
}

/**********função Remover Erros***********
*
*  Remover erros adicionado na função adiciona erros
*   Autor: Nelson Nunes Campozano
*   E-mail: nncampozano@fazenda.ms.gov.br
*   Onde é necesssario enviar os *campo, idMensagen onde a mensagem será escrito,
*   idCampo o id do campo para adicionar o erro em vermelho, 
*   o idgrupo para adicionar o erro ao grupo 
*/
function removerErros(mensagem, campo, grupo) {
    if (campo != null)
        campo.removeClass("input-validation-error");
    if (grupo != null)
        grupo.removeClass("error");
    if (mensagem != null)
        mensagem.html("");
}

/**********Compara data Inicial e data Final***********
*
*  Compara a Data de Inicio e Fim onde os dois parametros são os campo no formato de datas
*   Autor: Nelson Nunes Campozano
*   E-mail: nncampozano@fazenda.ms.gov.br
*   Onde é necesssario enviar os data inicial e data final
*/
function compararData(inicial, final) {
    var aux = inicial.val();
    var retorno = aux.split("/");
    var vYear = retorno[2];
    var vMonth = retorno[1];
    var vDay = retorno[0];
    var dataInical = new Date(vYear + "/" + vMonth + "/" + vDay);

    aux = final.val();
    retorno = aux.split("/");
    vYear = retorno[2];
    vMonth = retorno[1];
    vDay = retorno[0];
    var datafinal = new Date(vYear + "/" + vMonth + "/" + vDay);

    if (dataInical > datafinal) {
        return false;
    }
    return true;
}

/**********Compara Referencia Inicial e Referencia Final***********
*
*  Compara a Referencia de Inicio e Fim onde os dois parametros são os campo no formato de Referencia
*   Autor: Nelson Nunes Campozano
*   E-mail: nncampozano@fazenda.ms.gov.br
*   Onde é necesssario enviar os Referencia inicial e Referencia final
*/
function compararReferencia(inicial, final) {
    var aux = inicial.val();
    var retorno = aux.split("/");
    var vYear = retorno[1];
    var vMonth = retorno[0];
    var vDay = '01';
    var dataInical = new Date(vYear + "/" + vMonth + "/" + vDay);

    aux = final.val();
    retorno = aux.split("/");
    vYear = retorno[2];
    vMonth = retorno[1];
    vDay = retorno[0];
    var datafinal = new Date(vYear + "/" + vMonth + "/" + vDay);

    if (dataInical > datafinal) {
        return false;
    }
    return true;
}

//valida o CNPJ digitado
function ValidarCNPJ(ObjCnpj) {
    var cnpj = ObjCnpj.val();
    var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
    var dig1 = new Number;
    var dig2 = new Number;

    exp = /\.|\-|\//g
    cnpj = cnpj.toString().replace(exp, "");
    var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));

    for (i = 0; i < valida.length; i++) {
        dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
        dig2 += cnpj.charAt(i) * valida[i];
    }
    dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
    dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));

    if (((dig1 * 10) + dig2) != digito)
        return false;
    else {
        return true;
    }
}


//valida o CPF digitado
function ValidarCPF(Objcpf) {
    var cpf = replaceAll(Objcpf.val(), ".", "").replace("-", "");
    var soma;
    var resto;
    var i;

    if ((cpf.length != 11) ||
 (cpf == "00000000000") || (cpf == "11111111111") ||
 (cpf == "22222222222") || (cpf == "33333333333") ||
 (cpf == "44444444444") || (cpf == "55555555555") ||
 (cpf == "66666666666") || (cpf == "77777777777") ||
 (cpf == "88888888888") || (cpf == "99999999999")) {
        return false;
    }

    soma = 0;

    for (i = 1; i <= 9; i++) {
        soma += Math.floor(cpf.charAt(i - 1)) * (11 - i);
    }

    resto = 11 - (soma - (Math.floor(soma / 11) * 11));

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }

    if (resto != Math.floor(cpf.charAt(9))) {
        return false;
    }

    soma = 0;

    for (i = 1; i <= 10; i++) {
        soma += cpf.charAt(i - 1) * (12 - i);
    }

    resto = 11 - (soma - (Math.floor(soma / 11) * 11));

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }

    if (resto != Math.floor(cpf.charAt(10))) {
        return false;
    }

    return true;
}

//Valida Inscrição estadual
function ValidarIE(theField) {

    var inscEst = replaceAll(theField.val(), ".", "");
    inscEst = replaceAll(inscEst, "-", "");

    if (inscEst.substr(0, 2) != "28") {
        return false;
    }
    else {
        primDigito = 0;
        pesos = "98765432";
        soma = 0;
        for (i = 0; i < pesos.length; i++) {
            soma = soma + (parseInt(inscEst.substr(i, 1)) * parseInt(pesos.substr(i, 1)));
        }
        primDigito = 11 - (soma % 11);
        if (primDigito > 9)
            primDigito = 0;
        if (parseInt(inscEst.substr(8, 1)) != primDigito) {
            return false;
        } else
            return true;
    }

}

/**********função ValidarCPF_CNPJ_IE***********
*
*  Formata campos de identificação, passando o tipo dos campo e o campo.
*   Tipos:
*   1 = CPF
*   2 = CNPJ
*   3 = IE
*   Autor: Ghibson P. Correa
*   E-mail: gcorrea@fazenda.ms.gov.br
*/

function ValidarCPF_CNPJ_IE(tipo, campo) {
    if (tipo == "0") {
        return ValidarCPF(campo);
    }
    else if (tipo == "1") {
        return ValidarCNPJ(campo);
    } else if (tipo == "2") {
        return ValidarIE(campo);
    } else {
        return;
    }
}

function replaceAll(str, de, para) {
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}