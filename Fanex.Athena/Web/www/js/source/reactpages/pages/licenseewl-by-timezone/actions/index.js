import * as dataHandlerAction from './dataHandlerAction.js'
import * as filterHandlerAction from './filterHandlerAction.js'
import * as productAction from '../../../actions/productAction'
import * as currencyAction from '../../../actions/currencyAction'
import * as baseCurrencyAction from '../../../actions/baseCurrencyAction'
import * as loaderAction from '../../../actions/loaderAction'
import * as excludeTestAction from '../../../actions/excludeTestAction'
import * as userGuideAction from '../../../actions/userGuideAction'

export const ActionCreators = Object.assign({},
    dataHandlerAction,
    filterHandlerAction,
    productAction,
    currencyAction,
    baseCurrencyAction,
    loaderAction,
    excludeTestAction,
    userGuideAction
);