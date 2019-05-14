import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const isConvertAll = createReducer({}, {
    [types.CHANGE_IS_CONVERT_ALL](state, action) {
        return action.data;
    }
})