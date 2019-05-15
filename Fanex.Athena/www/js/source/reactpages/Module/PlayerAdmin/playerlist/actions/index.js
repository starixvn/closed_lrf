import * as loaderAction from '../../../../actions/loaderAction'
import * as filterHandlerAction from './filterHandlerAction';
import * as playerDetailHandlerAction from './playerDetailHandlerAction';
import * as commonAction from './commonAction';

export const ActionCreators = Object.assign({},
    loaderAction,
    commonAction,
    filterHandlerAction,
    playerDetailHandlerAction
);