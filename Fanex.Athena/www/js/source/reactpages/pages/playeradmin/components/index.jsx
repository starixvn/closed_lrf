import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './AppContainer.jsx'
import { Provider } from 'react-redux'
import reducer from '../reducers/index.js'
import Store from '../../../lib/store'

const defaultState = {...window.initialState};
const store = Store.createStore(reducer, defaultState);

const mode = window.__lrf && window.__lrf.modules && window.__lrf.modules.playerAdmin && window.__lrf.modules.playerAdmin.mode;
console.log(mode);

const App = React.memo(() => {
    return (
        <Provider store={store}>
          <AppContainer />
        </Provider>
      );
})

ReactDOM.render(<App />, document.getElementById("app-container"));