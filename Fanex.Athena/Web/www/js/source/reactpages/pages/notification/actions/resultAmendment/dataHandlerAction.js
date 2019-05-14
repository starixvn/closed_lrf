import * as types from './types.js'
import axios from 'axios'

import Site from '../../../../lib/site'

const header = () => {
    return {
        'X-Requested-With': 'XMLHttpRequest',
        '__RequestVerificationToken': Site.getXsrfToken()
    };
}

const fetchData = (params) => {
    const url = Site.resolveClientUrl('api/NotificationReport/ResultAmendment');
    return axios.post(url, params.data, {
        headers: header()
    });
}

const markNotification = (params) => {
    const url = Site.resolveClientUrl('api/NotificationReport/MarkNotificationAsRead');
    return axios.post(url, { MessageId: params.id, MessageType: params.type }, {
        headers: header()
    });
}

const downloadData = (params) => {
    const url = Site.resolveClientUrl('api/NotificationReport/DownLoadFileAttachment');
    return axios.post(url, { FileName: params.fileName } ,{
        headers: header(),
        responseType: 'blob'
    });
}

export function getGridData(params) {
    return (dispatch) => {
        fetchData(params).then(response => {
            dispatch(setGridData({
                Data: response.data.DataList,
                Total: response.data.TotalRows
            }));
        });
    };
}

export function setGridData(data) {
    return {
        type: types.SET_GRID_DATA,
        data: data
    };
}

export function markItemAsRead(params) {   
    return (dispatch) => {
        markNotification({ id: params.Id, type: params.Type, xsrfToken: Site.getXsrfToken()}).then(response => {
            if(response.data.IsSuccessful)
            {
                params.Data[params.Index].IsRead = true;

                dispatch(setGridData({
                    Data: params.Data,
                    Total: params.Total
                }));
            }
        });
    };
}

export function exportAttachment(params) {
    return () => downloadData(params);
}