import * as types from './types.js'
import Report from '@jsroot/lib/report'

const relativeUrl = 'api/ExchangeWinLossReport/Index';

export function getGridData(params, errorHandler) {
    return (dispatch) => {
        Report.fetchGridData(relativeUrl, params).then(response => {
            dispatch(setGridData({
                level: params.data.Level,
                data: response.data
            }));
        }).catch(error => errorHandler(error));
    };
}

export function exportExcel(params) {
    return () => Report.fetchGridData(relativeUrl, params);
}

export function setGridData(data) {
    return {
        type: types.SET_GRID_DATA,
        data: data
    };
}