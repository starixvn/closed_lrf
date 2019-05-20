import PlayerListService from '../lib/playerListService';

export const getLink = (systemType, action) => () => {
    const service = new PlayerListService();
    return service.getLink(systemType, action);
}

export const getTabList = () => () => {
    const service = new PlayerListService();
    return service.getTabList();
}