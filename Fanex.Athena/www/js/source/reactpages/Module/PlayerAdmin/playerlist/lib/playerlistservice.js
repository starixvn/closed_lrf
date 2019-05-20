import FactoryCommonService from '../../../lib/factoryCommonService';
import { systemType } from '../../../constants/configInfo';

const apiInfo = {
    lrfPlayerList: { action: 'api/PlayerMain/Search', type: systemType.lrf },
    lapPlayerList: { action: 'PlayerAdminContainer/Search', type: systemType.newAdmin }
}

export default class PlayerListService {
    constructor() {
        this.commonService = FactoryCommonService.createInstance();
    }

    getTabList() {
        return this.commonService.getTabList();
    }

    _mergePlayerList(lrfList, lapList) {
        const result = [];

        for (let i = 0; i < lrfList.length; i++) {
            const lrfItem = lrfList[i];
            const lapItem = lapList.find(x => x.CustId === lrfItem.CustId);

            if (lrfItem && lapItem) {
                result.push({...lrfItem, ...lapItem });
            }
        }

        return result;
    }

    getPlayerList(param) {
        const { lrfPlayerList, lapPlayerList } = apiInfo;
        const params = { userName: '', ...param };

        const lrfPromise = this.commonService.fetchData(lrfPlayerList.type, lrfPlayerList.action, {...params });
        const lapPromise = this.commonService.fetchData(lapPlayerList.type, lapPlayerList.action, {...params });

        return this.commonService.fetchMultiple([lrfPromise, lapPromise], (lrfResponse, lapResponse) => {
            const lrfPlayerList = lrfResponse.data;
            const lapResponseData = lapResponse.data;

            const playerList = this._mergePlayerList(lrfPlayerList, lapResponseData.PlayerList);

            return {
                playerList,
                tabList: lapResponseData.TabList
            };
        })
    }

    getLink(systemType, action) {
        return this.commonService.getLink(systemType, action);
    }
}