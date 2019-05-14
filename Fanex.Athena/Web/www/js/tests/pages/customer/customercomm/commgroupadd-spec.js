define(["jquery", "pages/customer/customercomm/commgroupdetail", "pages/customer/customercomm/commgroupadd"],
    function ($, CustomerCommGroupDetail, CustomerCommGroupAdd) {
        describe("CustomerCommGroupAdd", function () {
            describe("initialize()", function () {
                it("CommGroupDetail.initialize should be called with correct param", function () {
                    spyOn(CustomerCommGroupDetail, "initialize");
                    spyOn(CustomerCommGroupAdd, "initEvent");

                    CustomerCommGroupAdd.initialize();

                    expect(CustomerCommGroupDetail.initialize).toHaveBeenCalledWith("CreateNewGroup");
                    expect(CustomerCommGroupAdd.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("CommGroupDetail.checkAvailableGroup should be called when Validate button is clicked", function () {
                    setFixtures('<form id="customer-comm-group-add"></form>');
                    $("form").append('<input type="text" id="GroupName" value="Group Name">');
                    $("form").append('<input type="button" id="Validate">');
                    spyOn(CustomerCommGroupDetail, "checkAvailableGroup");

                    CustomerCommGroupAdd.initEvent();
                    $("#Validate").click();

                    expect(CustomerCommGroupDetail.checkAvailableGroup).toHaveBeenCalledWith("Group Name");
                });

                it("CommGroupDetail.submit should be called when Submit button is clicked with correct param", function () {
                    setFixtures('<form id="customer-comm-group-add"></form>');
                    $("form").append('<input type="button" id="Submit">');
                    spyOn(CustomerCommGroupDetail, "submit");

                    CustomerCommGroupAdd.initEvent();
                    $("#Submit").click();

                    expect(CustomerCommGroupDetail.submit).toHaveBeenCalledWith("#customer-comm-group-add");
                });
            });
        });
    });