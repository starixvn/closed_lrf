import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const isExcludeTest = createReducer({}, {
    [types.CHANGE_IS_EXCLUDE_TEST](state, action) {
        return action.data;
    }
})