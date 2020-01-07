function Split(str, del) {
    return str.split(del);
}

function NewId(){
	var dc = new Date();
	var id = new String(dc.getTime());
	id += new String(getRandomInt(0,100));
	return id;
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
	
function NewDate(){
	return new Date();
}

function Left(str, n) {
    var s = str + '';
    var iLen = s.length;
    if (n <= 0) {
        return "";
	} else if (n >= iLen) {
        return str;
	} else {
        return s.substr(0, n);
	}
}


function Mid(strMid, intBeg, intEnd) {
    if (strMid === null || strMid === '' || intBeg < 0) {
        return '';
    }
    intBeg -= 1; 
	if (intEnd === null || intEnd === '') {
        return strMid.substr(intBeg);
    } else {
        return strMid.substr(intBeg, intEnd);
    }
}


function InStrRev(srchStr, fndStr, start, cmp) {
    if (!fndStr || fndStr === null) {
        fndStr = "";
    }
    if (!cmp) {
        cmp = 0;
    }
    srchStr.toString();
    if (cmp == 1) {
        srchStr = srchStr.toLowerCase();
        fndStr = fndStr.toLowerCase();
    }
    if (!start || !IsNumeric(start)) {
        start = -1;
    }
    if (start > -1) {
        srchStr = srchStr.substr(0, start);
    }
    var loc;
    if (fndStr === "") {
        loc = srchStr.length;
    } else {
        loc = srchStr.lastIndexOf(fndStr) + 1;
    }
    return loc;
}

function Len(str) {
	str += '';
    return str.length;
}

function Chr(num){
	var res = String.fromCharCode(num); 
	return res;
}

function FM() {
	return Chr(254);
}

function VM(){
	return chr(253);
}
	
function InQuotes(value){
	var res = Chr(34) + value + Chr(34)
	return res;
}

function Form2Json(form){
	// convert form name value attributes to json
	var array = $(form).serializeArray();
	var json = {};
	$.each(array, function() {
		if(typeof json[this.name] == 'undefined') {
			json[this.name] = this.value || '';
		} else {
			json[this.name] += "," + this.value ;
		}
	});
	return json;
}