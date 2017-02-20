function Ajax(URL, method, data, callback) {
	if (typeof(method) !== 'object') {
		var settings = new Object;
		if(!method || method === null || typeof(method) === 'undefined') method = "GET";
		settings.type = method.toUpperCase()
		if(!data || data === null || typeof(data) === 'undefined') data = "";
		settings.data = data;
		if (!callback) {
			settings.async = false;
			} else {
			settings.success = callback;
		settings.fail = callback}
	}
	return $.ajax(URL, settings);
}