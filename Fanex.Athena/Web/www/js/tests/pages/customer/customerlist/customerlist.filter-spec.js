define(["jquery",
    "common/site",
    "pages/customer/customerlist/customerlist.state",
    "pages/customer/customerlist/customerlist.service",
    "pages/customer/customerlist/customerlist.service.dormant",
    "components/pluginhelper/autocomplete",
    "pages/customer/customerlist/customerlist.filter", ],
    function ($, Site, CustomerListState, CustomerListService, CustomerListServiceDormant, AutoComplete, CustomerListFilter) {
        describe("CustomerListFilter", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "addUserGuide");
                spyOn(AutoComplete, "initialize");
            });

            describe("initialize", function () {
                it("initializes components for the page", function () {
                    spyOn(CustomerListFilter, "initEvent");
                    spyOn(CustomerListState, "getState");
                    spyOn(CustomerListState, "getDormantState");

                    CustomerListFilter.initialize();

                    expect(CustomerListState.getState).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(AutoComplete.initialize).toHaveBeenCalled();
                    expect(CustomerListFilter.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeAll(function () {
                    spyOn(CustomerListFilter, "initGridColumnOption");
                    spyOn(CustomerListFilter, "initOddGroupOption");
                    spyOn(CustomerListService, "submit");
                    spyOn(CustomerListServiceDormant, "submit");
                    spyOn(CustomerListState, "getState").and.returnValue({ pagingOption: { pageindex: 1 } });
                    spyOn(CustomerListState, "getDormantState").and.returnValue({ pagingOption: { pageindex: 1 } });;
                });

                it("initializes Grid column option and Odd group option", function () {
                    CustomerListFilter.initEvent();

                    expect(CustomerListFilter.initGridColumnOption).toHaveBeenCalled();
                    expect(CustomerListFilter.initOddGroupOption).toHaveBeenCalled();
                });

                it("CustomerListService.submit() should be called if SubmitButton is clicked", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    
                    CustomerListFilter.initialize();
                    CustomerListFilter.initEvent();
                    $("#SubmitButton").click();

                    expect(CustomerListService.submit).toHaveBeenCalled();
                });

                it("CustomerListService.submit() should be called if #Username raises keyup event with Enter", function () {
                    setFixtures('<input id="Username" type="text"></input>');

                    CustomerListFilter.initialize();
                    CustomerListFilter.initEvent();
                    var event = jQuery.Event("keyup", { keyCode: 13 });
                    $("#Username").trigger(event);

                    expect(CustomerListService.submit).toHaveBeenCalled();
                });
            });

            describe("initGridColumnOption()", function () {
                var selectOption;
                var multiSelect;

                beforeAll(function () {
                    multiSelect = spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        selectOption = option;
                    });
                });

                it("initializes grid column multiselect without checking all columns", function () {
                    setFixtures('<input id="AllowedGridColumns"'
                        + 'value="[{&quot;Name&quot;:&quot;Col1&quot;,&quot;ID&quot;:0,&quot;Checked&quot;:true}'
                        + ',{&quot;Name&quot;:&quot;Col2&quot;,&quot;ID&quot;:0,&quot;Checked&quot;:false}]">');

                    CustomerListFilter.initGridColumnOption();

                    expect(selectOption.isCheckAll).toBe(false);
                });

                it("disables SubmitButton if no column is choosen", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    multiSelect.and.returnValue([]);

                    selectOption.onCheck();

                    expect($("#SubmitButton").is(":disabled")).toBe(true);
                });

                it("enables SubmitButton if a column is choosen", function () {
                    setFixtures('<button id="SubmitButton" disabled></button>');
                    multiSelect.and.returnValue(["Col1"]);

                    selectOption.onCheck();

                    expect($("#SubmitButton").is(":disabled")).toBe(false);
                });
            });

            describe("initOddGroupOption()", function () {
                var selectOption;
                var multiSelect;

                beforeAll(function () {
                    multiSelect = spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        selectOption = option;
                    });
                });

                it("does not initialize odd group multiselect if #OddsGroups is not provided", function () {
                    CustomerListFilter.initOddGroupOption();

                    expect($.fn.multiSelect).not.toHaveBeenCalled();
                });

                it("initializes odd group multiselect without checking all columns", function () {
                    setFixtures('<input id="OddsGroups"'
                        + 'value="[{&quot;Name&quot;:&quot;Col1&quot;,&quot;ID&quot;:0,&quot;Checked&quot;:true}'
                        + ',{&quot;Name&quot;:&quot;Col2&quot;,&quot;ID&quot;:0,&quot;Checked&quot;:false}]">');

                    CustomerListFilter.initOddGroupOption();

                    expect(selectOption.isCheckAll).toBe(false);
                });

                it("disables SubmitButton if no column is choosen", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    multiSelect.and.returnValue([]);

                    selectOption.onCheck();

                    expect($("#SubmitButton").is(":disabled")).toBe(true);
                });

                it("enables SubmitButton if a column is choosen", function () {
                    setFixtures('<button id="SubmitButton" disabled></button>');
                    multiSelect.and.returnValue(["Col1"]);

                    selectOption.onCheck();

                    expect($("#SubmitButton").is(":disabled")).toBe(false);
                });
            });
        });
    });