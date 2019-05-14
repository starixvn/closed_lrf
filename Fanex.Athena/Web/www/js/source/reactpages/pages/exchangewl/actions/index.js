import * as dataHandlerAction from './dataHandlerAction.js'
import * as filterHandlerAction from './filterHandlerAction.js'
import * as currencyAction from '../../../actions/currencyAction'
import * as loaderAction from '../../../actions/loaderAction'
import * as excludeTestAction from '../../../actions/excludeTestAction'
import * as dateRangeAction from '../../../actions/dateRangeAction'

export const ActionCreators = Object.assign({},
    dataHandlerAction,
    filterHandlerAction,
    currencyAction,
    loaderAction,
    excludeTestAction,
    dateRangeAction
);