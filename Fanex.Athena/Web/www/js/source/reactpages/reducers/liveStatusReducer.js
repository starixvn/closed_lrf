import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const selectedLiveStatus = createReducer({}, {
    [types.SET_SELECTED_LIVESTATUS](state, action) {
        return action.data
    }
});