import createReducer from '../../../lib/createReducer.js'
import * as types from '../actions/types.js'

export const reportByList = createReducer({}, {
    [types.GET_REPORTBY](state, action) {
        return action.data;
    }
})

export const selectedReportBy = createReducer({}, {
    [types.SET_REPORTBY](state, action) {
        return action.data;
    }
})

export const dateRange = createReducer({}, {
    [types.SET_DATE_RANGE](state, action) {
        return action.data;
    }
})

export const xsrfToken = createReducer({}, {
    [types.GET_XSRF_TOKEN](state, action) {
        return action.data;
    }
})

export const params = createReducer({}, {
    [types.SET_PARAMS](state, action) {
        return action.data;
    }
})

export const reportTitle = createReducer({}, {
    [types.SET_REPORT_TITLE](state, action) {
        return action.data;
    }
})