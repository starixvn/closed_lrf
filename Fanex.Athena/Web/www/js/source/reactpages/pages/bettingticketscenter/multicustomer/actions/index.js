import * as gridDataAction from '@jsroot/actions/gridDataAction'
import * as productAction from '@jsroot/actions/productAction'
import * as currencyAction from '@jsroot/actions/currencyAction'
import * as baseCurrencyAction from '@jsroot/actions/baseCurrencyAction'
import * as statusAction from '@jsroot/actions/statusAction'
import * as liveStatusAction from '@jsroot/actions/liveStatusAction'
import * as loaderAction from '@jsroot/actions/loaderAction'
import * as dateRangeAction from '@jsroot/actions/dateRangeAction'
import * as requestParamAction from '@jsroot/actions/requestParamAction'
import * as reportTitleAction from '@jsroot/actions/reportTitleAction'
import * as sportAction from './sportAction'
import * as bettypeAction from './bettypeAction'
import * as leagueAction from './leagueAction'
import * as matchAction from './matchAction'
import * as usernameAction from '@jsroot/actions/usernameAction'
import * as convertAllAction from '@jsroot/actions/convertAllAction'

export const ActionCreators = Object.assign({},
    gridDataAction,
    productAction,
    currencyAction,
    baseCurrencyAction,
    statusAction,
    liveStatusAction,
    loaderAction,
    dateRangeAction,
    requestParamAction,
    reportTitleAction,
    sportAction,
    bettypeAction,
    leagueAction,
    matchAction,
    usernameAction,
    convertAllAction
);