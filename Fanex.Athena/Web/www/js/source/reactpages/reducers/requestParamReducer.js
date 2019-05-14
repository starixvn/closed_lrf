import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const requestParam = createReducer({}, {
    [types.SET_REQUEST_PARAM](state, action) {
        return action.data
    }
});