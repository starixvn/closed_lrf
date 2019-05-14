import LangHelper from '../../../../lib/langHelper'
import Site from '../../../../lib/site'

import { Service } from '../service'

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
        it('return correct content', () => {
            const fromDate = "09/01/2017";
            const toDate = "09/30/2017";
            const selectedBaseCurrency = "EUR";

            const expectedResult = `SubsidiaryPerformance, ${fromDate} - ${toDate}, BaseCurrency: ${selectedBaseCurrency}`

            const result = Service.getReportTitle(fromDate, toDate, selectedBaseCurrency);

            expect(result).toBe(expectedResult);
        })
    })
})