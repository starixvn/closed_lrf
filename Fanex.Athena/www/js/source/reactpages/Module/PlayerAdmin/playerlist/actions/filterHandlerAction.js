import { SET_PARAM, SET_PLAYER_LIST } from './types'
import PlayerListService from '../lib/playerListService';
import { setSelectedPlayer, setTabList } from './commonAction';

export const searchPlayer = (param) => (dispatch) => {
    let service = new PlayerListService();
    service.getPlayerList(param).then(result => {
        const { playerList, tabList } = result;
        dispatch(setPlayerList(playerList));
        dispatch(setTabList(tabList));

        if (playerList.length === 1) {
            dispatch(setSelectedPlayer(playerList[0].CustId));
        }
    })
}

const setPlayerList = (data) => {
    return {
        type: SET_PLAYER_LIST,
        data
    }
}

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}