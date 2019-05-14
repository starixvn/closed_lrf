import FactoryCommonService from '../../../lib/factoryCommonService';
import { systemType } from '../../../constants/configInfo';

const apiInfo = {
    accountProfile: { action: 'api/PlayerLog/GetAccountProfile', type: systemType.lrf },
    custBettingStatus: { action: 'PlayerAccountInfo/GetCustomerBettingStatus', type: systemType.newAdmin }
}

export default class PlayerAccountService {
    constructor() {
        this.commonService = FactoryCommonService.createInstance();
    }

    getAccountInfo(param) {
        const { accountProfile } = apiInfo;
        const params = {...param };

        return this.commonService.fetchData(accountProfile.type, accountProfile.action, params);
    }

    getCustomerBettingStatus(param) {
        const { custBettingStatus } = apiInfo;
        const params = {...param };

        return this.commonService.fetchData(custBettingStatus.type, custBettingStatus.action, params);
    }
}