import FactoryCommonService from '../../../lib/factoryCommonService';
import { systemType } from '../../../constants/configInfo';

const apiInfo = {
    lrfAccountProfile: { action: 'api/PlayerDetailedInfo/GetAccountProfile', type: systemType.lrf },
    custBettingStatus: { action: 'api/PlayerDetailedInfo/GetCustomerBettingStatus', type: systemType.lrf },
    lapAccountProfile: { action: 'PlayerAccountInfo/GetAccountProfile', type: systemType.newAdmin }
}

export default class PlayerAccountService {
    constructor() {
        this.commonService = FactoryCommonService.createInstance();
    }

    getAccountInfo(param) {
        const { lrfAccountProfile, lapAccountProfile } = apiInfo;
        const params = {...param };

        const lrfPromise = this.commonService.fetchData(lrfAccountProfile.type, lrfAccountProfile.action, params);

        const ajaxConfig = { method: 'get' };
        const lapPromise = this.commonService.fetchData(lapAccountProfile.type, lapAccountProfile.action, params, ajaxConfig);

        return this.commonService.fetchMultiple([lrfPromise, lapPromise], (lrfResponse, lapResponse) => {
            const lrfAccountInfo = lrfResponse.data;
            const lapAccountInfo = lapResponse.data;

            return {...lrfAccountInfo, ...lapAccountInfo };
        });
    }

    getCustomerBettingStatus(param) {
        const { custBettingStatus } = apiInfo;
        const params = {...param };

        return this.commonService.fetchData(custBettingStatus.type, custBettingStatus.action, params);
    }
}