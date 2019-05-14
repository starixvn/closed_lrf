import * as actions from '../filterHandlerAction'
import * as types from '../types'

describe('filterHandlerAction', () => {
    it('setSelectedSubsidiary - should create an correct action', () => {
        const subsidiaryKeys = "1,2,3";
        const expectedAction = {
            type: types.SET_SUBSIDIARY,
            data: subsidiaryKeys
        }

        const result = actions.setSelectedSubsidiary(subsidiaryKeys);

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

    it('changeConvertAll - should create an correct action', () => {
        const convertAll = true;
        const expectedAction = {
            type: types.CHANGE_CONVERT_ALL,
            data: convertAll
        }

        const result = actions.changeConvertAll(convertAll);

        expect(result).toEqual(expectedAction);
    })

    it('changeIncludeDrawData - should create an correct action', () => {
        const check = true;
        const expectedAction = {
            type: types.CHANGE_INCLUDE_DRAW_DATA,
            data: check
        }

        const result = actions.changeIncludeDrawData(check);

        expect(result).toEqual(expectedAction);
    })

    it('setParams - should create an correct action', () => {
        const params = {};
        const expectedAction = {
            type: types.SET_PARAMS,
            data: params
        }

        const result = actions.setParams(params);

        expect(result).toEqual(expectedAction);
    })
})