import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import LangHelper from '@jsroot/lib/langHelper'
import AppData from '@jsroot/lib/AppData'
import Site from '@jsroot/lib/site'

import { DateRange } from '@jsroot/components/date-range/index'
import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'
import AutoComplete from '@jsroot/components/auto-complete'
import CheckBox from '@jsroot/components/CheckBox'
import DataService from '@jsroot/lib/DataService.js'
import { Service } from '../lib/service'
import ReportExcel from '../lib/reportExcel'

const RANGE_MONTH_CONSTRAINT = 1;
const CUSTOMER_SEARCH_URL = Site.resolveClientUrl("SearchCustomerAPI/SearchCustomer");

const EXCEL_DATA_URL = Site.resolveClientUrl("api/CasinoTurnoverReport/GetData");
const URL = Site.resolveClientUrl("api/CasinoTurnoverReport/GetData");

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    get isValidModel() {
        return this.props.selectedProduct && this.props.selectedStatus;
    }

    onSubmit = () => {
        if (this.isValidModel) {
            this.props.toggleLoader(true);
            const params = this._getParams();
            const reportTitle = Service.getReportTitle(params.FromDate, params.ToDate, 
                params.CurrencyName,params.BaseCurrency);
            this.props.setReportTitle(reportTitle);
            this.props.setRequestParam(params);
            this.props.getGridData(URL, params);
        }
    }

    exportExcel = () => {
        const { dateRange, selectedCurrency, selectedBaseCurrency } = this.props;
        const params = Object.assign({ IsExportExcel: true }, this._getParams());

        this.props.toggleLoader(true);
        DataService.postData(EXCEL_DATA_URL, params).then(response => {
            if(response.data.Data.length === 0)
            {
                alert(LangHelper.getSingleResource("NoInfo"));
                this.props.toggleLoader(false);
                return;
            }

            const title = Service.getReportTitle(params.FromDate, params.ToDate, 
                params.CurrencyName,params.BaseCurrency);
            const excel = new ReportExcel(response.data, title, selectedBaseCurrency);
            excel.export(() =>{
                this.props.toggleLoader(false);
            });
        });
    }

    onDateRangeChange = (date, isValidMonthRange = true) => {
        if (isValidMonthRange) {
            this.props.setDateRange(date);
        }
        else {
            const message = LangHelper.getSingleResource('DateRangeExceedMsg').replace('{0}', RANGE_MONTH_CONSTRAINT);
            alert(message);
        }
    }

    onProductChange = (currentItem, selectedItemsKey) => {
        this.props.setSelectedProduct(selectedItemsKey)
    }

    onStatusChange = (currentItem, selectedItemsKey) => {
        this.props.setSelectedStatus(selectedItemsKey)
    }

    _getParams() {
        const { dateRange, selectedCurrency, selectedBaseCurrency, isConvertAll, selectedProduct, username, selectedStatus, requestParam } = this.props;

        return {
            FromDate: Site.convertDateToString(dateRange.fromDate),
            ToDate: Site.convertDateToString(dateRange.toDate),
            CurrencyId: selectedCurrency.value,
            CurrencyName: selectedCurrency.label,
            BaseCurrency: selectedBaseCurrency,
            IsConvertAll: isConvertAll,
            ProductCode: selectedProduct.split(','),
            UserName: username,
            Status: selectedStatus.split(','),
            PageIndex: 1,
            PageSize: requestParam.PageSize
        }
    }

    _renderDateRange() {
        const dateRange = this.props.dateRange;
        const dateConstraint = AppData.dateConstraint;

        return (
            <DateRange 
                startDate={dateRange.fromDate} 
                endDate={dateRange.toDate}
                minDate={dateConstraint.minDate} 
                maxDate={dateConstraint.maxDate}
                today={dateRange.toDate}
                limitedMonthRange={RANGE_MONTH_CONSTRAINT}
                onChange={this.onDateRangeChange} />
        )
    }

    _renderCurrency() {
        const selectedCurrency = this.props.selectedCurrency;
        const currencyList = AppData.currencyList;

        return currencyList && currencyList.length && (
            <Select instanceId='ddlCurrency'
                    name='Currency'
                    value={selectedCurrency.value}
                    options={currencyList}
                    onChange={(item) => this.props.setSelectedCurrency(item)} />
        );
    }

    _renderBaseCurrency() {
        const selectedBaseCurrency = this.props.selectedBaseCurrency;
        const baseCurrencyList = AppData.baseCurrencyList;

        return baseCurrencyList && baseCurrencyList.length && (
            <Select instanceId='ddlBased'
                    name='BaseCurrency'
                    value={selectedBaseCurrency}
                    options={baseCurrencyList}
                    onChange={(item) => this.props.setSelectedBaseCurrency(item.value)} />
        );
    }

    _renderConvertAll() {
        return (
            <CheckBox id="IsConvertAll"
                checked={this.props.isConvertAll}
                onChange={(checked) => this.props.changeIsConvertAll(checked)}
                label={LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")} />
            );
    }

    _renderProduct() {
        const productOptions = AppData.productOptions;

        return productOptions && productOptions.length && (
            <MultipleSelect id='ProductList'
                language={LangHelper.currentLanguage}
                dataSource={productOptions}
                keyField={'Code'}
                valueField={'Name'}
                statusField={'Status'}
                onChange={this.onProductChange} />
        );
    }

    _renderUserName() {
        return (
        <AutoComplete url={CUSTOMER_SEARCH_URL} 
            onSelect={(value) => this.props.setUsername(value)}
            onInput={(value) => this.props.setUsername(value)}
            htmlAttributes={{placeholder:LangHelper.getSingleResource('ExternalIdOrSystemId')}} />
        );
    }

    _renderStatus() {
        const statusList = AppData.statusList;

        return statusList && statusList.length && (
            <MultipleSelect id='StatusList'
                language={LangHelper.currentLanguage}
                dataSource={statusList}
                keyField={'Code'}
                valueField={'Name'}
                statusField={'Status'}
                onChange={this.onStatusChange} />
        );
    }

    render() {
        const { selectedProduct, selectedStatus } = this.props;

        return (
            <div className='page-filter'>
                <div className='row'>
                    <div className='col-12 col-md-6 col-sm-12 col-lg-3 col-xl-3'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('Date')}</label>
                            {this._renderDateRange()}
                        </div>
                    </div>
                    <div className='col-12 col-md-4 col-sm-12 col-lg-3 col-xl-2'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('Currency')}</label>
                            {this._renderCurrency()}
                        </div>
                    </div>
                    <div className='col-12 col-md-3 col-sm-12 col-lg-3 col-xl-2'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('BaseCurrency')}</label>
                            {this._renderBaseCurrency()}
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-3">
                        <div className="form-group">
                            {this._renderConvertAll()}
                        </div>    
                    </div>
                    <div className='col-12 col-md-4 col-sm-12 col-lg-3 col-xl-3'>
                        <div className={`form-group ${selectedProduct ? '' : 'invalid'}`}>
                            <label className='label-text'>{LangHelper.getSingleResource('Product')} *</label>
                            {this._renderProduct()}
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-sm-12 col-lg-3 col-xl-2'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('Username')}</label>
                            {this._renderUserName()}
                        </div>
                    </div>
                    <div className='col-12 col-md-4 col-sm-12 col-lg-3 col-xl-2'>
                        <div className={`form-group ${selectedStatus ? '' : 'invalid'}`}>
                            <label className='label-text'>{LangHelper.getSingleResource('Status')} *</label>
                            {this._renderStatus()}
                        </div>
                    </div>
                    <div className='col-12 col-md-3 col-sm-12 col-lg-3 col-xl-3'>
                        <div className='form-group'>
                            <div className='button-group'>
                                <button disabled={!this.isValidModel} type='button' className='btn btn-submit' onClick={this.onSubmit}>
                                    {LangHelper.getSingleResource('Submit')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='caret-block'>
                        <i className='icon-excel right' onClick={this.exportExcel} title={LangHelper.getSingleResource('ExportToExcel')}></i>
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
    const { ...rest } = state;
    return Object.assign({}, rest );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);