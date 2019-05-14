import * as actions from '../filterHandlerAction'
import * as types from '../types'

describe('filterHandlerAction', () => {
    it('setSelectedTimeZone - should create an correct action', () => {
        const data = "1,2,3";
        const expectedAction = {
            type: types.SET_TIMEZONE,
            data: data
        }

        const result = actions.setSelectedTimeZone(data);

        expect(result).toEqual(expectedAction);
    })

    it('setSelectedReportBy - should create an correct action', () => {
        const data = "1,2,3";
        const expectedAction = {
            type: types.SET_REPORTBY,
            data: data
        }

        const result = actions.setSelectedReportBy(data);

        expect(result).toEqual(expectedAction);
    })

    it('setDateRange - should create an correct action', () => {
        const dateRange = { startDate: "09/01/2017", endDate: "09/22/2017" };

        const range = {
            fromDate: dateRange.startDate,
            toDate: dateRange.endDate
        }

        const expectedAction = {
            type: types.SET_DATE_RANGE,
            data: range
        }

        expect(actions.setDateRange(dateRange)).toEqual(expectedAction);
    })

    it('changeGroupBy - should create an correct action', () => {
        const data = "1,2,3";
        const expectedAction = {
            type: types.CHANGE_GROUPBY,
            data: data
        }

        const result = actions.changeGroupBy(data);

        expect(result).toEqual(expectedAction);
    })

    it('changeIsConvertAll - should create an correct action', () => {
        const convertAll = true;
        const expectedAction = {
            type: types.CHANGE_IS_CONVERT_ALL,
            data: convertAll
        }

        const result = actions.changeIsConvertAll(convertAll);

        expect(result).toEqual(expectedAction);
    })

    it('changeIsIncludeDrawData - should create an correct action', () => {
        const data = true;
        const expectedAction = {
            type: types.CHANGE_IS_INCLUDE_DRAW_DATA,
            data: data
        }

        const result = actions.changeIsIncludeDrawData(data);

        expect(result).toEqual(expectedAction);
    })
})