import * as types from './types.js'

export const setSelectedSubsidiary = (subsidiaryKeys) => {
    return {
        type: types.SET_SUBSIDIARY,
        data: subsidiaryKeys
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

export const changeConvertAll = (checked) => {
    return {
        type: types.CHANGE_CONVERT_ALL,
        data: checked
    }
}

export const changeIncludeDrawData = (checked) => {
    return {
        type: types.CHANGE_INCLUDE_DRAW_DATA,
        data: checked
    }
}

export const setParams = (params) => {
    return {
        type: types.SET_PARAMS,
        data: params
    }
}