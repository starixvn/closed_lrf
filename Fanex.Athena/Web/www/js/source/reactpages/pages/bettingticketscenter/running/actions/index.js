import * as gridDataAction from '@jsroot/actions/gridDataAction'
import * as usernameAction from '@jsroot/actions/usernameAction'
import * as productAction from '@jsroot/actions/productAction'
import * as currencyAction from '@jsroot/actions/currencyAction'
import * as baseCurrencyAction from '@jsroot/actions/baseCurrencyAction'
import * as loaderAction from '@jsroot/actions/loaderAction'
import * as requestParamAction from '@jsroot/actions/requestParamAction'
import * as reportTitleAction from '@jsroot/actions/reportTitleAction'
import * as statusAction from '@jsroot/actions/statusAction'
import * as convertAllAction from '@jsroot/actions/convertAllAction'

export const ActionCreators = Object.assign({},
    gridDataAction,
    usernameAction,
    productAction,
    currencyAction,
    baseCurrencyAction,
    loaderAction,
    requestParamAction,
    reportTitleAction,
    statusAction,
    convertAllAction
);