import * as filterHandlerAction from './filterHandlerAction.js'
import * as productAction from '../../../actions/productAction'
import * as baseCurrencyAction from '../../../actions/baseCurrencyAction'
import * as loaderAction from '../../../actions/loaderAction'
import * as excludeTestAction from '../../../actions/excludeTestAction'

export const ActionCreators = Object.assign({},
    filterHandlerAction,
    productAction,
    baseCurrencyAction,
    loaderAction,
    excludeTestAction
);