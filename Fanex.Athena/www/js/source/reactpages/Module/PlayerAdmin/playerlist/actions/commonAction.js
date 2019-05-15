import { SET_SELECTED_PLAYER, SET_TAB_LIST } from './types';

export const setSelectedPlayer = (data) => {
    return {
        type: SET_SELECTED_PLAYER,
        data
    }
}

export const setTabList = (data) => {
    return {
        type: SET_TAB_LIST,
        data
    }
}