import FactoryCommonService from '../../../lib/factoryCommonService';
import { systemType } from '../../../constants/configInfo';

const apiInfo = {
    playerList: { action: 'api/PlayerMain/GetPlayerList', type: systemType.lrf }
}

export default class PlayerListService {
    constructor() {
        this.commonService = FactoryCommonService.createInstance();
    }

    getPlayerList(param) {
        const { playerList } = apiInfo;
        const ajaxConfig = {
            method: 'GET'
        }
        const params = { userName: '', ...param };

        return this.commonService.fetchData(playerList.type, playerList.action, params, ajaxConfig);
    }

    getLink(systemType, action) {
        return this.commonService.getLink(systemType, action);
    }
}