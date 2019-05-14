import * as types from './types'
import axios from 'axios'
import Site from '../lib/site'

const fetchData = (resourceName) => {
    const url = Site.resolveClientUrl('UserGuide/Index?resourcename=' + resourceName) + "&_=" + (new Date().getTime());
    return axios.get(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

export function getUserGuideContent(params) {
    return (dispatch) => {
        fetchData(params).then(response => {
            dispatch(setUserGuideContent(response.data));
        });
    };
}

export const setUserGuideContent = (data) => {
    return {
        type: types.USER_GUIDE_CONTENT,
        data: data
    }
}