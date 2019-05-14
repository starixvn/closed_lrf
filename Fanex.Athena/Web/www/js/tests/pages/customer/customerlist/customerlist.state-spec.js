define(["pages/customer/customerlist/customerlist.state"], function (CustomerListState) {
    describe("CustomerListState", function () {
        describe("getState()", function () {
            var state = null;

            it("state should be initialized if state is not existing", function () {
                state = CustomerListState.getState();

                expect(state).not.toBeNull();
            });

            it("state should be initialized if state is not existing", function () {
                state.checkedAllRows = true;

                var newState = CustomerListState.getState();

                expect(newState).toBe(state);
            });
        });
    });
});