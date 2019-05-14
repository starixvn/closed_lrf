import Excel from '../../../../lib/excel'
import LangHelper from '../../../../lib/langHelper'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../../constants/excelStyle'
import ReportExcel from '../reportExcel'

import { totalData, bodyData, grandTotalData, bodyDetailData, totalDetailData } from './fakeData';

const gridData = { Data: bodyData, Total: totalData, GrandTotal: grandTotalData };
const gridDetailData = { Data: bodyDetailData, Total: totalDetailData, GrandTotal: grandTotalData };
const title = "Report Title";
const fileName = "SubsidiaryPerformance";

const COLUMN_COUNT = 7;
const DETAIL_COLUMN_COUNT = 8;
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

        it('get data - create functions and Excel.export should be called with correct parameter', () => {
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
        it('Level MAIN - mergeConfig should has correct value', () => {
            const mergeConfig = [{ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: COLUMN_COUNT - 1 } }];

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createTitle();

            expect(reportExcel.mergeConfig).toEqual(mergeConfig);
        })

        it('Level CUSTOMER - mergeConfig should has correct value', () => {
            const mergeConfig = [{ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: DETAIL_COLUMN_COUNT - 1 } }];

            const reportExcel = new ReportExcel({}, title, true);

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
        it('Level MAIN - worksheet should has correct value', () => {
            const expectedWorksheet = {
                A2: { t: "s", v: "Subsidiary", s: headerCellStyle },
                B2: { t: "s", v: "Currency", s: headerCellStyle },
                C2: { t: "s", v: "Product", s: headerCellStyle },
                D2: { t: "s", v: "BetCount", s: headerCellStyle },
                E2: { t: "s", v: "Turnover", s: headerCellStyle },
                F2: { t: "s", v: "CustomerW_L", s: headerCellStyle },
                G2: { t: "s", v: "SubsidiaryWL", s: headerCellStyle }
            };

            const reportExcel = new ReportExcel({}, title);

            reportExcel._createHeader();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })

        it('Level CUSTOMER - worksheet should has correct value', () => {
            const expectedWorksheet = {
                A2: { t: "s", v: "#", s: headerCellStyle },
                B2: { t: "s", v: "ExternalId", s: headerCellStyle },
                C2: { t: "s", v: "SystemId", s: headerCellStyle },
                D2: { t: "s", v: "Currency", s: headerCellStyle },
                E2: { t: "s", v: "BetCount", s: headerCellStyle },
                F2: { t: "s", v: "Turnover", s: headerCellStyle },
                G2: { t: "s", v: "CustomerW_L", s: headerCellStyle },
                H2: { t: "s", v: "SubsidiaryWL", s: headerCellStyle }
            };

            const reportExcel = new ReportExcel({}, title, true);

            reportExcel._createHeader();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe('_createBodyData', () => {
        describe('Level MAIN', () => {
            it('mergeConfig should has correct value', () => {
                const currentRowIndex = DATA_ROW_INDEX;

                const mergeConfig = [
                    { s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex + 3, c: 0 } },
                    { s: { r: currentRowIndex, c: 1 }, e: { r: currentRowIndex + 1, c: 1 } },
                    { s: { r: currentRowIndex + 2, c: 1 }, e: { r: currentRowIndex + 3, c: 1 } }
                ];

                const reportExcel = new ReportExcel(gridData, title);

                reportExcel._createBodyData();

                expect(reportExcel.mergeConfig).toEqual(mergeConfig);
            })

            it('worksheet should has correct value', () => {
                const expectedWorksheet = {
                    A3: { t: "s", v: "SUB1", s: bodyCellStyle.rowspan },
                    B3: { t: "s", v: "EUR", s: bodyCellStyle.center },
                    C3: { t: "s", v: "All" },
                    D3: { t: "n", v: 52, s: bodyCellStyle.number },
                    E3: { t: "n", v: 322.0000, s: bodyCellStyle.decimal },
                    F3: { t: "n", v: 142.3210, s: bodyCellStyle.decimal },
                    G3: { t: "n", v: -141.7636, s: bodyCellStyle.negativeDecimal },
                    C4: { t: "s", v: "Product 1" },
                    D4: { t: "n", v: 4, s: bodyCellStyle.number },
                    E4: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    F4: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    G4: { t: "n", v: 0.5574, s: bodyCellStyle.decimal },
                    B5: { t: "s", v: "USD", s: bodyCellStyle.center },
                    C5: { t: "s", v: "All" },
                    D5: { t: "n", v: 1, s: bodyCellStyle.number },
                    E5: { t: "n", v: -111.0000, s: bodyCellStyle.decimal },
                    F5: { t: "n", v: 45.258, s: bodyCellStyle.decimal },
                    G5: { t: "n", v: -785.2569, s: bodyCellStyle.negativeDecimal },
                    C6: { t: "s", v: "Product 2" },
                    D6: { t: "n", v: 2, s: bodyCellStyle.number },
                    E6: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    F6: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    G6: { t: "n", v: 0.2478, s: bodyCellStyle.decimal },
                };

                const reportExcel = new ReportExcel(gridData, title);

                reportExcel._createBodyData();
                const result = reportExcel.worksheet;

                expect(result).toEqual(expectedWorksheet);
            })
        })

        describe('Level CUSTOMER', () => {
            it('mergeConfig should has correct value', () => {
                const currentRowIndex = DATA_ROW_INDEX;

                const mergeConfig = [];

                const reportExcel = new ReportExcel(gridDetailData, title, true);
                reportExcel._createBodyDetailData();

                expect(reportExcel.mergeConfig).toEqual(mergeConfig);
            })

            it('worksheet should has correct value', () => {
                const expectedWorksheet = {
                    A3: { t: "n", v: 1, s: bodyCellStyle.center },
                    B3: { t: "s", v: "Ex1", s: bodyCellStyle.center },
                    C3: { t: "s", v: "Sys1", s: bodyCellStyle.center },
                    D3: { t: "s", v: "USD", s: bodyCellStyle.center },
                    E3: { t: "n", v: 52, s: bodyCellStyle.number },
                    F3: { t: "n", v: 322.0000, s: bodyCellStyle.decimal },
                    G3: { t: "n", v: 142.3210, s: bodyCellStyle.decimal },
                    H3: { t: "n", v: -141.7636, s: bodyCellStyle.negativeDecimal },
                    A4: { t: "n", v: 2, s: bodyCellStyle.center },
                    B4: { t: "s", v: "Ex2", s: bodyCellStyle.center },
                    C4: { t: "s", v: "Sys2", s: bodyCellStyle.center },
                    D4: { t: "s", v: "EUR", s: bodyCellStyle.center },
                    E4: { t: "n", v: 4, s: bodyCellStyle.number },
                    F4: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    G4: { t: "n", v: 0.0000, s: bodyCellStyle.decimal },
                    H4: { t: "n", v: 0.5574, s: bodyCellStyle.decimal },
                };

                const reportExcel = new ReportExcel(gridDetailData, title, true);

                reportExcel._createBodyDetailData();
                const result = reportExcel.worksheet;

                expect(result).toEqual(expectedWorksheet);
            })
        })
    })

    describe('_createFooterData', () => {
        describe('Level MAIN', () => {
            it('worksheet should has correct value', () => {
                const expectedWorksheet = {
                    A3: { t: "s", v: "Total SUB1", s: totalCellStyle.default },
                    B3: { t: "s", v: "Based EUR", s: totalCellStyle.center },
                    D3: { t: "n", v: 3, s: totalCellStyle.number },
                    E3: { t: "n", v: 276.469, s: totalCellStyle.decimal },
                    F3: { t: "n", v: 224.7238, s: totalCellStyle.decimal },
                    G3: { t: "n", v: -224.7238, s: totalCellStyle.negativeDecimal }
                };

                const reportExcel = new ReportExcel(gridData, title, false, 'EUR');

                reportExcel._createFooterData();
                const result = reportExcel.worksheet;

                expect(result).toEqual(expectedWorksheet);
            })

            it('mergeConfig should has correct value', () => {
                const currentRowIndex = DATA_ROW_INDEX;

                const mergeConfig = [
                    { s: { r: currentRowIndex, c: 1 }, e: { r: currentRowIndex, c: 2 } }
                ];

                const reportExcel = new ReportExcel(gridData, title);

                reportExcel._createFooterData();

                expect(reportExcel.mergeConfig).toEqual(mergeConfig);
            })
        })

        describe('Level CUSTOMER', () => {
            it('worksheet should has correct value', () => {
                const expectedWorksheet = {
                    A3: { t: "s", v: "Totalin EUR", s: totalCellStyle.center },
                    D3: { t: "s", v: "USD", s: totalCellStyle.center },
                    E3: { t: "n", v: 52, s: totalCellStyle.number },
                    F3: { t: "n", v: 322.0000, s: totalCellStyle.decimal },
                    G3: { t: "n", v: 142.3210, s: totalCellStyle.decimal },
                    H3: { t: "n", v: -141.7636, s: totalCellStyle.negativeDecimal },
                    D4: { t: "s", v: "EUR", s: totalCellStyle.center },
                    E4: { t: "n", v: 4, s: totalCellStyle.number },
                    F4: { t: "n", v: 0.0000, s: totalCellStyle.decimal },
                    G4: { t: "n", v: 0.0000, s: totalCellStyle.decimal },
                    H4: { t: "n", v: 0.5574, s: totalCellStyle.decimal }
                };

                const reportExcel = new ReportExcel(gridDetailData, title, true, 'EUR');

                reportExcel._createFooterDetailData();
                const result = reportExcel.worksheet;

                expect(result).toEqual(expectedWorksheet);
            })

            it('mergeConfig should has correct value', () => {
                const currentRowIndex = DATA_ROW_INDEX;

                const mergeConfig = [
                    { s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex + 1, c: 2 } }
                ];

                const reportExcel = new ReportExcel(gridDetailData, title, true);

                reportExcel._createFooterDetailData();

                expect(reportExcel.mergeConfig).toEqual(mergeConfig);
            })
        })
    })

    describe('_createGrandTotalData', () => {
        it('Level MAIN - worksheet should has correct value', () => {
            const expectedWorksheet = {
                A3: { t: "s", v: "Total", s: grandTotalCellStyle.default },
                B3: { t: "s", v: "Based EUR", s: grandTotalCellStyle.center },
                D3: { t: "n", v: 13286376, s: grandTotalCellStyle.number },
                E3: { t: "n", v: 405367913.09429135, s: grandTotalCellStyle.decimal },
                F3: { t: "n", v: -14046804.028517062, s: grandTotalCellStyle.decimal },
                G3: { t: "n", v: 14046469.750504408, s: grandTotalCellStyle.decimal }
            };

            const reportExcel = new ReportExcel(gridData, title, false, 'EUR');

            reportExcel._createGrandTotalData();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })

        it('Level CUSTOMER - worksheet should has correct value', () => {
            const expectedWorksheet = {
                A3: { t: "s", v: "Totalin EUR", s: grandTotalCellStyle.center },
                E3: { t: "n", v: 13286376, s: grandTotalCellStyle.number },
                F3: { t: "n", v: 405367913.09429135, s: grandTotalCellStyle.decimal },
                G3: { t: "n", v: -14046804.028517062, s: grandTotalCellStyle.decimal },
                H3: { t: "n", v: 14046469.750504408, s: grandTotalCellStyle.decimal }
            };

            const reportExcel = new ReportExcel(gridDetailData, title, true, 'EUR');

            reportExcel._createGrandTotalDetailData();
            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })

    describe('_createSheetData', () => {
        describe('Level MAIN', () => {
            it('revelant functions should be called', () => {
                const reportExcel = new ReportExcel(gridData, title, false, 'EUR');
                reportExcel._createBodyData = jest.fn();
                reportExcel._createFooterData = jest.fn();
                reportExcel._createGrandTotalData = jest.fn();

                reportExcel._createSheetData();
                const result = reportExcel.worksheet;

                expect(reportExcel._createBodyData).toHaveBeenCalled();
                expect(reportExcel._createFooterData).toHaveBeenCalled();
                expect(reportExcel._createGrandTotalData).toHaveBeenCalled();
            })

            it('currentRowIndex should has correct value', () => {
                const expectedCurrentRowIndex = 7;
                const reportExcel = new ReportExcel(gridData, title, false, 'EUR');

                reportExcel._createSheetData();
                const result = reportExcel.currentRowIndex;

                expect(result).toEqual(expectedCurrentRowIndex);
            })
        })

        describe('Level CUSTOMER', () => {
            it('revelant functions should be called', () => {
                const reportExcel = new ReportExcel(gridDetailData, title, true, 'EUR');
                reportExcel._createBodyDetailData = jest.fn();
                reportExcel._createFooterDetailData = jest.fn();
                reportExcel._createGrandTotalDetailData = jest.fn();

                reportExcel._createSheetData();
                const result = reportExcel.worksheet;

                expect(reportExcel._createBodyDetailData).toHaveBeenCalled();
                expect(reportExcel._createFooterDetailData).toHaveBeenCalled();
                expect(reportExcel._createGrandTotalDetailData).toHaveBeenCalled();
            })

            it('currentRowIndex should has correct value', () => {
                const expectedCurrentRowIndex = 6;
                const reportExcel = new ReportExcel(gridDetailData, title, true, 'EUR');

                reportExcel._createSheetData();
                const result = reportExcel.currentRowIndex;

                expect(result).toEqual(expectedCurrentRowIndex);
            })
        })
    })

    describe('_createExcelConfig', () => {
        it('Level MAIN - worksheet should has correct value', () => {
            const mergeConfig = ["merge config"];
            const wscols = [{ wpx: 150 }, { wpx: 120 }, { wpx: 180 }, { wpx: 120 }, { wpx: 250 }, { wpx: 250 }, { wpx: 250 }];

            const expectedWorksheet = {
                "!merges": mergeConfig,
                "!ref": "A1:G6",
                "!cols": wscols
            };

            const reportExcel = new ReportExcel(undefined, title);
            reportExcel.currentRowIndex = 5;
            reportExcel.mergeConfig = mergeConfig;
            reportExcel._createExcelConfig();

            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })

        it('Level CUSTOMER - worksheet should has correct value', () => {
            const mergeConfig = ["merge config"];
            const wscols = [{ wpx: 30 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 180 }, { wpx: 250 }, { wpx: 250 }, { wpx: 250 }];

            const expectedWorksheet = {
                "!merges": mergeConfig,
                "!ref": "A1:H7",
                "!cols": wscols
            };

            const reportExcel = new ReportExcel(undefined, title, true);
            reportExcel.currentRowIndex = 6;
            reportExcel.mergeConfig = mergeConfig;
            reportExcel._createExcelConfig();

            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })
})