import { combineReducers } from 'redux';
import * as gridDataReducer from '@jsroot/reducers/gridDataReducer.js'
import * as productReducer from '@jsroot/reducers/productReducer'
import * as baseCurrencyReducer from '@jsroot/reducers/baseCurrencyReducer'
import * as usernameReducer from '@jsroot/reducers/usernameReducer'
import * as statusReducer from '@jsroot/reducers/statusReducer'
import * as platformReducer from '@jsroot/reducers/platformReducer'
import * as liveStatusReducer from '@jsroot/reducers/liveStatusReducer'
import * as loaderReducer from '@jsroot/reducers/loaderReducer'
import * as dateRangeReducer from '@jsroot/reducers/dateRangeReducer'
import * as convertAllReducer from '@jsroot/reducers/convertAllReducer'
import * as requestParamReducer from '@jsroot/reducers/requestParamReducer'
import * as reportTitleReducer from '@jsroot/reducers/reportTitleReducer'

export default combineReducers(Object.assign(
    gridDataReducer,
    productReducer,
    baseCurrencyReducer,
    usernameReducer,
    statusReducer,
    platformReducer,
    liveStatusReducer,
    loaderReducer,
    dateRangeReducer,
    convertAllReducer,
    requestParamReducer,
    reportTitleReducer
));