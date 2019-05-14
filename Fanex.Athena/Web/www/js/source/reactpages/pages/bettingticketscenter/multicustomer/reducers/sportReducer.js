import * as types from '../actions/types'
import createReducer from '@jsroot/lib/createReducer.js'

export const selectedSport= createReducer({}, {
    [types.SET_SELECTED_SPORT](state, action) {
        return action.data
    }
});

export const sportList = createReducer({}, {
    [types.SET_SPORT_LIST](state, action) {
        return action.data;
    }
});