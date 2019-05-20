import BaseCommonService from './baseCommonService';
import { systemType } from '../constants/configInfo';
import axios from 'axios'
import qs from 'qs';

const defaultAjaxConfig = {
    method: 'post',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded'
    },
    withCredentials: false,
    responseType: 'json',
    cancelToken: new axios.CancelToken(function(cancel) {})
}

class LapCommonService extends BaseCommonService {
    constructor(initialConfig) {
        super();

        const { baseUrl, applyLinkTokenUrl, applyApiTokenUrl, tabList } = initialConfig;
        this._applyLinkTokenUrl = applyLinkTokenUrl;
        this._applyApiTokenUrl = applyApiTokenUrl;
        this._baseUrl = baseUrl;
        this._tabList = tabList || [];
    }

    getTabList() {
        return [...this._tabList];
    }

    _buildApplyTokenQueryString(sysType, action) {
        return `ActionLink=${encodeURIComponent(action)}&Type=${sysType}`;
    }

    getLink(sysType, action) {
        return sysType === systemType.newAdmin ? this._baseUrl + action :
            `${this._applyLinkTokenUrl}?${this._buildApplyTokenQueryString(sysType, action)}`;
    }

    _buildCommonAjaxConfig(configOption, apiActionUrl, params) {
        const commonConfig = {
            ...configOption,
            url: apiActionUrl
        };

        const configWithParam = this._getConfigParam(commonConfig, params);

        return configWithParam;
    }

    _getConfigParam(config, params) {
        const isGetMethod = config.method.toLowerCase() === 'get';
        const paramConfig = isGetMethod ? { params } : { data: qs.stringify(params) };

        return {
            ...config,
            ...paramConfig
        }
    }

    _fetchDataWithToken(sysType, action, params, configOption) {
        const apiToken = `${this._applyApiTokenUrl}?${this._buildApplyTokenQueryString(sysType, action)}`;

        return axios.get(apiToken)
            .then(response => {
                const { Token, ApiUrl } = response.data;
                const apiActionUrl = `${ApiUrl}/${action}`;

                const commonAjaxConfig = this._buildCommonAjaxConfig(configOption, apiActionUrl, params);
                const headerConfig = {
                    ...configOption.headers,
                    'X-Auth-Token': Token
                }

                const configWithXToken = {...commonAjaxConfig, headers: {...headerConfig } };

                return axios(configWithXToken);
            });
    }

    fetchData(sysType, action, params, configOption = defaultAjaxConfig) {
        const config = {...defaultAjaxConfig, ...configOption };
        if (sysType === systemType.newAdmin) {
            const relativeUrl = this._baseUrl + action;
            const ajaxConfig = this._buildCommonAjaxConfig(config, relativeUrl, params);

            return axios(ajaxConfig);
        } else {
            return this._fetchDataWithToken(sysType, action, params, config);
        }
    }

    fetchMultiple(promiseList, callback) {
        if (promiseList && promiseList.length) {
            return axios.all(promiseList)
                .then(axios.spread(callback));
        }
    }
}

export default LapCommonService