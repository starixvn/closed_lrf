define(["pages/customer/customerlog/common.option"], function (CommomOption) {
    describe("CommomOption", function () {
        describe("getColNames", function () {
            it("should be returned correct value", function () {
                var expectedResult = ['LogID', 'LogDate', 'Editedby', 'Action', 'Details'];

                var result = CommomOption.getColNames();

                expect(result).toEqual(expectedResult);
            });
        });
    });
});