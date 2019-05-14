import * as filterHandlerAction from './filterHandlerAction.js'
import * as productAction from '../../../actions/productAction'
import * as currencyAction from '../../../actions/currencyAction'
import * as loaderAction from '../../../actions/loaderAction'

export const ActionCreators = Object.assign({},
    filterHandlerAction,
    productAction,
    currencyAction,
    loaderAction
);