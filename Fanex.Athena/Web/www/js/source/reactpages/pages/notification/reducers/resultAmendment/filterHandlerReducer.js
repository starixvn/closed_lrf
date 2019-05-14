import createReducer from '../../../../lib/createReducer'
import * as types from '../../actions/resultAmendment/types'

export const dateRange = createReducer({}, {
    [types.SET_DATE_RANGE](state, action) {
        return action.data;
    }
})

export const dateConstraint = createReducer({}, {
    [types.GET_DATE_CONSTRAINT](state, action) {
        return action.data;
    }
})

export const param = createReducer({}, {
    [types.SET_PARAM](state, action) {
        return action.data;
    }
})

export const licenseeName = createReducer({}, {
    [types.GET_LICENSEE_NAME](state, action) {
        return action.data;
    }
})