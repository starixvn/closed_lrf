import * as actions from '../filterHandlerAction'
import * as types from '../types'

describe('filterHandlerAction', () => {
    it('setDateRange - should create an correct action', () => {
        const range = {
            startDate: '01/01/2017',
            endDate: '01/10/2017'
        };
        const expectedAction = {
            type: types.SET_DATE_RANGE,
            data: {
                fromDate: range.startDate,
                toDate: range.endDate
            }
        };

        const result = actions.setDateRange(range);

        expect(result).toEqual(expectedAction);
    })

    it('setParam - should create an correct action', () => {
        const param = {
            FromDate: '01/01/2017',
            ToDate: '01/10/2017',
            PageInde: 1,
            PageSize: 5
        };
        const expectedAction = {
            type: types.SET_PARAM,
            data: param
        };

        const result = actions.setParam(param);

        expect(result).toEqual(expectedAction);
    })
})