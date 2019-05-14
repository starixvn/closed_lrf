import BaseContainerService from './baseContainerService';
import { systemType, tokenUrlTemplate } from '../constants/configInfo';
import LapDataService from '../lib/lapDataService';
import axios from 'axios'

const buildExternalTabLink = (sType, action) => {
    const applyTokenUrl = (Identity && Identity.ApplyTokenUrl) || '';

    return `${applyTokenUrl}?ActionLink=${action}&Type=${sType}`;
}

const buildApiTokenAction = (sType, action) => {
    return sType === systemType.newAdmin ? action :
        tokenUrlTemplate && tokenUrlTemplate.replace('{0}', encodeURIComponent(action)).replace('{1}', sType);
}

class LapCommonService extends BaseCommonService {
    constructor(initialConfig) {
        super();

        this._applyTokenUrl = initialConfig.ApplyTokenUrl;
        this._tokenUrl = initialConfig.tokenUrl;
    }

    getTabLink(sType, action) {
        return sType === systemType.newAdmin ? action : buildExternalTabLink(sType, action);
    }

    _getData(url, params, config = {}) {
        return axios.get(url, { params: params }, config);
    }

    _postData(url, params, config = {}) {
        const requiredConfig = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const postConfig = {...requiredConfig, ...config };

        return axios.post(url, params, postConfig);
    }

    fetchData(sType, action, method = 'POST') {
        const tokenApiAction = buildApiTokenAction(sType, action);

        return LapDataService.getData(tokenApiAction, {})
            .then(response => {
                const apiActionUrl = `${response.data.ApiUrl}/${action}`;
                return LapDataService.fetchDataWithAuthToken(response.data.Token, {...ajaxConfig, url: apiActionUrl });
            })
    }
}

export default LapCommonService