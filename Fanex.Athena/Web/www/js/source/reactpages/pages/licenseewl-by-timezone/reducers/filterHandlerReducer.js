import createReducer from '../../../lib/createReducer.js'
import * as types from '../actions/types.js'

export const timeZoneList = createReducer({}, {
    [types.GET_TIMEZONE](state, action) {
        return action.data;
    }
})

export const selectedTimeZone = createReducer({}, {
    [types.SET_TIMEZONE](state, action) {
        return action.data;
    }
})

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

export const groupBy = createReducer({}, {
    [types.CHANGE_GROUPBY](state, action) {
        return action.data;
    }
})

export const isConvertAll = createReducer({}, {
    [types.CHANGE_IS_CONVERT_ALL](state, action) {
        return action.data;
    }
})

export const isIncludeDrawData = createReducer({}, {
    [types.CHANGE_IS_INCLUDE_DRAW_DATA](state, action) {
        return action.data;
    }
})

export const dateConstraint = createReducer({}, {
    [types.GET_DATE_CONSTRAINT](state, action) {
        return action.data;
    }
})