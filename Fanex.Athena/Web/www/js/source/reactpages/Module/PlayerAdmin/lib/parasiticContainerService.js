import BaseContainerService from './baseContainerService';
import { systemType, tokenUrlTemplate } from '../constants/configInfo';
import LapDataService from '../lib/lapDataService';

const buildExternalTabLink = (sType, action) => {
    const applyTokenUrl = (Identity && Identity.ApplyTokenUrl) || '';

    return `${applyTokenUrl}?ActionLink=${action}&Type=${sType}`;
}

const buildApiTokenAction = (sType, action) => {
    return sType === systemType.newAdmin ? action :
        tokenUrlTemplate && tokenUrlTemplate.replace('{0}', encodeURIComponent(action)).replace('{1}', sType);
}

class ParasiticContainerService extends BaseContainerService {
    constructor() {
        super();
    }

    getTabLink(sType, action) {
        return sType === systemType.newAdmin ? action : buildExternalTabLink(sType, action);
    }

    fetchData(sType, action, ajaxConfig = {}) {
        const tokenApiAction = buildApiTokenAction(sType, action);

        return LapDataService.getData(tokenApiAction, {})
            .then(response => {
                const apiActionUrl = `${response.data.ApiUrl}/${action}`;
                return LapDataService.fetchDataWithAuthToken(response.data.Token, {...ajaxConfig, url: apiActionUrl });
            })
    }
}

export default ParasiticContainerService