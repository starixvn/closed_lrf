import { combineReducers } from 'redux';
import * as filterHandlerReducer from './filterHandlerReducer.js';
import * as baseCurrencyReducer from '@jsroot/reducers/baseCurrencyReducer';
import * as loaderReducer from '@jsroot/reducers/loaderReducer';
import * as userGuideReducer from '@jsroot/reducers/userGuideReducer';
import * as requestParamReducer from '@jsroot/reducers/requestParamReducer';

export default combineReducers(Object.assign(
    filterHandlerReducer,
    baseCurrencyReducer,
    loaderReducer,
    userGuideReducer,
    requestParamReducer
));