import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index'
import FormFilter from './FormFilter'
import DataGrid from './DataGrid'
import Loader from '../../../components/Loader'
import AppLayout from '../../../layouts/AppLayout'

export class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppLayout>
        <Loader isLoading={this.props.isLoading} />
        <FormFilter />
        <DataGrid />
      </AppLayout>
    );
  }
}

function mapStateToProps(state) {
    return Object.assign({}, { isLoading: state.isLoading });
}

export default connect(mapStateToProps)(AppContainer);