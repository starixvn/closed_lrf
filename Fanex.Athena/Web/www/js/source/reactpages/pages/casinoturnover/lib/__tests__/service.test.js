import LangHelper from '../../../../lib/langHelper'

import { Service } from '../service'

describe('Service ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(resource => resource);
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('showErrorMsg', () => {
        it('show correct message', () => {
            window.alert = jest.fn();
            Service.showErrorMsg();

            expect(LangHelper.getSingleResource).toHaveBeenCalledWith('ErrorProcessingMsg');
        })
    })

    describe('getReportTitle', () => {
        it('return correct content', () => {
            const fromDate = "09/01/2017";
            const toDate = "09/30/2017";
            const currency = 'USD';
            const baseCurrency = 'EUR';

            const expectedResult = `CasinoTurnover, ${fromDate} → ${toDate}, Currency: ${currency}, BaseCurrency: ${baseCurrency}`

            const result = Service.getReportTitle(fromDate, toDate, currency, baseCurrency);

            expect(result).toBe(expectedResult);
        })
    })
})