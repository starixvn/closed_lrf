import * as actions from '../filterHandlerAction'
import * as types from '../types'

describe('filterHandlerAction', () => {
    it('setSelectedReportBy - should create an correct action', () => {
        const value = 1;
        const expectedAction = {
            type: types.SET_REPORTBY,
            data: value
        };

        const result = actions.setSelectedReportBy(value);

        expect(result).toEqual(expectedAction);
    })

    it('setDateRange - should create an correct action', () => {
        const dateRange = { fromDate: '01/01/2018', toDate: '01/02/2018' };
        const expectedAction = {
            type: types.SET_DATE_RANGE,
            data: dateRange
        };

        const result = actions.setDateRange(dateRange);

        expect(result).toEqual(expectedAction);
    })

    it('setParams - should create an correct action', () => {
        const params = { param1: 1 };
        const expectedAction = {
            type: types.SET_PARAMS,
            data: params
        };

        const result = actions.setParams(params);

        expect(result).toEqual(expectedAction);
    })

    it('setReportTitle - should create an correct action', () => {
        const title = 'title';
        const expectedAction = {
            type: types.SET_REPORT_TITLE,
            data: title
        };

        const result = actions.setReportTitle(title);

        expect(result).toEqual(expectedAction);
    })
})