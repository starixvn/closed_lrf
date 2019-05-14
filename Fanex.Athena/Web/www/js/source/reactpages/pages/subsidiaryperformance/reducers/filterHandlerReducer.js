import createReducer from '../../../lib/createReducer.js'
import * as types from '../actions/types.js'

export const selectedSubsidiary = createReducer({}, {
    [types.SET_SUBSIDIARY](state, action) {
        return action.data;
    }
})

export const dateRange = createReducer({}, {
    [types.SET_DATE_RANGE](state, action) {
        return action.data;
    }
})

export const convertAll = createReducer({}, {
    [types.CHANGE_CONVERT_ALL](state, action) {
        return action.data;
    }
})

export const includeDrawData = createReducer({}, {
    [types.CHANGE_INCLUDE_DRAW_DATA](state, action) {
        return action.data;
    }
})

export const params = createReducer({}, {
    [types.SET_PARAMS](state, action) {
        return action.data;
    }
})