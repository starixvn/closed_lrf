import axios from 'axios'
import Site from '@jsroot/lib/site'

export default class DataService {

    static getData(url, params) {
        return axios.get(url, { params: params });
    }

    static postData(url, params) {
        return axios.post(url, params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                '__RequestVerificationToken': Site.getXsrfToken()
            }
        });
    }

    static postDataFromExternal(url, params) {
        return axios.post(url, params, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auth-Token': (params && params.token) || '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    static getFile(url, params) {
        return axios.post(url, params, {
            responseType: 'blob',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                '__RequestVerificationToken': Site.getXsrfToken()
            }
        });
    }
}