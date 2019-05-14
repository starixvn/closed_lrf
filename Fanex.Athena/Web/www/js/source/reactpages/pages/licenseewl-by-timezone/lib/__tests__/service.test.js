import LangHelper from '../../../../lib/langHelper'
import Site from '../../../../lib/site'

import service from '../service'

describe('service ', () => {
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
        const fromDate = "09/01/2017";
        const toDate = "09/30/2017";
        const baseCurrency = "EUR";
        const currency = "UUS";

        it('positive time zone: return correct content', () => {
            const timeZone = 8;

            const expectedResult = `WinLossByTimeZone, GMT+8, ${fromDate} → ${toDate}, Currency: ${currency}, BaseCurrency: ${baseCurrency}`
            const dateRange = { fromDate, toDate };

            const result = service.getReportTitle(timeZone, dateRange, currency, baseCurrency, true);

            expect(result).toBe(expectedResult);
        })

        it('negative time zone: return correct content', () => {
            const timeZone = -4;

            const expectedResult = `WinLossByTimeZone, GMT-4, ${fromDate} → ${toDate}, Currency: ${currency}`
            const dateRange = { fromDate, toDate };

            const result = service.getReportTitle(timeZone, dateRange, currency, baseCurrency, false);

            expect(result).toBe(expectedResult);
        })
    })

    describe('getHeaderText', () => {
        const expectedResult = {
            Index: "#",
            ReportBy: "",
            GroupBy:  "",
            BetCount: "BetCount",
            Turnover: "Turnover",
            CustomerComm: "CustomerComm",
            LicenseeWL: "LicenseeWL",
            LicenseeComm: "LicenseeComm",
            LicenseeNetWL: "LicenseeNetWL",
            Margin: "Margin"
        }

        it('GroupBy Product and ReportBy Summary: header text should has correct content', () => {
            expectedResult.ReportBy = "Month";
            expectedResult.GroupBy = "Product";
            const ReportBy = 1;
            const GroupBy = 1;
            const result = service.getHeaderText(ReportBy, GroupBy);

            expect(result).toEqual(expectedResult);
        })

        it('GroupBy Currency and ReportBy Daily: header text should has correct content', () => {
            expectedResult.ReportBy = "Date";
            expectedResult.GroupBy = "Currency";
            const ReportBy = 2;
            const GroupBy = 2;
            const result = service.getHeaderText(ReportBy, GroupBy);

            expect(result).toEqual(expectedResult);
        })
    })
})