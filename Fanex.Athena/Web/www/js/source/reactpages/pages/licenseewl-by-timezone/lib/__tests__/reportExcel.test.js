import Excel from '../../../../lib/excel'
import LangHelper from '../../../../lib/langHelper'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../../constants/excelStyle'
import service from '../../lib/service'
import ReportExcel from '../reportExcel'

import { totalData, bodyData } from './fakeData';

const gridData = { Data: bodyData, Total: totalData };
const title = "Report Title";
const fileName = "WinLossByTimeZone";

const COLUMN_COUNT = 10;
const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

describe('reportExcel ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Excel.export = jest.fn();
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('export', () => {
        it('no data - Do nothing', () => {
            const reportExcel = new ReportExcel(undefined, title);
            reportExcel._createTitle = jest.fn();

            reportExcel.export();

            expect(reportExcel._createTitle).not.toHaveBeenCalled();
        })

        it('get data - _Create* functions and Excel.export should be called with correct parameter', () => {
            const expectedWorksheet = {};
            const reportExcel = new ReportExcel(gridData, title);
           
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
    })

    describe('_createTitle', () => {
        it('mergeConfig should has correct value', () => {
            const mergeConfig = [{ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: COLUMN_COUNT - 1 } }];

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createTitle();

            expect(reportExcel.mergeConfig).toEqual(mergeConfig);
        })

        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A1: { t: "s", v: title, s: titleCellStyle }
            };

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createTitle();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe('_createHeader', () => {
        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A2: { t: "s", v: "#", s: headerCellStyle },
                B2: { t: "s", v: "Month", s: headerCellStyle },
                C2: { t: "s", v: "Currency", s: headerCellStyle },
                D2: { t: "s", v: "BetCount", s: headerCellStyle },
                E2: { t: "s", v: "Turnover", s: headerCellStyle },
                F2: { t: "s", v: "CustomerComm", s: headerCellStyle },
                G2: { t: "s", v: "LicenseeWL", s: headerCellStyle },
                H2: { t: "s", v: "LicenseeComm", s: headerCellStyle },
                I2: { t: "s", v: "LicenseeNetWL", s: headerCellStyle },
                J2: { t: "s", v: "Margin", s: headerCellStyle }
            };

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createHeader();
            const result = reportExcel.worksheet;
            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe('_createMainData', () => {

        it('worksheet should has correct value', () => {
            const expectedWorksheet = {
                A3: { t: "s", v: 1, s: bodyCellStyle.center },
                B3: { t: "s", v: "01/0001", s: bodyCellStyle.center },
                C3: { t: "s", v: "Sportsbook", s: bodyCellStyle.center },
                D3: { t: "n", v: 10, s: bodyCellStyle.number },
                E3: { t: "n", v: 1234, s: bodyCellStyle.decimal },
                F3: { t: "n", v: 5678, s: bodyCellStyle.decimal },
                G3: { t: "n", v: 23646.17, s: bodyCellStyle.decimal },
                H3: { t: "n", v: 72, s: bodyCellStyle.decimal },
                I3: { t: "n", v: 22758.17, s: bodyCellStyle.decimal },
                J3: { t: "n", v: 0.155, s: bodyCellStyle.percent }
            };

            const reportExcel = new ReportExcel(gridData, title);

            reportExcel._createMainData();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe('_createSheetData', () => {
        it('currentRowIndex should has correct value', () => {
            const expectedCurrentRowIndex = 3;
            const reportExcel = new ReportExcel(gridData, title);

            reportExcel._createSheetData();
            const result = reportExcel.currentRowIndex;

            expect(result).toEqual(expectedCurrentRowIndex);
        })
    })

    describe('_createExcelConfig', () => {
        it('worksheet should has correct value', () => {
            const mergeConfig = ["merge config"];
            const wscols = [{ wpx: 50 }, { wpx: 100, hidden: true },
            { wpx: 200 }, { wpx: 120 }, { wpx: 180 }, { wpx: 120 }, { wpx: 150 },
            { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }];

            const expectedWorksheet = {
                "!merges": mergeConfig,
                "!ref": "A1:J6",
                "!cols": wscols
            };

            const reportExcel = new ReportExcel(undefined, title, 1, 1, "EUR");
            reportExcel.currentRowIndex = 5;
            reportExcel.mergeConfig = mergeConfig;
            reportExcel._createExcelConfig();

            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe("_getCellObject", () => {
        const item = {
            "ReportBy": "2018-01-01T00:00:00",
            "GroupBy": null,
            "BetCount": 10,
            "Turnover": 1234.0,
            "CustomerComm": 5678.0,
            "LicenseeWinLoss": -23646.17,
            "LicenseeComm": 72.0,
            "LicenseeNetWinLoss": 22758.17,
            "Margin": 15.5
        }
        const MAIN_SECTION_STYLE = "mainSectionStyle";

        it("columnIndex = GROUPBY_COLUMN_INDEX and group by product - cell style should be correct", () => {
            const groupByProduct = 1;
            const reportExcel = new ReportExcel(undefined, title, 1, groupByProduct);
            const groupByColumnIndex = 2;

            Excel.getCellAddress = jest.fn(() => {});
            Excel.getCellType = jest.fn(() => "s");

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, groupByColumnIndex);

            expect(cell.style).toEqual(bodyCellStyle.rowspan);
        })

        it("value of item is null - cell value should be empty string", () => {
            const expectedValue = "";
            const groupByProduct = 1;
            const reportExcel = new ReportExcel(undefined, title, 1, groupByProduct);
            const groupByColumnIndex = 2;

            Excel.getCellAddress = jest.fn(() => {});
            Excel.getCellType = jest.fn(() => "s");

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, groupByColumnIndex);

            expect(cell.value).toBe(expectedValue);
        })

        it("columnIndex = LICENSEEWL_COLUMN_INDEX and value is negative number - cell style should be correct", () => {
            const groupByProduct = 1;
            const reportExcel = new ReportExcel(undefined, title, 1, groupByProduct);
            const licenseeWlColumnIndex = 6;

            Excel.getCellAddress = jest.fn(() => {});
            Excel.getCellType = jest.fn(() => "s");

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, licenseeWlColumnIndex);

            expect(cell.style).toEqual(bodyCellStyle.negativeDecimal);
        })

        it("columnIndex = REPORTBY_COLUMN_INDEX and in ReportByDaily mode - cell value should be correct", () => {
            const expectedValue = "01/01/2018";
            const groupByProduct = 1;
            const reportByDaily = 2;
            const reportExcel = new ReportExcel(undefined, title, reportByDaily, groupByProduct);
            const reportByColumnIndex = 1;

            Excel.getCellAddress = jest.fn(() => {});
            Excel.getCellType = jest.fn(() => "s");

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, reportByColumnIndex);

            expect(cell.value).toEqual(expectedValue);
        })

        it("columnIndex = REPORTBY_COLUMN_INDEX and in ReportBySummary mode - cell value should be correct", () => {
            const expectedValue = "01/2018";
            const groupByProduct = 1;
            const reportBySummary = 1;
            const reportExcel = new ReportExcel(undefined, title, reportBySummary, groupByProduct);
            const reportByColumnIndex = 1;

            Excel.getCellAddress = jest.fn(() => {});
            Excel.getCellType = jest.fn(() => "s");

            const cell = reportExcel._getCellObject(item, MAIN_SECTION_STYLE, reportByColumnIndex);

            expect(cell.value).toEqual(expectedValue);
        })
    })
})