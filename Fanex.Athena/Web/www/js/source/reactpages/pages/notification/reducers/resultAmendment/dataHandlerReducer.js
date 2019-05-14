import createReducer from '../../../../lib/createReducer'
import * as types from '../../actions/resultAmendment/types'

export const gridData = createReducer({}, {
    [types.SET_GRID_DATA](state, action) {
        return action.data;
    }
});