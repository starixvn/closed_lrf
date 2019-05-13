import axios from 'axios'

export default class LapDataService {
    static getData(url, params, config = {}) {
        return axios.get(url, { params: params }, config);
    }

    static postData(url, params, config = {}) {
        const requiredConfig = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const postConfig = {...requiredConfig, ...config };

        return axios.post(url, params, postConfig);
    }

    static fetchDataWithAuthToken(token, configOption = {}) {
        const requiredConfig = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auth-Token': token
            }
        };

        const config = {...requiredConfig, ...configOption };

        return axios(config);
    }
}