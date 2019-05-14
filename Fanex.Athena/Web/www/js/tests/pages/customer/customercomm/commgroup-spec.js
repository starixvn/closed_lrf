define(["jquery", "common/site", "pages/customer/customercomm/commgroup"],
    function ($, Site, CustomerCommGroup) {
        describe("CustomerCommGroup", function () {
            describe("setPageTitle(title)", function () {
                it("changes page title with correct param", function () {
                    var expectedTitle = "title";
                    spyOn($.fn, "text");
                    spyOn(Site, "getSingleResource").and.callFake(function (str) {
                        return str;
                    });

                    CustomerCommGroup.setPageTitle(expectedTitle);

                    expect($("#page-title", window.parent.document).text).toHaveBeenCalledWith(expectedTitle);
                });

                it("does not change page title if parent host is the same with current host", function () {
                    var expectedTitle = "title";
                    window.parent = {
                        location: {
                            host: "parent"
                        }
                    };

                    spyOn($.fn, "text");
                    spyOn(Site, "getSingleResource").and.callFake(function (str) {
                        return str;
                    });

                    CustomerCommGroup.setPageTitle(expectedTitle);

                    expect($("#page-title", window.parent.document).text).not.toHaveBeenCalledWith(expectedTitle);
                });
            });

            describe("goToCustomerList(groupCommId)", function () {
                beforeAll(function () {
                    spyOn(Site, "getSingleResource").and.callFake(function (str) {
                        return str;
                    });

                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                        return url;
                    });
                });

                it("setPageTitle should be called if parent host is the same with current host", function () {
                    setFixtures('<ul></ul>');
                    $("ul").append('<li><a id="MenuItem55"></a></li>');
                    $("ul").append('<li><a id="MenuItem43"></a></li>');
                    window.parent.document = "ul";
                    spyOn(CustomerCommGroup, "setPageTitle");
                    spyOn(Site, "redirect");
                    window.parent = {
                        location: {
                            host: window.location.host
                        }
                    };

                    CustomerCommGroup.goToCustomerList(1);

                    expect(CustomerCommGroup.setPageTitle).toHaveBeenCalledWith("CustomerList");
                    expect(Site.redirect).toHaveBeenCalledWith("Customer/CustomerList?groupId=1");
                });

                it("setPageTitle should not be called if parent host is not the same with current host", function () {
                    spyOn(CustomerCommGroup, "setPageTitle");
                    spyOn(Site, "redirect");
                    window.parent = {
                        location: {
                            host: "parent"
                        }
                    };

                    CustomerCommGroup.goToCustomerList(1);

                    expect(CustomerCommGroup.setPageTitle).not.toHaveBeenCalledWith("CustomerList");
                    expect(Site.redirect).toHaveBeenCalledWith("Customer/CustomerList?groupId=1");
                });
            });
        });
    });