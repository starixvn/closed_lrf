import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'
import MonthPicker from '@jsroot/components/month-picker/index'
import AppData from '@jsroot/lib/AppData'

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    submit = (event) => {
        event.preventDefault();

        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setRequestParam(params);
    }

    exportExcel = (event) => {
        event.preventDefault();
    }

    _getParams = () => {
        const { fromDate, toDate } = this.props.dateRange;

        return {
            FromDate: Site.convertDateToString(fromDate),
            ToDate: Site.convertDateToString(toDate),
            BaseCurrency: this.props.selectedBaseCurrency.value,
            Timestamp : new Date().getTime()
        }
    }

    _renderBaseCurrencySelectList() {
        const { selectedBaseCurrency } = this.props;
        const baseCurrencyList = AppData.baseCurrencyList;
        return <Select instanceId='ddlBaseCurrency'
            value={selectedBaseCurrency.value}
            options={baseCurrencyList}
            onChange={(item) => this.props.setSelectedBaseCurrency(item)} />
    }

    _monthPickerHandle = (dateRange) => {
        this.props.setDateRange(dateRange);
    }

    _renderMonthPicker() {
        const { dateRange } = this.props;
        const dateConstraint = AppData.dateConstraint;

        const monthOption = {
            label: LangHelper.getSingleResource('BillingMonth')
        };

        return <MonthPicker
            minDate={dateConstraint.minDate}
            maxDate={dateConstraint.maxDate}
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}

            onChange={this._monthPickerHandle}

            monthOption={monthOption}
            showDate={false} />;
    }

    render() {
        return (
            <div className='page-filter'>
                <div className='row'>
                    <div className='col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2'>
                        <div className='form-group'>
                            {this._renderMonthPicker()}
                        </div>
                    </div>
                    <div className='col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('BaseCurrency')}</label>
                            {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>
                    <div className='col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2'>
                        <div className='form-group'>
                            <div className='button-group'>
                                <button type='button' className='btn btn-submit' onClick={this.submit}>{LangHelper.getSingleResource('Submit')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='caret-block'>
                        <i className='icon-excel right' onClick={this.exportExcel} title={LangHelper.getSingleResource('ExportToExcel')}></i>
                    </div>
                </div>

                <div className='row'>
                   <div className='col-1' style={{flex: '0 0 4%'}}>
                       {LangHelper.getSingleResource('Note')}:
                    </div>
                    <div className='col-9'>
                        * {LangHelper.getSingleResource('DetailedBilling_InvoiceNode')}
                        <br />
                        * {LangHelper.getSingleResource('DetailedBilling_BaseCurrency')}
                    </div>
               </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
function mapStateToProps(state) {
    const { isLoading, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);