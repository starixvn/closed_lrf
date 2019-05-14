import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const isLoading = createReducer({}, {
    [types.TOGGLE_LOADER](state, action) {
        return action.data;
    }
})