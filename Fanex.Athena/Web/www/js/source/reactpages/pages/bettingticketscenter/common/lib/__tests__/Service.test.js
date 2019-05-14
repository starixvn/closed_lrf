import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'
import Report from '@jsroot/lib/report'

import Service from '../Service'

describe('Service ', () => {
    const fromDate = "01/01/2017";
    const toDate = "10/10/2017";
    const currency = "USD";
    const baseCurrency = "EUR";

    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(resource => resource);

        Site.convertDateToString = jest.fn((date) => date);
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getTitle', () => {
        it('return correct content', () => {
            const expectedResult = `BettingTicketCenter, ${fromDate} → ${toDate}, Currency: ${currency}, BaseCurrency: ${baseCurrency}`;
            
            const result = Service.getTitle(fromDate, toDate, currency, baseCurrency);

            expect(result).toBe(expectedResult);
        });

        it('fromDate, toDate are null - return correct content', () => {
            const expectedResult = `BettingTicketCenter, Currency: ${currency}, BaseCurrency: ${baseCurrency}`;
            
            const result = Service.getTitle(null, null, currency, baseCurrency);

            expect(result).toBe(expectedResult);
        });

        it('currency is null - return correct content', () => {
            const expectedResult = `BettingTicketCenter, ${fromDate} → ${toDate}, BaseCurrency: ${baseCurrency}`;
            
            const result = Service.getTitle(fromDate, toDate, null, baseCurrency);

            expect(result).toBe(expectedResult);
        })

        it('baseCurrency is null - return correct content', () => {
            const expectedResult = `BettingTicketCenter, ${fromDate} → ${toDate}, Currency: ${currency}`;
            
            const result = Service.getTitle(fromDate, toDate, currency);

            expect(result).toBe(expectedResult);
        });
    })

    describe('HeaderText', () => {
        it('header text should has correct content', () => {
            const expectedResult = {
                Index: "#",
                Platform: LangHelper.getSingleResource("Platform"),
                ExternalId : LangHelper.getSingleResource("ExternalId"),
                SystemId: LangHelper.getSingleResource("SystemId"),
                RefNo: LangHelper.getSingleResource("RefNo"),
                TransTime: LangHelper.getSingleResource("TransTime"),
                Choice: LangHelper.getSingleResource("Choice"),
                Odds: LangHelper.getSingleResource("Odds"),
                OddsType: LangHelper.getSingleResource("OddsType"),
                Stake: LangHelper.getSingleResource("Stake"),
                WinLoss: LangHelper.getSingleResource("WinLoss"),
                LicenseeWL: LangHelper.getSingleResource("LicenseeWL"),
                Comm: LangHelper.getSingleResource("Comm"),
                Status: LangHelper.getSingleResource("Status"),
                Live: LangHelper.getSingleResource("Live")
            };

            expect(Service.getHeaderText()).toEqual(expectedResult);
        })
    })
})