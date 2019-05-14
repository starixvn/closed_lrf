import * as types from './types.js'

export const setDateRange = (dateRange) => {
    const range = {
        fromDate: dateRange.startDate,
        toDate: dateRange.endDate
    }

    return {
        type: types.SET_DATE_RANGE,
        data: range
    }
}

export const setParam = (param) => {
    return {
        type: types.SET_PARAM,
        data: param
    };
}