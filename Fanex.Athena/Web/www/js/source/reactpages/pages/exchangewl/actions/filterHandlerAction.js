import * as types from './types.js'

export const setReportBy = (value) => {
    return {
        type: types.SET_REPORTBY,
        data: value
    }
}

export const setParams = (value) => {
    return {
        type: types.SET_PARAM,
        data: value
    }
}