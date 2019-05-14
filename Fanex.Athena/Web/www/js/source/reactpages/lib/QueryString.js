export default class QueryString{
    static _parseQueryString(queryString) {
        let args = queryString.split('&');
        let argsList = {};

        for (let i = 0; i < args.length; i++) {
            let arg = unescape(args[i]);
            if (arg.length > 0) {
                if (arg.indexOf('=') === -1) {
                    argsList[arg.toLowerCase().trim()] = null;
                } else {
                    let keyValuePair = arg.split('=');
                    argsList[keyValuePair[0].toLowerCase().trim()] = keyValuePair[1].trim();
                }
            }
        }

        return argsList;
    }

    static _getQueryString (url) {
        var index = url.indexOf("?");
        return index < 0 ? "" : url.substring(index + 1, url.length);
    }

    static _getRawUrl (url) {
        var index = url.indexOf("?");
        return index < 0 ? url : url.substring(0, index);
    }

    static setParam(url, name, value) {
        var rawUrl = QueryString._getRawUrl(url);
        var queryString = QueryString._getQueryString(url);
        var args = QueryString._parseQueryString(queryString);

        if (!name) {
            return url;
        }

        // Update value
        var found = false;
        
        for (var key in args) {
            if (key && key.toLowerCase() === name.toLowerCase()) {
               
                // Does not update data if value = undefined
                if (value !== undefined) {
                    args[key] = value;
                }
                found = true;
            }
        }

        if (!found) {
            args[name.toLowerCase()] = value;
        }

        var queryArray = [];

        // Rebuild query string, ignore null value
        for (var key1 in args) {
            if (args[key1] != null && args[key1] !== undefined) {
                queryArray.push(key1.toLowerCase() + "=" + args[key1]);
            }
        }

        return rawUrl + "?" + queryArray.join("&");
    }

    static setParams(url, parameters) {
        for (var property in parameters) {
            if (parameters.hasOwnProperty(property)) {
                url = QueryString.setParam(url, property, parameters[property]);
            }
        }

        return url;
    }

    static getParam(url, name) {
        var queryString = QueryString._getQueryString(url);
        var args = QueryString._parseQueryString(queryString);

        for (var key in args) {
            if (key != null && key.toLowerCase() === name.toLowerCase()) {
                return args[key];
            }
        }

        return null;
    }
}