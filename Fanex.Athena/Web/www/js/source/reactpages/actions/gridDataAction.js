import * as types from '@jsroot/actions/types.js'
import DataService from '@jsroot/lib/DataService.js'
import { toggleLoader } from '@jsroot/actions/loaderAction'

export function getGridData(url, params) {
    return (dispatch) => {
        DataService.postData(url, params)
            .then(response => {
                response.data.timestamp = new Date().getTime();
                dispatch(setGridData(response.data));
            })
            .catch(error => {
                alert("Sorry, an error occurred while processing your request.");
                dispatch(toggleLoader(false));
            });
    };
}

export function setGridData(data) {
    return {
        type: types.SET_GRID_DATA,
        data: data
    };
}