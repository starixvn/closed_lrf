import * as filterHandlerAction from './filterHandlerAction.js'
import * as gridDataAction from '@jsroot/actions/gridDataAction'
import * as usernameAction from '@jsroot/actions/usernameAction'
import * as baseCurrencyAction from '@jsroot/actions/baseCurrencyAction'
import * as loaderAction from '@jsroot/actions/loaderAction'
import * as convertAllAction from '@jsroot/actions/convertAllAction'
import * as requestParamAction from '@jsroot/actions/requestParamAction'
import * as reportTitleAction from '@jsroot/actions/reportTitleAction'

export const ActionCreators = Object.assign({},
    gridDataAction,
    filterHandlerAction,
    usernameAction,
    baseCurrencyAction,
    loaderAction,
    convertAllAction,
    requestParamAction,
    reportTitleAction
);