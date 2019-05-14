import { combineReducers } from 'redux';
import * as gridDataReducer from '@jsroot/reducers/gridDataReducer.js'
import * as usernameReducer from '@jsroot/reducers/usernameReducer'
import * as productReducer from '@jsroot/reducers/productReducer'
import * as currencyReducer from '@jsroot/reducers/currencyReducer'
import * as baseCurrencyReducer from '@jsroot/reducers/baseCurrencyReducer'
import * as loaderReducer from '@jsroot/reducers/loaderReducer'
import * as requestParamReducer from '@jsroot/reducers/requestParamReducer'
import * as reportTitleReducer from '@jsroot/reducers/reportTitleReducer'
import * as statusReducer from '@jsroot/reducers/statusReducer'
import * as convertAllReducer from '@jsroot/reducers/convertAllReducer'

export default combineReducers(Object.assign(
    gridDataReducer,
    usernameReducer,
    productReducer,
    currencyReducer,
    baseCurrencyReducer,
    loaderReducer,
    requestParamReducer,
    reportTitleReducer,
    statusReducer,
    convertAllReducer
));