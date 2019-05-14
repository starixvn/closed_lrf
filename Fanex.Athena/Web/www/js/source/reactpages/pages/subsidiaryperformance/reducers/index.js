import { combineReducers } from 'redux';
import * as filterHandlerReducer from './filterHandlerReducer.js'
import * as productReducer from '../../../reducers/productReducer'
import * as baseCurrencyReducer from '../../../reducers/baseCurrencyReducer'
import * as loaderReducer from '../../../reducers/loaderReducer'
import * as excludeTestReducer from '../../../reducers/excludeTestReducer'

export default combineReducers(Object.assign(
    filterHandlerReducer,
    productReducer,
    baseCurrencyReducer,
    loaderReducer,
    excludeTestReducer
));