import createReducer from '../../../lib/createReducer.js'
import * as types from '../actions/types.js'

export const reportByOption = createReducer({}, {
    [types.GET_REPORTBY](state, action) {
        return action.data;
    }
})

export const selectedReportBy = createReducer({}, {
    [types.SET_REPORTBY](state, action) {
        return action.data;
    }
})

export const params = createReducer({}, {
    [types.SET_PARAM](state, action) {
        return action.data;
    }
})

export const licenseeId = createReducer({}, {
    [types.GET_LICENSEE](state, action) {
        return action.data;
    }
})

export const isAllowedCustomerComm = createReducer({}, {
    [types.GET_ISALLOWED_CUSTOMERCOMM](state, action) {
        return action.data;
    }
})