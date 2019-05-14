import React from 'react'
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer.jsx'
import { Provider } from 'react-redux'
import reducer from '../reducers/index.js'
import Store from '../../../lib/store'

const defaultState = Object.assign({}, window.initialState, { reportTitle: '' }, { params: { SortBy: 'Date', SortOrder: 'asc' }});
const store = Store.createStore(reducer, defaultState);

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