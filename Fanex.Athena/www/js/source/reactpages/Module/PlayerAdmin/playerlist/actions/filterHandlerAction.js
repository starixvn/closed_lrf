import { SET_PARAM, SET_PLAYER_LIST } from './types'
import PlayerListService from '../lib/playerListService';

export const searchPlayer = (param) => (dispatch) => {
    let service = new PlayerListService();
    service.getPlayerList(param).then(response => {
        dispatch(setPlayerList(response.data));
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