import { SET_PARAM } from './types'
import playerlistservice from '../lib/playerlistservice';


export const searchPlayer = (param) => {
    let service = new playerlistservice();
}
export const gotoDetailedPlayerInfo = (param) => {

    let playerInfoService = new playerInfoService();

}
export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}