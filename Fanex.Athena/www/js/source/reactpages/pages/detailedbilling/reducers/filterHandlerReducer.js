import createReducer from '../../../lib/createReducer.js'
import * as types from '../actions/types.js'

export const dateRange = createReducer({}, {
    [types.SET_DATE_RANGE](state, action) {
        return action.data;
    }
})