import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class AppLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="container" className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}