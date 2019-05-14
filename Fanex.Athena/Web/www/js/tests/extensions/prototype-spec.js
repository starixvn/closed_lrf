define(['extensions/prototype'], function () {
    describe("String.prototype.format()", function () {
        it("return a formatted string by replacing all placeholders", function () {
            var text = "{0} + {1} = {2}";
            var result = text.format(1, 2, 3);
            expect(result).toBe("1 + 2 = 3");
        });

        it("ignore redundant parameters", function () {
            var text = "{0} + {1}";
            var result = text.format(1, 2, 3);
            expect(result).toBe("1 + 2");
        });

        it("ignore missing parameters", function () {
            var text = "{0} + {1}";
            var result = text.format(1);
            expect(result).toBe("1 + {1}");
        });
    });

    describe("String.prototype.trim()", function () {
        it("remove spaces at the beginning and the end of a string", function () {
            var result = "   a b  ".trim();
            expect(result).toBe("a b");
        });
    });

    describe("String.prototype.ltrim()", function () {
        it("remove spaces at the beginning of a string", function () {
            var result = "   a b  ".ltrim();
            expect(result).toBe("a b  ");
        });
    });

    describe("String.prototype.rtrim()", function () {
        it("remove spaces at the end of a string", function () {
            var result = "   a b  ".rtrim();
            expect(result).toBe("   a b");
        });
    });

    describe("String.prototype.replaceAll(token, newToken, ignoreCase)", function () {
        it("replace all matched texts", function () {
            var result = "ABCABC".replaceAll("AB", "D");
            expect(result).toBe("DCDC");
        });

        it("be case-sensitive if the param 'ignoreCase' is falsy", function () {
            var result = "ABCABC".replaceAll("ab", "D");
            expect(result).toBe("ABCABC");
        });

        it("be case-insensitive if the param 'ignoreCase' is truthy", function () {
            var result = "ABCABC".replaceAll("ab", "D", 1);
            expect(result).toBe("DCDC");
        });

        it("return the original string if the param 'token' is not a string", function () {
            var result = "ABCABC".replaceAll(0, "D", 1);
            expect(result).toBe("ABCABC");
        });
    });

    describe("Array.prototype.remove(value, fieldName)", function () {
        it("remove correct value", function () {
            var array = [1, 2, 3];
            array.remove(2);
            expect(array).toEqual([1, 3]);
        });

        it("remove only the first matched value", function () {
            var array = [2, 1, 2, 3];
            array.remove(2);
            expect(array).toEqual([1, 2, 3]);
        });

        it("remove correct object by specifying a property value", function () {
            var array = [{ name: "A" }, { name: "B" }, { name: "C" }];
            array.remove("B", "name");
            expect(array).toEqual([{ name: "A" }, { name: "C" }]);
        });
    });

    describe("Array.prototype.insertAfter(value, after)", function () {
        it("insert an item after an index", function () {
            var array = ["a", "b", "c"];
            array.insertAfter("HI", 1);
            expect(array).toEqual(["a", "b", "HI", "c"]);
        });
    });

    describe("Array.prototype.insertBefore(value, before)", function () {
        it("insert an item before an index", function () {
            var array = ["a", "b", "c"];
            array.insertBefore("HI", 1);
            expect(array).toEqual(["a", "HI", "b", "c"]);
        });
    });
});