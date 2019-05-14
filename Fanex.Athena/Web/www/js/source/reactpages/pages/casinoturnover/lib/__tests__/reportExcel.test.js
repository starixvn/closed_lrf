import Excel from '@jsroot/lib/excel';
import LangHelper from '@jsroot/lib/langHelper';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../../constants/excelStyle';
import ReportExcel from '../ReportExcel';


const title = "Report Title";
const fileName = "CasinoTurnoverReport";

const COLUMN_COUNT = 9;
const TITLE_ROW_INDEX = 0;
const MAIN_SECTION_STYLE = "mainSectionStyle";

function createGridData(){
    return {
        Data: [
            { BetCount: 10, CustomerWL: 100, Date: "2019-01-01T00:00:00", ExternalId: "Ext1", Index: 1, Product: "P1", RowSpan: 2, SystemId: "Sys1", Turnover: 10, ValidBetAmount: 1 },
            { BetCount: 20, CustomerWL: -200, Date: "2019-01-02T00:00:00", ExternalId: "Ext2", Index: 0, Product: "P2", RowSpan: 0, SystemId: "Sys2", Turnover: 20, ValidBetAmount: 2 },
            { BetCount: 30, CustomerWL: -300, Date: "2019-01-03T00:00:00", ExternalId: "Ext3", Index: 2, Product: "P3", RowSpan: 1, SystemId: "Sys3", Turnover: 30, ValidBetAmount: 3 }
        ],
        Total: { BetCount: 60, CustomerWL: -400, Date: "0001-01-01T00:00:00", ExternalId: null, Index: 0, Product: null, RowSpan: 0, SystemId: null, Turnover: 60, ValidBetAmount: 6 }
    };
}

