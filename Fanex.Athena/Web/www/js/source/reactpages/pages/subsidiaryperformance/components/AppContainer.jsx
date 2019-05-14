import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index'
import DataGrid from './DataGrid'
import FormFilter from './FormFilter'
import Loader from '../../../components/Loader'
import AppLayout from '../../../layouts/AppLayout'
import ReportTitle from '../../../components/ReportTitle'
import { Service, BreadcrumbText } from '../lib/service'
import { Breadcrumb } from '@9softstudio/react-breadcrumb'
import { ReportLevel } from '../../../constants/report'

export class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.reportTitle = null;
    this.breadcrumbItems = [{
        label: BreadcrumbText.Main,
        value: ReportLevel.MAIN,
    }, {
        label: BreadcrumbText.Customer,
        value: ReportLevel.CUSTOMER,
    }];
  }

  componentDidUpdate(prevProps) {
      if (prevProps.params.Timestamp !== this.props.params.Timestamp) {
          const { FromDate, ToDate, BaseCurrency } = this.props.params;
          this.reportTitle = Service.getReportTitle(FromDate, ToDate, BaseCurrency);
      }
  }

  _backToMain = () => {
      let params = Object.assign({}, this.props.params);

      params.Timestamp = new Date().getTime();
      params.Level = ReportLevel.MAIN;
      params.SubsidiaryId = 0;

      this.props.setParams(params);
  }

  render() {
    return (
      <AppLayout>
        <Loader isLoading={this.props.isLoading} />
        <FormFilter />
        <div className="result-content">
            <Breadcrumb items={this.breadcrumbItems} value={this.props.params.Level} onChange={this._backToMain} />
            {this.reportTitle && <ReportTitle content={this.reportTitle} />}
            <DataGrid />
        </div>
      </AppLayout>
    );
  }
}

function mapDispatchToProps(dispatch) {
    const { setParams } = ActionCreators;
    return bindActionCreators({ setParams }, dispatch);
}

function mapStateToProps(state) {
  const { isLoading, params } = state;
  return Object.assign({}, { isLoading, params });
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);