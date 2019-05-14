import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import Logger from './logger'

export default class Store {
    static createStore(reducer, initialState) {
        const loggerMiddleware = Logger.getLoggerMiddleware();

        const enhancer = compose(
            applyMiddleware(
                thunkMiddleware, // lets us dispatch() functions
                loggerMiddleware
            )
        );

        return createStore(reducer, initialState, enhancer);
    }
}
