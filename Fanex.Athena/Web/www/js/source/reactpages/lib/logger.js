import { createLogger } from 'redux-logger'
import { debuggingConfig } from '../constants/config'

const isDev = process.env.NODE_ENV === "development";
const configName = debuggingConfig.name;
// middleware that logs actions
const loggerMiddleware = createLogger({
    predicate: (getState, action) => isDev ||
        (window[configName] &&
            window[configName].env === debuggingConfig.env &&
            (!window[configName].actionFilter || window[configName].actionFilter === action.type))
});

export default class Logger {
    static getLoggerMiddleware() {
        return loggerMiddleware;
    }
}