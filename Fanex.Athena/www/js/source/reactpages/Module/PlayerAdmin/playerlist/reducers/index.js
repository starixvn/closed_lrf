import { combineReducers } from 'redux';
import * as filterHandlerReducer from './filterHandlerReducer.js'
import * as loaderReducer from '../../../../reducers/loaderReducer'

export default combineReducers(Object.assign(
    filterHandlerReducer,
    loaderReducer
));