describe('ReportExcel ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Excel.export = jest.fn();
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('export', () => {
        it('no data - do nothing', () => {
            const reportExcel = new ReportExcel();
            reportExcel._createTitle = jest.fn();

            reportExcel.export();

            expect(reportExcel._createTitle).not.toHaveBeenCalled();
        });

        it('get data - _Create* functions and Excel.export should be called with correct parameter', () => {
            const expectedWorksheet = {};
            const reportExcel = new ReportExcel(createGridData(), title);
           
            reportExcel._createTitle = jest.fn();
            reportExcel._createHeader = jest.fn();
            reportExcel._createSheetData = jest.fn();
            reportExcel._createExcelConfig = jest.fn();

            reportExcel.export(() => {
                expect(reportExcel._createTitle).toHaveBeenCalled();
                expect(reportExcel._createHeader).toHaveBeenCalled();
                expect(reportExcel._createSheetData).toHaveBeenCalled();
                expect(reportExcel._createExcelConfig).toHaveBeenCalled();
                expect(Excel.export).toHaveBeenCalledWith(expectedWorksheet, fileName);
            });
        })
    });

    describe('_createTitle', () => {
        it('mergeConfig should has correct value', () => {
            const mergeConfig = [{ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: COLUMN_COUNT - 1 } }];

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createTitle();

            expect(reportExcel.mergeConfig).toEqual(mergeConfig);
        });

        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A1: { t: "s", v: title, s: titleCellStyle }
            };

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createTitle();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        });
    })

    describe('_createHeader', () => {
        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A2: { t: "s", v: "#", s: headerCellStyle },
                B2: { t: "s", v: "Date", s: headerCellStyle },
                C2: { t: "s", v: "SystemId", s: headerCellStyle },
                D2: { t: "s", v: "ExternalId", s: headerCellStyle },
                E2: { t: "s", v: "Product", s: headerCellStyle },
                F2: { t: "s", v: "TotalTransaction", s: headerCellStyle },
                G2: { t: "s", v: "Turnover", s: headerCellStyle },
                H2: { t: "s", v: "ValidBetAmount", s: headerCellStyle },
                I2: { t: "s", v: "CustomerW_L", s: headerCellStyle }
            };

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createHeader();
            const result = reportExcel.worksheet;
            expect(result).toEqual(expectedWorksheet);
        });
    });

    describe('_createSheetData', () => {
        it('currentRowIndex should has correct value', () => {
            const expectedCurrentRowIndex = 5;
            const reportExcel = new ReportExcel(createGridData(), title);

            reportExcel._createSheetData();
            const result = reportExcel.currentRowIndex;

            expect(result).toEqual(expectedCurrentRowIndex);
        });
    });

    describe('_createMainData', () => {
        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A3: { t: "s", v: 1, s: bodyCellStyle.center },
                A4: { t: "s", v: 0, s: bodyCellStyle.center },
                A5: { t: "s", v: 2, s: bodyCellStyle.center },

                B3: { t: "s", v: "01/01/2019", s: bodyCellStyle.center },
                B4: { t: "s", v: "01/02/2019", s: bodyCellStyle.center },
                B5: { t: "s", v: "01/03/2019", s: bodyCellStyle.center },
                
                C3: { t: "s", v: "Sys1", s: bodyCellStyle.rowspan },
                C4: { t: "s", v: "Sys2", s: bodyCellStyle.rowspan },
                C5: { t: "s", v: "Sys3", s: bodyCellStyle.rowspan },

                D3: { t: "s", v: "Ext1", s: bodyCellStyle.rowspan },
                D4: { t: "s", v: "Ext2", s: bodyCellStyle.rowspan },
                D5: { t: "s", v: "Ext3", s: bodyCellStyle.rowspan },

                E3: { t: "s", v: "P1", s: bodyCellStyle.rowspan },
                E4: { t: "s", v: "P2", s: bodyCellStyle.rowspan },
                E5: { t: "s", v: "P3", s: bodyCellStyle.rowspan },

                F3: { t: "n", v: 10, s: bodyCellStyle.number },
                F4: { t: "n", v: 20, s: bodyCellStyle.number },
                F5: { t: "n", v: 30, s: bodyCellStyle.number },

                G3: { t: "n", v: 10, s: bodyCellStyle.decimal },
                G4: { t: "n", v: 20, s: bodyCellStyle.decimal },
                G5: { t: "n", v: 30, s: bodyCellStyle.decimal },

                H3: { t: "n", v: 1, s: bodyCellStyle.decimal },
                H4: { t: "n", v: 2, s: bodyCellStyle.decimal },
                H5: { t: "n", v: 3, s: bodyCellStyle.decimal },

                I3: { t: "n", v: 100, s: bodyCellStyle.decimal },           
                I4: { t: "n", v: -200, s: bodyCellStyle.decimal },            
                I5: { t: "n", v: -300, s: bodyCellStyle.decimal }
            };

            const reportExcel = new ReportExcel(createGridData(), title);

            reportExcel._createMainData();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        });

        it('mergeConfig should has correct value', () => {
            const baseCurrency = 'EUR';
            const expected = [
                { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
                { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
                { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
                { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } }
            ];

            const reportExcel = new ReportExcel(createGridData(), title, baseCurrency);

            reportExcel._createMainData();
            const result = reportExcel.mergeConfig;

            expect(result).toEqual(expected);
        });
    });

    describe('_createMainData', () => {
        it('worksheet should has correct value', () => {
            const baseCurrency = 'EUR';
            const expectedWorksheet = {
                A3: { t: "s", v: 'Totalin EUR', s: grandTotalCellStyle.center },
                F3: { t: "n", v: 60, s: grandTotalCellStyle.number },
                G3: { t: "n", v: 60, s: grandTotalCellStyle.decimal },
                H3: { t: "n", v: 6, s: grandTotalCellStyle.decimal },
                I3: { t: "n", v: -400, s: grandTotalCellStyle.decimal }
            };

            const reportExcel = new ReportExcel(createGridData(), title, baseCurrency);

            reportExcel._createFooterData();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        });

        it('mergeConfig should has correct value', () => {
            const baseCurrency = 'EUR';
            const expected = [{ s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }];

            const reportExcel = new ReportExcel(createGridData(), title, baseCurrency);

            reportExcel._createFooterData();
            const result = reportExcel.mergeConfig;

            expect(result).toEqual(expected);
        });
    });

    describe('_createExcelConfig', () => {
        it('worksheet should has correct value', () => {
            const mergeConfig = ["merge config"];
            const wscols =[{ wpx: 50 }, { wpx: 100 }, 
            { wpx: 120 }, { wpx: 120 }, { wpx: 180 }, { wpx: 120 }, { wpx: 150 }, 
            { wpx: 150 }, { wpx: 150 }];

            const expectedWorksheet = {
                "!merges": mergeConfig,
                "!ref": "A1:I6",
                "!cols": wscols
            };

            const reportExcel = new ReportExcel(undefined, title, "EUR");
            reportExcel.currentRowIndex = 5;
            reportExcel.mergeConfig = mergeConfig;
            reportExcel._createExcelConfig();

            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        });
    });

    describe('_createRowByColumnIndex', () => {
        it('return correct work sheet', () => {
            const type = "s", value = 1, style = "s1";
            const expected = { "A1": { t: type, v: value, s: style } };

            const reportExcel = new ReportExcel(undefined, title);
            reportExcel._getCellObject = jest.fn(() => { return { type: type, value: value, style: style, cellAddress: "A1" }; });

            reportExcel._createRowByColumnIndex({}, {}, 1, 1);

            expect(reportExcel.worksheet).toEqual(expected);
        });
    });

    describe("_getCellObject", () => {
        it("columnIndex = SystemId  - cell style should be correct", () => {
            const reportExcel = new ReportExcel({}, title);
            const columnIndex = 2;
            const item = { SystemId: "Sys1" };

            const expected = { cellAddress: "A1", type: "s", value: item.SystemId, style: bodyCellStyle.rowspan };

            Excel.getCellAddress = jest.fn(() => expected.cellAddress);
            Excel.getCellType = jest.fn(() => expected.type);

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, columnIndex);

            expect(cell).toEqual(expected);
        })

        it("value of item is null - cell value should be empty string", () => {
            const reportExcel = new ReportExcel({}, title);
            const columnIndex = 2;
            const item = { SystemId: null };

            const expected = { cellAddress: "A1", type: "s", value: "", style: bodyCellStyle.rowspan };

            Excel.getCellAddress = jest.fn(() => expected.cellAddress);
            Excel.getCellType = jest.fn(() => expected.type);

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, columnIndex);

            expect(cell).toEqual(expected);
        })
    })
})