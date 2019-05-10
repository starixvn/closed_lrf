import * as types from './types.js'

export const setDateRange = (dateRange) => {
    const range = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
    }

    return {
        type: types.SET_DATE_RANGE,
        data: range
    }
}