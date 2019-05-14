import PlayerAccountService from "../lib/playerAccountService";

const getAccountInfo = (param) => () => {
    const service = new PlayerAccountService();

    return service.getAccountInfo(param);
}

const getCustomerBettingStatus = (param) => () => {
    const service = new PlayerAccountService();

    return service.getCustomerBettingStatus(param);
}

export const ActionCreators = {
    getAccountInfo,
    getCustomerBettingStatus
}