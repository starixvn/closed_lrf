import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const selectedCurrency = createReducer({}, {
    [types.SET_SELECTED_CURRENCY](state, action) {
        return action.data
    }
});