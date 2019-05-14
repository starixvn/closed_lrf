import * as loaderAction from '../../../../actions/loaderAction'
import * as filterHandlerAction from './filterHandlerAction';
import * as playerDetailHandlerAction from './playerDetailHandlerAction';

export const ActionCreators = Object.assign({},
    loaderAction,
    filterHandlerAction,
    playerDetailHandlerAction
);