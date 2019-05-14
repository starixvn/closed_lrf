define(["jquery", "pages/customer/customercomm/commgroupdetail", "pages/customer/customercomm/commgroupedit"],
    function ($, CustomerCommGroupDetail, CustomerCommGroupEdit) {
        describe("CustomerCommGroupEdit", function () {
            describe("initialize()", function () {
                it("CommGroupDetail.initialize should be called with correct param", function () {
                    spyOn(CustomerCommGroupDetail, "initialize");
                    spyOn(CustomerCommGroupEdit, "initEvent");

                    CustomerCommGroupEdit.initialize();

                    expect(CustomerCommGroupDetail.initialize).toHaveBeenCalledWith("EditGroup");
                    expect(CustomerCommGroupEdit.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("CommGroupDetail.checkAvailableGroup should be called when Validate button is clicked", function () {
                    setFixtures('<form id="customer-comm-group-add"></form>');
                    $("form").append('<input type="text" id="GroupName" value="Group Name">');
                    $("form").append('<input type="button" id="Validate">');
                    spyOn(CustomerCommGroupDetail, "checkAvailableGroup");
                  
                    CustomerCommGroupEdit.initEvent();
                    $("#Validate").click();

                    expect(CustomerCommGroupDetail.checkAvailableGroup).toHaveBeenCalledWith("Group Name");
                });

                it("CommGroupDetail.checkAvailableGroup should not be called when new group name is the same the original name", function () {
                    setFixtures('<form id="customer-comm-group-add"></form>');
                    $("form").append('<input type="text" id="GroupName" value="Group Name">');
                    $("form").append('<input type="text" id="OriginalGroupName" value="Group Name">');
                    $("form").append('<input type="button" id="Validate">');
                    spyOn(CustomerCommGroupDetail, "initialize");
                    spyOn(CustomerCommGroupDetail, "checkAvailableGroup");

                    CustomerCommGroupEdit.initialize();
                    CustomerCommGroupEdit.initEvent();
                    $("#Validate").click();

                    expect(CustomerCommGroupDetail.checkAvailableGroup).not.toHaveBeenCalledWith("Group Name");
                });

                it("CommGroupDetail.submit should be called when Submit button is clicked with correct param", function () {
                    setFixtures('<form id="customer-comm-group-edit"></form>');
                    $("form").append('<input type="button" id="Submit">');
                    spyOn(CustomerCommGroupDetail, "submit");

                    CustomerCommGroupEdit.initEvent();
                    $("#Submit").click();

                    expect(CustomerCommGroupDetail.submit).toHaveBeenCalledWith("#customer-comm-group-edit");
                });

                it("CommGroupDetail.goToCustomerList should be called when CustList button is clicked with correct param", function () {
                    setFixtures('<form id="customer-comm-group-edit"></form>');
                    $("form").append('<input type="hidden" id="GroupCommId" value="1">');
                    $("form").append('<input type="button" id="CustList">');
                    spyOn(CustomerCommGroupDetail, "goToCustomerList");

                    CustomerCommGroupEdit.initEvent();
                    $("#CustList").click();

                    expect(CustomerCommGroupDetail.goToCustomerList).toHaveBeenCalledWith("1");
                });
            });
        });
    });