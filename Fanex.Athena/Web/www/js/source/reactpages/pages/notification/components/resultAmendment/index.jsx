import React from 'react'
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer.jsx'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from '../../reducers/resultAmendment'
import { debuggingConfig } from '../../../../constants/config'

const isDev = process.env.NODE_ENV === "development";
const configName = debuggingConfig.name;
// middleware that logs actions
const loggerMiddleware = createLogger({
    predicate: (getState, action) => isDev ||
      (window[configName] &&
        window[configName].env === debuggingConfig.env &&
        (!window[configName].actionFilter || window[configName].actionFilter === action.type))
});

const defaultState = Object.assign({}, window.initialState);

function configureStore(initialState) {
    const enhancer = compose(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware,
      ),
    );

    return createStore(reducer, initialState, enhancer);
}

const store = configureStore(defaultState);

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <Provider store={store}>
            <AppContainer />
          </Provider>
    );
}
}

ReactDOM.render(<App />, document.getElementById("app-container"));