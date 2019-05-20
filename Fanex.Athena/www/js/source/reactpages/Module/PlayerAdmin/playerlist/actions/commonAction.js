import { SET_SELECTED_PLAYER } from './types';

export const setSelectedPlayer = (data) => {
    return {
        type: SET_SELECTED_PLAYER,
        data
    }
}