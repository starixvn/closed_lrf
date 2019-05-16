import * as baseCurrencyAction from '@jsroot/actions/baseCurrencyAction'
import * as loaderAction from '@jsroot/actions/loaderAction'
import * as filterHandlerAction from './filterHandlerAction'
import * as userGuideAction from '@jsroot/actions/userGuideAction'
import * as requestParamAction from  '@jsroot/actions/requestParamAction'

export const ActionCreators = Object.assign({},
    baseCurrencyAction,
    loaderAction,
    filterHandlerAction,
    userGuideAction,
    requestParamAction
);