import * as types from './types'

export const setReportTitle = (title) => {
    return {
        type: types.SET_REPORT_TITLE,
        data: title
    };
}