import Excel from '../../../../lib/excel'
import LangHelper from '../../../../lib/langHelper'
import ReportExcel from '../reportExcel'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../../constants/excelStyle'
import { ReportLevel, ReportBy } from '../../../../constants/report'

const TITLE_ROW_INDEX = 0;
const MAX_COLUMN = 15;
const MAIN_SECTION = 'main';
const TOTAL_SECTION = 'total';
const SUMMARYTOTAL_SECTION = 'summary';

describe('reportExcel ', () => {
    const rowData = {
        Date: '2017-01-01T12:00:00',
        ExternalId: 'ExternalId',
        SystemId: 'SystemId',
        CurrencyName: 'CurrencyName',
        CurrencyId: 1,
        Turnover: 1,
        NetTurnover: -2,
        TotalTransaction: 3,
        CustomerWL: 4,
        CustomerComm: 5,
        CustomerWLTotal: 6,
        LicenseeWL: 7,
        AmountDueTo: 8,
        LicenseeComm: 9,
        LicenseeWLTotal: 10
    }
    
    const gridData = {
        DataList: [rowData],
        TotalDataList: [rowData],
        SummaryTotal: {
            'Currency': rowData
        }
    };

    const fileName = 'ExchangeWinLoss';
    const title = 'Exchange Win Loss Title';

    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Excel.export = jest.fn();
    })

    afterAll(() => {
        jest.resetAllMocks();
    })
    
    describe('export', () => {
        it('data is empty - do nothing', () => {
            const reportExcel = new ReportExcel();

            const result = reportExcel.export();

            expect(Excel.export).not.toHaveBeenCalled();
        })

        it('data is not empty - call functions to create sections for excel file', () => {
            const expectedWorksheet = {};

            const reportExcel = new ReportExcel(gridData);
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
        const LevelRow = 'B2';
        const NextLevelRow = 'C2';

        it('MAIN - report by daily - create Date column', () => {
            const level = ReportLevel.MAIN;
            const expectedRow = { t: 's', v: 'Date', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, false, ReportBy.DAILY);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const dateRow = reportExcel.worksheet[LevelRow];

            expect(dateRow).toEqual(expectedRow);
        });

        it('MAIN - report by monthly - create Month column', () => {
            const level = ReportLevel.MAIN;
            const expectedRow = { t: 's', v: 'Month', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, false, ReportBy.MONTHLY);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const dateRow = reportExcel.worksheet[LevelRow];

            expect(dateRow).toEqual(expectedRow);
        });

        it('LICENSEE - create SystemId column', () => {
            const level = ReportLevel.LICENSEE;
            const expectedRow = { t: 's', v: 'SystemId', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, false, 1);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const systemIdRow = reportExcel.worksheet[LevelRow];

            expect(systemIdRow).toEqual(expectedRow);
        });

        it('CUSTOMER - create ExternalId and SystemId columns', () => {
            const level = ReportLevel.CUSTOMER;
            const expectedExternalIdRow = { t: 's', v: 'ExternalId', s: headerCellStyle };
            const expectedSystemIdRow = { t: 's', v: 'SystemId', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, false, 1);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const externalIdRow = reportExcel.worksheet[LevelRow];
            const systemIdRow = reportExcel.worksheet[NextLevelRow];

            expect(externalIdRow).toEqual(expectedExternalIdRow);
            expect(systemIdRow).toEqual(expectedSystemIdRow);
        });

        it('isAllowedCustomerComm is false - do not create CustomerWL, CustomerComm and CustomerWLTotal column', () => {
            const level = ReportLevel.MAIN;
            const CustomerRow = 'G2';
            const CustomerWLRow = 'G3';
            const expectedCustomerRow = { t: 's', v: 'CustomerW_L', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, false, 1);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const customerRowdRow = reportExcel.worksheet[CustomerRow];
            const customerWLRow = reportExcel.worksheet[CustomerWLRow];

            expect(customerRowdRow).toEqual(expectedCustomerRow);
            expect(customerWLRow).toEqual(undefined);
        });

        it('isAllowedCustomerComm is true - create CustomerWL, CustomerComm and CustomerWLTotal column', () => {
            const level = ReportLevel.MAIN;
            const CustomerRow = 'G2';
            const CustomerWLRow = 'G3';
            const expectedCustomerRow = { t: 's', v: 'Customer', s: headerCellStyle };
            const expectedCustomerWLRow = { t: 's', v: 'CustomerW_L', s: headerCellStyle };

            const reportExcel = new ReportExcel(gridData, title, level, true, 1);
            reportExcel._createTitle = jest.fn();

            reportExcel._createHeader();
            const customerRowdRow = reportExcel.worksheet[CustomerRow];
            const customerWLRow = reportExcel.worksheet[CustomerWLRow];

            expect(customerRowdRow).toEqual(expectedCustomerRow);
            expect(customerWLRow).toEqual(expectedCustomerWLRow);
        });

        describe('_createTitle', () => {
            const MAX_COLUMN = 15;
            const TitleRow = 'A1';

            it('MAIN and isAllowedCustomerComm is false - create Title row with colSpan correcly', () => {
                const colSpan = MAX_COLUMN - 2 - 2; // - ExternalId - SystemId - CustomerComm - CustomerWLTotal
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1 } };

                const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, false, 1);
                reportExcel._createHeader();

                const titleRow = reportExcel.worksheet[TitleRow];
                const mergeTitle = reportExcel.mergeConfig[reportExcel.mergeConfig.length - 1];

                expect(titleRow).toEqual(expectedRow);
                expect(mergeTitle).toEqual(expectedMerge);
            });

            it('LICENSEE and isAllowedCustomerComm is false - create Title row with colSpan correcly', () => {
                const colSpan = MAX_COLUMN - 2 - 2; // - ExternalId - Date - CustomerComm - CustomerWLTotal
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1 } };

                const reportExcel = new ReportExcel(gridData, title, ReportLevel.LICENSEE, false, 1);
                reportExcel._createHeader();

                const titleRow = reportExcel.worksheet[TitleRow];
                const mergeTitle = reportExcel.mergeConfig[reportExcel.mergeConfig.length - 1];

                expect(titleRow).toEqual(expectedRow);
                expect(mergeTitle).toEqual(expectedMerge);
            });

            it('CUSTOMER and isAllowedCustomerComm is false - create Title row with colSpan correcly', () => {
                const colSpan = MAX_COLUMN - 1 - 2; // - Date - CustomerComm - CustomerWLTotal
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1} };

                const reportExcel = new ReportExcel(gridData, title, ReportLevel.CUSTOMER, false, 1);
                reportExcel._createHeader();

                const titleRow = reportExcel.worksheet[TitleRow];
                const mergeTitle = reportExcel.mergeConfig[reportExcel.mergeConfig.length - 1];

                expect(titleRow).toEqual(expectedRow);
                expect(mergeTitle).toEqual(expectedMerge);
            });

            it('MAIN and isAllowedCustomerComm is true - create Title row with colSpan correcly', () => {
                const colSpan = MAX_COLUMN - 2; // - ExternalId - SystemId
                const expectedRow = { t: 's', v: title, s: titleCellStyle };
                const expectedMerge = { s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: colSpan - 1 } };

                const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, true, 1);
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
            const reportExcel = new ReportExcel();
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
   
            var totalData = { DataList: [{...rowData}] };
            const reportExcel = new ReportExcel(totalData, title, ReportLevel.MAIN, false, ReportBy.DAILY);
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createMainData();
            const data = reportExcel._createRowBySection.mock.calls[0][3];

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(MAIN_SECTION);
            expect(data.Date).toEqual(expectedDate);
        });
        
        it('create row for MAIN section - report by Monthly - format Date correctly', () => {
            const expectedDate = '01/2017';
   
            var totalData = { DataList: [{...rowData}] };
            const reportExcel = new ReportExcel(totalData, title, ReportLevel.MAIN, false, ReportBy.MONTHLY);
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createMainData();
            const data = reportExcel._createRowBySection.mock.calls[0][3];

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(MAIN_SECTION);
            expect(data.Date).toEqual(expectedDate);
        });
    })

    describe('_createTotalData', () => {
        it('create row for TOTAL section', () => {
            const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, false, ReportBy.DAILY);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createTotalData();

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(TOTAL_SECTION);
        });

        const ExpectedText = 'Total';
        const ExpectedStyle = totalCellStyle.rowspan;
        const ExpectedRowSpan = gridData.TotalDataList.length;

        it('MAIN level - create merge column correctly', () => {
            const ExpectedColSpan = 2; 

            const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, false, ReportBy.DAILY);
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
        
        it('CUSTOMER level - create merge column correctly', () => {
            const ExpectedColSpan = 3; 

            const reportExcel = new ReportExcel(gridData, title, ReportLevel.CUSTOMER, false, ReportBy.DAILY);
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
            const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, false, ReportBy.DAILY);
            reportExcel._createMergeTotalDataColumn = jest.fn();
            reportExcel._createRowBySection = jest.fn();

            reportExcel._createSummaryData();

            expect(reportExcel._createRowBySection.mock.calls[0][0]).toEqual(SUMMARYTOTAL_SECTION);
        });

        const ExpectedText = 'Totalin ' + Object.keys(gridData.SummaryTotal)[0];
        const ExpectedStyle = grandTotalCellStyle.rowspan;
        const ExpectedRowSpan = 1;

        it('MAIN level - create merge column correctly', () => {
            const ExpectedColSpan = 3; 

            const reportExcel = new ReportExcel(gridData, title, ReportLevel.MAIN, false, ReportBy.DAILY);
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
        
        it('CUSTOMER level - create merge column correctly', () => {
            const ExpectedColSpan = 4; 

            const reportExcel = new ReportExcel(gridData, title, ReportLevel.CUSTOMER, false, ReportBy.DAILY);
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

            const reportExcel = new ReportExcel();
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
                    field: 'Turnover', 
                    type: 'n',
                    [MAIN_SECTION]: { isShow: true, hasNegativeStyle: true, style: { positive: bodyCellStyle.decimal, negative: bodyCellStyle.negativeDecimal } }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }, { 
                    field: 'TotalTransaction',
                    type: 'n', 
                    [MAIN_SECTION]: { isShow: false, style: bodyCellStyle.decimal }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }, { 
                    field: 'NetTurnover', 
                    type: 'n', 
                    [MAIN_SECTION]: { isShow: true, index_c: 5, hasNegativeStyle: true, style: { positive: bodyCellStyle.decimal, negative: bodyCellStyle.negativeDecimal } }, 
                    [TOTAL_SECTION]: { isShow: true } 
                }
            ];

            const startColIndex = 0;
            const startRowIndex = 0;

            const data = gridData.DataList[0];
            const expectedWorksheet = {
                A1: { t: 's', v: data.Index, s: bodyCellStyle.center },
                B1: { t: 'n', v: data.Turnover, s: bodyCellStyle.decimal },
                F1: { t: 'n', v: data.NetTurnover, s: bodyCellStyle.negativeDecimal }
            };

            const reportExcel = new ReportExcel();
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

            const reportExcel = new ReportExcel();
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