import createReducer from '../../../lib/createReducer.js'
import { SET_PARAM } from '../actions/types.js'

export const params = createReducer({}, {
    [SET_PARAM](preState, action) {
        return {...action.data };
    }
})