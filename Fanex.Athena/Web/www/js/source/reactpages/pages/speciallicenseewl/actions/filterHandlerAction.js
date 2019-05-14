import * as types from './types.js'

export const setSelectedReportBy = (value) => {
    return {
        type: types.SET_REPORTBY,
        data: value
    }
}

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

export const setParams = (params) => {
    return {
        type: types.SET_PARAMS,
        data: params
    }
}

export const setReportTitle = (title) => {
    return {
        type: types.SET_REPORT_TITLE,
        data: title
    }
}