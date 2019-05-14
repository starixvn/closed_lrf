import * as types from '../actions/types'
import createReducer from '../lib/createReducer.js'

export const userGuideContent = createReducer({}, {
    [types.USER_GUIDE_CONTENT](state, action) {
        return action.data;
    }
})