import createReducer from '../../../../lib/createReducer.js'
import { SET_PARAM, SET_PLAYER_LIST } from '../actions/types.js'

export const param = createReducer({}, {
    [SET_PARAM](preState, action) {
        return {...action.data };
    }
})

export const playerList = createReducer(null, {
    [SET_PLAYER_LIST](preState, action) {
        return [...action.data];
    }
})