import Report from '../report'
import { ReportBy } from '../../constants/report'
import Site from '../site'
import axios from 'axios'

jest.mock('axios')
jest.mock('../site')

describe('Report ', () => {
    describe('getDrilldownDateRange', () => {
        it('report by DAILY - return fromDate and toDate are drilldownDate', () => {
            const drilldownDateString = '01/01/2017';
            const drilldownDate = new Date(drilldownDateString);

            const result = Report.getDrilldownDateRange(ReportBy.DAILY, null, null, drilldownDateString);
            const result2 = Report.getDrilldownDateRange(ReportBy.DAILY, null, null, drilldownDate);

            expect(result.fromDate).toEqual(drilldownDate);
            expect(result.toDate).toEqual(drilldownDate);
            expect(result2.fromDate).toEqual(drilldownDate);
            expect(result2.toDate).toEqual(drilldownDate);
        });

        describe('report by MONTHLY', () => {
            it('all Date have the same month - result.fromDate is fromDate and result.toDate is toDate', () => {
                const drilldownDate = new Date(2017, 1, 15);
                const fromDate = new Date(2017, 1, 8);
                const toDate = new Date(2017, 1, 25);

                const result = Report.getDrilldownDateRange(ReportBy.MONTHLY, fromDate, toDate, drilldownDate);

                expect(result.fromDate).toEqual(fromDate);
                expect(result.toDate).toEqual(toDate);
            });
            it('fromDate is not in the same month - result.fromDate is first day of drilldown month and result.toDate is toDate', () => {
                const drilldownDate = new Date(2017, 2, 15);
                const fromDate = new Date(2017, 1, 8);
                const toDate = new Date(2017, 2, 25);

                const result = Report.getDrilldownDateRange(ReportBy.MONTHLY, fromDate, toDate, drilldownDate);

                expect(result.fromDate).toEqual(new Date(2017, 2, 1));
                expect(result.toDate).toEqual(toDate);
            });
            it('toDate is not in the same month - result.fromDate is fromDate and result.toDate is the last day of drilldown month', () => {
                const drilldownDate = new Date(2017, 0, 15);
                const fromDate = new Date(2017, 0, 8);
                const toDate = new Date(2017, 1, 25);

                const result = Report.getDrilldownDateRange(ReportBy.MONTHLY, fromDate, toDate, drilldownDate);

                expect(result.fromDate).toEqual(fromDate);
                expect(result.toDate).toEqual(new Date(2017, 0, 31));
            });
        });
    });

    describe('fetchGridData', () => {
        beforeAll(() => {
            axios.post = jest.fn();
            Site.resolveClientUrl = jest.fn((url) => url);
            Site.getXsrfToken = jest.fn(() => "tokenXXX");
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        const params = {
            data: { Abc: "1,2,3", ProductList: "SB,BA" }
        }

        const expectedUrl = "api/LicenseeWinLossByTimeZoneReport/Index";
        const expectedData = params.data;
        const expectedHeader = {
            'X-Requested-With': 'XMLHttpRequest',
            '__RequestVerificationToken': "tokenXXX"
        }

        it('axios.post should be called with correct parameters', () => {
            Report.fetchGridData(expectedUrl, params);

            expect(axios.post).toHaveBeenCalledWith(expectedUrl, expectedData, { headers: expectedHeader });
        });
    });
});