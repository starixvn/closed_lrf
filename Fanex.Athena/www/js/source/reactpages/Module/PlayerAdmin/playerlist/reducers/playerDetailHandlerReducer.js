import createReducer from '../../../../lib/createReducer.js'
import { SET_SELECTED_PLAYER } from '../actions/types.js'

export const selectedPlayer = createReducer(null, {
    [SET_SELECTED_PLAYER](preState, action) {
        return action.data;
    }
})