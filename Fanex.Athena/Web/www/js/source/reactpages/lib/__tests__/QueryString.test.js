import QueryString from '../QueryString'

describe("QueryString", function () {
    describe("_parseQueryString(queryString)", function () {
        it("return correct object from a query string", function () {
            var result = QueryString._parseQueryString("a=1&b=2");
            expect(result).toEqual({"a": "1", "b": "2"});
        });

        it("has an invalid param in query string => return correct object from a query string", function () {
            var result = QueryString._parseQueryString("a=1&b2");
            expect(result).toEqual({"a": "1", "b2": null});
        });
    });

    describe("_getQueryString(url)", function () {
        it("return the query string part from an url", function () {
            var result = QueryString._getQueryString("localhost?a=1");
            expect(result).toBe("a=1");
        });

        it("return empty string if the url does not contain '?' character", function () {
            var result = QueryString._getQueryString("localhosta=1");
            expect(result).toBe("");
        });

        it("throw exception if the url param is not passed", function () {
            expect(function () { QueryString._getQueryString(); }).toThrow();
        });

        it("throw exception if the url param is not a string", function () {
            expect(function () { QueryString._getQueryString(1); }).toThrow();
        });
    });

    describe("getRawUrl(url)", function () {
        it("return the raw url from an url", function () {
            var result = QueryString._getRawUrl("http://localhost?a=1");
            expect(result).toBe("http://localhost");
        });

        it("return the url param if it does not contain '?' character", function () {
            var result = QueryString._getRawUrl("test+string");
            expect(result).toBe("test+string");
        });
    });

    describe("setParam(url, name, value)", function () {
        it("name param is invalid => return url param", function () {
            var result = QueryString.setParam("http://localhost?a=1", null, "xxx");
            expect(result).toBe("http://localhost?a=1");
        });

        it("add new value to a query string if it does not exist", function () {
            var result = QueryString.setParam("http://localhost", "a", 2);
            expect(result).toBe("http://localhost?a=2");
        });

        it("update value in a query string if it exists", function () {
            var result = QueryString.setParam("http://localhost?a=1", "a", 2);
            expect(result).toBe("http://localhost?a=2");
        });

        it("remove null value", function () {
            var result = QueryString.setParam("http://localhost?a=1", "a", null);
            expect(result).toBe("http://localhost?");
        });
    });

    describe("setParams(url, parameters)", function () {
        it("return correct url with params", function () {
            var param = {
                "b": 2,
                "c": 3,
                "d": "xx"
            };
            var result = QueryString.setParams("http://localhost?a=1", param);
            expect(result).toBe("http://localhost?a=1&b=2&c=3&d=xx");
        });
    });

    describe("getParam(url, name)", function () {
        it("return a correct value if it exists", function () {
            var result = QueryString.getParam("http://localhost?a=1", "a");
            expect(result).toBe("1");
        });

        it("return a null if it does not exist", function () {
            var result = QueryString.getParam("http://localhost", "a");
            expect(result).toBe(null);
        });
    });
});