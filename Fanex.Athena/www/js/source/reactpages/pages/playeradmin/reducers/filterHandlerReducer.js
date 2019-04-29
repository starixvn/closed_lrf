import createReducer from '../../../lib/createReducer.js'
import { SET_PARAM } from '../actions/types.js'

export const param = createReducer({}, {
    [SET_PARAM](preState, action) {
        return {...action.data };
    }
})

export const menuList = createReducer([], {})