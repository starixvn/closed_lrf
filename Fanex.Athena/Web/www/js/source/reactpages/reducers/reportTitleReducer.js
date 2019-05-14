import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const reportTitle = createReducer({}, {
    [types.SET_REPORT_TITLE](state, action) {
        return action.data;
    }
})