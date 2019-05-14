import LangHelper from '../../../../lib/langHelper'
import Site from '../../../../lib/site'
import Report from '../../../../lib/report'

import { Service, HeaderText, TotalText, BreadcrumbText } from '../service'

describe('Service ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(resource => {
            if (resource === "Viewin") {
                return "Viewin {0}";
            }

            return resource;
        });

        Site.convertDateToString = jest.fn((date) => date);
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getReportTitle', () => {
        it('all currencies - return correct content', () => {
            const fromDate = "01/01/2017";
            const toDate = "10/10/2017";
            const selectedCurrency = "USD";

            const expectedResult = `ExchangeWinLoss, ${fromDate} - ${toDate} - Viewin ${selectedCurrency}`
            const dateRange = { fromDate, toDate };

            const result = Service.getReportTitle(dateRange, selectedCurrency);

            expect(result).toBe(expectedResult);
        })

        it('all currencies - return correct content', () => {
            const fromDate = "01/01/2017";
            const toDate = "10/10/2017";
            const selectedCurrency = "EUR";

            const expectedResult = `ExchangeWinLoss, ${fromDate} - ${toDate} - AllCurrencies`
            const dateRange = { fromDate, toDate };

            const result = Service.getReportTitle(dateRange, selectedCurrency, true);

            expect(result).toBe(expectedResult);
        })
    })

    describe('HeaderText', () => {
        it('header text should has correct content', () => {
            const expectedResult = {
                index: '#',
                date: 'Date',
                month: 'Month',
                externalId: 'ExternalId',
                systemId: 'SystemId',
                currency: 'Currency',
                turnover: 'Turnover',
                netTurnover: 'NetTurnover',
                totalTransaction: 'TotalTransaction',
                customer: 'Customer',
                customerWL: 'CustomerW_L',
                customerComm: 'CustomerComm',
                total: 'Total',
                licensee: 'Licensee',
                licenseeWL: 'LicenseeW_L',
                amountDueTo: 'AmountDueTo',
                licenseeComm: 'LicenseeComm',
            };

            expect(HeaderText).toEqual(expectedResult);
        })
    })

    describe('TotalText', () => {
        it('text should has correct content', () => {
            const expectedResult = {
                total: 'Total',
                totalIn: 'Totalin'
            };

            expect(TotalText).toEqual(expectedResult);
        })
    })

    describe('BreadcrumbText', () => {
        it('text should has correct content', () => {
            const expectedResult = {
                main: 'Main',
                licensee: 'Licensee',
                customer: 'Customer'
            };

            expect(BreadcrumbText).toEqual(expectedResult);
        })
    })

    describe('showErrorMsg', () => {
        it('alert correct message', () => {
            window.alert = jest.fn();

            Service.showErrorMsg();

            expect(alert).toHaveBeenCalledWith('ErrorProcessingMsg');
        })
    })

    describe('getDrilldownDateRange', () => {
        it('call getDrilldownDateRange from Report', () => {
            Report.getDrilldownDateRange = jest.fn();

            const reportBy = 1;
            const fromDate = '01/01/2017';
            const toDate = '01/10/2017';
            const drillDownDate = '01/05/2017';

            Service.getDrilldownDateRange(reportBy, fromDate, toDate, drillDownDate);

            expect(Report.getDrilldownDateRange).toHaveBeenCalledWith(reportBy, fromDate, toDate, drillDownDate);
        })
    })
})