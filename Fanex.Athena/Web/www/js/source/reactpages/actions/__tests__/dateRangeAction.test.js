import * as actions from '../dateRangeAction'
import * as types from '../types'

describe('dateRangeAction ', () => {
    it('setDateRange - should create an correct action', () => {
        const dateRange = { startDate: '01/01/2017', endDate: '10/10/2017' };

        const range = {
            fromDate: dateRange.startDate,
            toDate: dateRange.endDate
        };

        const expectedAction = {
            type: types.SET_DATE_RANGE,
            data: range
        }

        expect(actions.setDateRange(dateRange)).toEqual(expectedAction);
    })
})