import { combineReducers } from 'redux';
import * as dataHandlerReducer from './dataHandlerReducer.js'
import * as filterHandlerReducer from './filterHandlerReducer.js'
import * as productReducer from '../../../reducers/productReducer'
import * as currencyReducer from '../../../reducers/currencyReducer'
import * as baseCurrencyReducer from '../../../reducers/baseCurrencyReducer'
import * as loaderReducer from '../../../reducers/loaderReducer'
import * as excludeTestReducer from '../../../reducers/excludeTestReducer'
import * as userGuideReducer from '../../../reducers/userGuideReducer'

export default combineReducers(Object.assign(
    dataHandlerReducer,
    filterHandlerReducer,
    productReducer,
    currencyReducer,
    baseCurrencyReducer,
    loaderReducer,
    excludeTestReducer,
    userGuideReducer
));