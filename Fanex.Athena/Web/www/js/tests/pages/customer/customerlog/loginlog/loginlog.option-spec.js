define(["pages/customer/customerlog/loginlog/loginlog.option"], function (CommomOption) {
    describe("LoginLogOption", function () {
        describe("getColNames", function () {
            it("should be returned correct value", function () {
                var expectedResult = ['Username', 'CreatedDate', 'LastTxn'];

                var result = CommomOption.getColNames();

                expect(result).toEqual(expectedResult);
            });
        });
    });
});