define(["jquery", "common/querystring", "common/site", "lib/jqgrid/jquery.jqgrid.additional", "pages/report/turnover/turnover.option"],
	function ($, QueryString, Site, jqGridAdditional, TurnoverOption) {
	    describe("TurnoverOption", function () {
	        it("Default options should be correct", function () {
	            var defaultOption = {
	                licenseeId: 0,
	                hasCustomerComm: true,
	                totalColspan: [3],
	                urlData: 'reportapi/Turnover',
	                urlExcelData: 'TurnoverReport/Excel'
	            };

	            expect(TurnoverOption.licenseeId).toBe(defaultOption.licenseeId);
	            expect(TurnoverOption.hasCustomerComm).toBe(defaultOption.hasCustomerComm);
	            expect(TurnoverOption.totalColspan).toEqual(defaultOption.totalColspan);
	            expect(TurnoverOption.urlData).toBe(defaultOption.urlData);
	            expect(TurnoverOption.urlExcelData).toBe(defaultOption.urlExcelData);
	        });

	        it("default value of grid option should be correct", function () {
	            var defaultGridOption = {
	                rowNum: 1000,
	                datatype: 'local',
	                colNames: [],
	                colModel: [],
	                data: [],
	                height: 'auto',
	                viewrecords: true,
	                autowidth: false,
	                forceFit: false,
	                shrinkToFit: true,
	                minWidth: 800,
	                loadtext: '',
	                loadui: 'disable',
	                loadonce: true,
	                gridview: true,
	                footerrow: true,
	                userDataOnFooter: true,
	                cmTemplate: { title: true }, //enable tooltip
	                userData: []
	            };

	            expect(TurnoverOption.gridOption).toEqual(defaultGridOption);
	        });
	    });

	    describe("getColName()", function () {
	        it("colNames should return correctly", function () {
	            spyOn(Site, "getResources").and.callFake(function (resource) { return resource; });
	            var expected = ['#', 'Day', "OpeningBalance", "Deposit", 'Withdrawal', 'Bonus', 'Adjustment',
				'Turnover', 'DrawGame', 'NetTurnover', 'PendingFunds', 'WinLoss', 'Comm', 'Total', 'ClosingBalance',
				 'AffiliateTransfer', 'CasinoTransfer', 'Turnover', 'Comm', 'AmountDueTo'];

	            var result = TurnoverOption.getColName();

	            expect(result).toEqual(expected);
	        });
	    });

	    describe("getColModel()", function () {
	        it("colModel should return correctly", function () {
	            TurnoverOption.hasCasinoTransfer = false;
	            TurnoverOption.isAllowBa = true;

	            var result = TurnoverOption.getColModel();

	            expect(result.length).toBe(20);
	            expect(result[12].hidden).toBe(false); //playerCommColumn
	            expect(result[13].hidden).toBe(false); //winlossCommColumn
	            expect(result[16].hidden).toBe(true); //transfer3rdColumn
	            expect(result[17].hidden).toBe(false); //turnoverBAColumn
	            expect(result[18].hidden).toBe(false); //commBAColumn
	            expect(result[19].hidden).toBe(false); //amountDueToBAColumn
	        });
	    });

	    describe("getGridOption()", function () {
	        beforeEach(function () {
	            spyOn(TurnoverOption, "getColName").and.returnValue(["#", "Day"]);
	            spyOn(TurnoverOption, "getColModel").and.returnValue([{ name: "index" }, { name: "day" }]);
	        });
	        it("colName should return correct value", function () {
	            var result = TurnoverOption.getGridOption();

	            expect(result.colNames).toEqual(["#", "Day"]);
	        });
	        it("colModel should return correct value", function () {
	            var result = TurnoverOption.getGridOption();

	            expect(result.colModel).toEqual([{ name: "index" }, { name: "day" }]);
	        });
	    });

	    describe("getTotalColModel()", function () {
	        it("totalColmodel should be correct value", function () {
	            spyOn(TurnoverOption, "getColModel").and.returnValue([{ name: "index" }, { name: "day" }]);

	            var result = TurnoverOption.getTotalColModel();

	            expect(result).toEqual([{ name: "index" }, { name: "day" }]);
	        });
	    });
	});