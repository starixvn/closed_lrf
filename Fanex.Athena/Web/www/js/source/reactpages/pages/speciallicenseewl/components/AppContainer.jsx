import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index'
import FormFilter from './FormFilter'
import DataGrid from './DataGrid'
import Loader from '../../../components/Loader'
import AppLayout from '../../../layouts/AppLayout'
import ReportTitle from '../../../components/ReportTitle'

export class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppLayout>
        <Loader isLoading={this.props.isLoading} />
        <FormFilter />
        <div className='result-content'>
            { this.props.reportTitle && <ReportTitle content={this.props.reportTitle} /> }
            <DataGrid />
        </div>
      </AppLayout>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, { isLoading: state.isLoading, reportTitle: state.reportTitle });
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);