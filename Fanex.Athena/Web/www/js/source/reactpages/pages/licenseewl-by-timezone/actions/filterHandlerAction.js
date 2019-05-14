import * as types from './types.js'

export const setSelectedTimeZone = (value) => {
    return {
        type: types.SET_TIMEZONE,
        data: value
    }
}

export const setSelectedReportBy = (value) => {
    return {
        type: types.SET_REPORTBY,
        data: value
    }
}

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


export const changeGroupBy = (value) => {
    return {
        type: types.CHANGE_GROUPBY,
        data: value
    }
}

export const changeIsConvertAll = (checked) => {
    return {
        type: types.CHANGE_IS_CONVERT_ALL,
        data: checked
    }
}

export const changeIsIncludeDrawData = (checked) => {
    return {
        type: types.CHANGE_IS_INCLUDE_DRAW_DATA,
        data: checked
    }
}