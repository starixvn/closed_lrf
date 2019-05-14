import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const dateRange = createReducer({}, {
    [types.SET_DATE_RANGE](state, action) {
        return action.data;
    }
})