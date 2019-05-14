import { combineReducers } from 'redux';
import * as filterHandlerReducer from './filterHandlerReducer.js'
import * as productReducer from '../../../reducers/productReducer'
import * as currencyReducer from '../../../reducers/currencyReducer'
import * as loaderReducer from '../../../reducers/loaderReducer'

export default combineReducers(Object.assign(
    filterHandlerReducer,
    productReducer,
    currencyReducer,
    loaderReducer
));