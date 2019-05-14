import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const selectedBaseCurrency = createReducer({}, {
    [types.SET_SELECTED_BASECURRENCY](state, action) {
        return action.data
    }
});

export const baseCurrencyList = createReducer({}, {
    [types.SET_BASECURRENCY_LIST](state, action) {
        return action.data
    }
});