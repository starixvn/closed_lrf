import Excel from '../../../../lib/excel'
import LangHelper from '../../../../lib/langHelper'
import ReportExcel from '../reportExcel'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../../constants/excelStyle'
import { ReportBy } from '../../../../constants/report'

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const MIN_COLUMN = 7;
const MAIN_SECTION = 'main';
const TOTAL_SECTION = 'total';
const SUMMARYTOTAL_SECTION = 'summary';

describe('reportExcel ', () => {
    const rowData = {
        Date: '2017-01-01T12:00:00',
        CurrencyName: 'CurrencyName',
        CurrencyId: 1,
        TurnOverTotal: -1,
        TurnOverSB: 2,
        TurnOverNG: -3,
        TotalTransaction: 3,
        CustomerWinLoss: 4,
        LicenseeWLTotal: 7,
        LicenseeWLSB: -2,
        LicenseeWLNG: 9
    }
    
    const gridData = {
        Data: [rowData],
        Total: [rowData],
        SummaryTotal: {
            'Currency': rowData
        }
    };

    const fileName = 'LicenseeWinLoss';
    const title = 'LicenseeWinLossTitle';

    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Excel.export = jest.fn();
    })

    afterAll(() => {
        jest.resetAllMocks();
    })
    
    describe('export', () => {
        it('data is empty - do nothing', () => {
            const reportExcel = new ReportExcel({}, title, ReportBy.DAILY, []);

            const result = reportExcel.export();

            expect(Excel.export).not.toHaveBeenCalled();
        })

        it('data is not empty - call functions to create sections for excel file', () => {
            const expectedWorksheet = {};

            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, []);
            reportExcel._createHeader = jest.fn();
            reportExcel._createSheetData = jest.fn();
            reportExcel._createExcelConfig = jest.fn();

            reportExcel.export(() => {
                expect(Excel.export).toHaveBeenCalledWith(expectedWorksheet, fileName);
                expect(reportExcel._createHeader).toHaveBeenCalled();
                expect(reportExcel._createSheetData).toHaveBeenCalled();
                expect(reportExcel._createExcelConfig).toHaveBeenCalled();
            });
        })
    })

    describe('_createHeader', () => {
        it('only one product is selected - create one column for Turnover and one column for LicenseeWL', () => {
            const productCodes = ['SB'];
            const expectedTurnOver = { t: 's', v: 'Turnover', s: headerCellStyle };
            const expectedLicenseeWL = { t: 's', v: 'LicenseeW_L', s: headerCellStyle };
            const turnoverRow = 'D2', licenseeWLRow = 'G2';

            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, productCodes);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();

            expect(reportExcel.worksheet[turnoverRow]).toEqual(expectedTurnOver);
            expect(reportExcel.worksheet[licenseeWLRow]).toEqual(expectedLicenseeWL);
        });

        it('two products is selected - create three columns for Turnover and three columns for LicenseeWL', () => {
            const productCodes = ['SB', 'NG'];
            const expectedSB = { t: 's', v: 'ProductSB', s: headerCellStyle };
            const expectedNG = { t: 's', v: 'ProductNG', s: headerCellStyle };
            const expectedTotal = { t: 's', v: 'Total', s: headerCellStyle };
            const turnoverSBRow = 'D3', turnoverNGRow = 'E3', turnoverTotalRow = 'F3', 
                licenseeSBRow = 'I3', licenseeNGRow = 'J3', licenseeTotalRow = 'K3';

            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, productCodes);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();

            expect(reportExcel.worksheet[turnoverSBRow]).toEqual(expectedSB);
            expect(reportExcel.worksheet[turnoverNGRow]).toEqual(expectedNG);
            expect(reportExcel.worksheet[turnoverTotalRow]).toEqual(expectedTotal);
            expect(reportExcel.worksheet[licenseeSBRow]).toEqual(expectedSB);
            expect(reportExcel.worksheet[licenseeNGRow]).toEqual(expectedNG);
            expect(reportExcel.worksheet[licenseeTotalRow]).toEqual(expectedTotal);
        });

        describe('_createTitle', () => {
            const MIN_COLUMN = 7;
            const TitleRow = 'A1';

            it('only one product is selected - create Title row with colSpan correcly', () => {
                const productCodes = ['SB'];
                const colSpan = MIN_COLUMN;
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1 } };

                const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, productCodes);
                reportExcel._createHeader();

                const titleRow = reportExcel.worksheet[TitleRow];
                const mergeTitle = reportExcel.mergeConfig[reportExcel.mergeConfig.length - 1];

                expect(titleRow).toEqual(expectedRow);
                expect(mergeTitle).toEqual(expectedMerge);
            });

            it('two products is selected - create Title row with colSpan correcly', () => {
                const productCodes = ['SB', 'NG'];
                const colSpan = MIN_COLUMN + 4;
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1 } };

                const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, productCodes);
                reportExcel._createHeader();

                const titleRow = reportExcel.worksheet[TitleRow];
                const mergeTitle = reportExcel.mergeConfig[reportExcel.mergeConfig.length - 1];

                expect(titleRow).toEqual(expectedRow);
                expect(mergeTitle).toEqual(expectedMerge);
            });
        });
    })

    describe('_createSheetData', () => {
        it('cal method to create main/total/summary section', () => {
            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, ['SB']);
            reportExcel._createMainData = jest.fn();
            reportExcel._createTotalData = jest.fn();
            reportExcel._createSummaryData = jest.fn();

            reportExcel._createSheetData();

            expect(reportExcel._createMainData).toHaveBeenCalled();
            expect(reportExcel._createTotalData).toHaveBeenCalled();
            expect(reportExcel._createSummaryData).toHaveBeenCalled();
        })
    })

    describe('_createMainData', () => {
        it('create row for MAIN section - report by DAily - format Date correctly', () => {
            const expectedDate = '01/01/2017';
   
            var data = { Data: [{...rowData}] };
            const reportExcel = new ReportExcel(data, title, ReportBy.DAILY, ['SB']);
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createMainData();
            const result = reportExcel._createRowBySection.mock.calls[0][3];

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(MAIN_SECTION);
            expect(result.Date).toEqual(expectedDate);
        });
        
        it('create row for MAIN section - report by Monthly - format Date correctly', () => {
            const expectedDate = '01/2017';
   
            var data = { Data: [{...rowData}] };
            const reportExcel = new ReportExcel(data, title, ReportBy.MONTHLY, ['SB']);
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createMainData();
            const result = reportExcel._createRowBySection.mock.calls[0][3];

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(MAIN_SECTION);
            expect(result.Date).toEqual(expectedDate);
        });
    })

    describe('_createTotalData', () => {
        it('create row for TOTAL section', () => {
            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, ['SB']);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createTotalData();

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(TOTAL_SECTION);
        });

        const ExpectedText = 'Total';
        const ExpectedStyle = totalCellStyle.rowspan;
        const ExpectedRowSpan = gridData.Total.length;

        it('create merge column correctly', () => {
            const ExpectedColSpan = 2; 

            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, ['SB']);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createTotalData();
            const params = reportExcel._createMergeTotalDataColumn.mock.calls[0];

            const rowSpan = params[1];
            const colSpan = params[3];
            const text = params[4];
            const style = params[5]

            expect(rowSpan).toEqual(ExpectedRowSpan);
            expect(colSpan).toEqual(ExpectedColSpan);
            expect(text).toEqual(ExpectedText);
            expect(style).toEqual(ExpectedStyle);
        });
    })

    describe('_createSummaryData', () => {
        it('create row for SUMMARY TOTAL section', () => {
            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, []);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createSummaryData();

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(SUMMARYTOTAL_SECTION);
        });

        const ExpectedText = 'Totalin ' + Object.keys(gridData.SummaryTotal)[0];
        const ExpectedStyle = grandTotalCellStyle.rowspan;
        const ExpectedRowSpan = 1;

        it('create merge column correctly', () => {
            const ExpectedColSpan = 3; 

            const reportExcel = new ReportExcel(gridData, title, ReportBy.DAILY, []);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createSummaryData();
            const params = reportExcel._createMergeTotalDataColumn.mock.calls[0];

            const rowSpan = params[1];
            const colSpan = params[3];
            const text = params[4];
            const style = params[5]

            expect(rowSpan).toEqual(ExpectedRowSpan);
            expect(colSpan).toEqual(ExpectedColSpan);
            expect(text).toEqual(ExpectedText);
            expect(style).toEqual(ExpectedStyle);
        }); 
    })

    describe('_createMergeTotalDataColumn', () => {
        it('create merge row correctly', () => {
            const startRowIndex = 0;
            const rowSpan = 2;
            const startColIndex = 0;
            const colSpan = 3;
            const text = 'text';
            const style = {};

            const expectedRow = { t: 's', v: text, s: style };
            const rowAddress = 'A1';
            const expectedMerge = { 
                s: { r: startRowIndex, c: startColIndex }, 
                e: { r: startRowIndex + rowSpan - 1, c: startColIndex + colSpan - 1 }
            };

            const reportExcel = new ReportExcel([], title, ReportBy.DAILY, []);
            reportExcel._createMergeTotalDataColumn(startRowIndex, rowSpan, startColIndex, colSpan, text, style);

            const row = reportExcel.worksheet[rowAddress];
            const merge = reportExcel.mergeConfig[0];

            expect(row).toEqual(expectedRow);
            expect(merge).toEqual(expectedMerge);
        })
    })

    describe('_createRowBySection', () => {
        it('create correct section', () => {
            const configColumn = [
                { 
                    field: 'Index', 
                    type: 's', 
                    [MAIN_SECTION]: { isShow: true, style: bodyCellStyle.center }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }, {  
                    field: 'TotalTransaction',
                    type: 'n', 
                    [MAIN_SECTION]: { isShow: false, style: bodyCellStyle.decimal }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }, { 
                    field: 'TurnOverTotal', 
                    type: 'n', 
                    [MAIN_SECTION]: { isShow: true, index_c: 5, hasNegativeStyle: true, style: { positive: bodyCellStyle.decimal, negative: bodyCellStyle.negativeDecimal } }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }
            ];

            const startColIndex = 0;
            const startRowIndex = 0;

            const data = gridData.Data[0];
            const expectedWorksheet = {
                A1: { t: 's', v: data.Index, s: bodyCellStyle.center },
                F1: { t: 'n', v: data.TurnOverTotal, s: bodyCellStyle.negativeDecimal }
            };

            const reportExcel = new ReportExcel(data, title, ReportBy.DAILY, ['SB']);
            reportExcel.configColumn = configColumn;
            reportExcel._createRowBySection(MAIN_SECTION, startColIndex, startRowIndex, data);

            const worksheet = reportExcel.worksheet;

            expect(worksheet).toEqual(expectedWorksheet);
        })
    })

    describe('_createExcelConfig', () => {
        it('worksheet should has correct value', () => {
            const configColumn = [
                { [MAIN_SECTION]: { isShow: true, width: 100 } },
                { [MAIN_SECTION]: { isShow: true, width: 101 } },
                { [MAIN_SECTION]: { isShow: false, width: 102 } },
                { [MAIN_SECTION]: { isShow: true, width: 103 } }
            ];

            const mergeConfig = ["merge config"];
            const wscols = [{ wpx: 100 }, { wpx: 101 }, { wpx: 103 }];

            const expectedWorksheet = {
                "!merges": mergeConfig,
                "!ref": "A1:D6",
                "!cols": wscols
            };

            const reportExcel = new ReportExcel({}, title, ReportBy.DAILY, []);
            reportExcel.configColumn = configColumn;
            reportExcel.currentRowIndex = 5;
            reportExcel.totalColumn = 3;
            reportExcel.mergeConfig = mergeConfig;
            reportExcel._createExcelConfig();

            const result = reportExcel.worksheet;

            expect(result).toEqual(expectedWorksheet);
        })
    })
})