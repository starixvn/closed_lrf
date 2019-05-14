define(['jquery', 'common/site', 'pages/betlist/betlist.option'], function ($, Site, BetListOption) {
	describe("BetListOption", function () {
		describe("gridOption", function () {
			it("gridOption.rowNum should be 50", function () {
				expect(BetListOption.gridOption.rowNum).toBe(50);
			});

			it("gridOption.rowList should be a correct array", function () {
				expect(JSON.stringify(BetListOption.gridOption.rowList)).toBe(JSON.stringify([50, 100, 200, 300, 400, 500, 1000, 2000]));
			});

			it("gridOption.beforeSelectRow should return false", function () {
			    expect(BetListOption.gridOption.beforeSelectRow()).toBe(false);
			});

			it("gridOption.onRightClickRow should return false", function () {
			    expect(BetListOption.gridOption.onRightClickRow()).toBe(false);
			});

			describe("gridOption.onPaging", function () {
			    beforeEach(function () {
			        spyOn(Site, "blockUI");
			    });

			    it("Site.blockUI should not be called if pgButton has class 'ui-state-disabled'", function () {
			        setFixtures('<div id="pgButton" class="ui-state-disabled"></div>');

			        BetListOption.gridOption.onPaging("pgButton");

			        expect(Site.blockUI).not.toHaveBeenCalled();
			    });

			    it("Site.blockUI should be called if pgButton does not have class 'ui-state-disabled'", function () {
			        setFixtures('<div id="pgButton"></div>');

			        BetListOption.gridOption.onPaging("pgButton");

			        expect(Site.blockUI).toHaveBeenCalled();
			    });
			});
		});

		describe("columnModel", function () {
			it("columnModel.length should be 11", function () {
				expect(BetListOption.columnModel.length).toBe(11);
			});

			it("first column name should be 'Index'", function () {
				expect(BetListOption.columnModel[0].name).toBe('Index');
			});

			it("last column name should be 'Status'", function () {
				expect(BetListOption.columnModel[10].name).toBe('Status');
			});
		});

		it("columnNames should be a correct array", function () {
			expect(BetListOption.columnNames).toEqual(['#', 'ExternalId', 'SystemId', 'TransTime', 'Choice', 'Odds', 'Stake',
						'WinLoss', 'EffectiveBettingValue', '@[LicenseeWL]/@[Comm]', 'Status']);
		});

		it("maxHeight should be 720", function () {
			expect(BetListOption.maxHeight).toBe(720);
		});
	});
});