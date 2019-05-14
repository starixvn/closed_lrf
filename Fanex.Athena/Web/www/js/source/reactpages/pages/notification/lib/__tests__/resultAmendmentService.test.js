import LangHelper from '../../../../lib/langHelper'
import Site from '../../../../lib/site'

import resultAmendmentService from '../resultAmendmentService'

describe('resultAmendmentService', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);

        Site.convertDateToString = jest.fn((date) => date);
    })

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getReportTitle', () => {
        it('returns correct title', () => {
            const dateRange = {
                fromDate: '01/01/2017',
                toDate: '01/10/2017'
            };
            const expectedTitle = 'Amendment, 01/01/2017 - 01/10/2017';

            var result = resultAmendmentService.getReportTitle(dateRange);

            expect(result).toEqual(expectedTitle);
        });
    })

    describe('getHeaderText', () => {
        it('returns correct header names', () => {
            const expectedHeader = {
                index: '#',
                ticketList: 'TicketList',
                dateTime: 'EventDate',
                content: 'Content'
            }

            var result = resultAmendmentService.getHeaderText();

            expect(result).toEqual(expectedHeader);
        });
    })
})