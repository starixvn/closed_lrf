import * as types from '../actions/types'
import createReducer from '@jsroot/lib/createReducer.js'

export const selectedMatch = createReducer({}, {
    [types.SET_SELECTED_MATCH](state, action) {
        return action.data
    }
});

export const matchList = createReducer({}, {
    [types.SET_MATCH_LIST](state, action) {
        return action.data;
    }
});