import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'
import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'
import Report from '@jsroot/lib/report'
import { Service, Url } from '../lib/service'
import ReportExcel from '../lib/reportExcel'
import MonthPicker from '@jsroot/components/month-picker/index'
import AppData from '@jsroot/lib/AppData'

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    get isValidModel() {
        return this.props.selectedProduct !== "";
    }

    submit = (event) => {
        event.preventDefault();
        if (!this.isValidModel) {
            return;
        }

        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setParams(params);
    }

    exportExcel = (event) => {
        event.preventDefault();

        let params = this._getParams();
        if (!params) {
            return;
        }

        this.props.toggleLoader(true);

        Report.fetchGridData(Url, { xsrfToken: this.props.xsrfToken, data: params })
            .then(response => {
                this._doExportExcel(params, response.data);
            })
            .catch(error => {
                Service.showErrorMsg();
                this.props.toggleLoader(false);
            });

    }

    _doExportExcel(params, gridData) {
        if (!gridData.Data || !gridData.Data.length) {
            this.props.toggleLoader(false);
            alert(LangHelper.getSingleResource("NoInfo"));
            return;
        }

        if (gridData.Data.length > 1) {
            Service.sort(gridData.Data, params.SortBy, params.SortOrder);
        }

        const title = Service.getReportTitle(
            params.FromDate,
            params.ToDate,
            params.CurrencyId,
            params.CurrencyName,
            params.BaseCurrency);
        const excel = new ReportExcel(gridData, title, parseInt(params.ReportBy, 10), params.ProductCodeList);
        excel.export(() => {
            this.props.toggleLoader(false);
        });
    }

    _getParams() {
        if (!this.props.xsrfToken) {
            return null;
        }

        const { fromDate, toDate } = this.props.dateRange;

        return {
            FromDate: Site.convertDateToString(fromDate),
            ToDate: Site.convertDateToString(toDate),
            CurrencyName: this.props.selectedCurrency.label,
            CurrencyId: this.props.selectedCurrency.value,
            BaseCurrency: this.props.selectedCurrency.baseCurrency,
            ProductCodeList: this.props.selectedProduct.split(','),
            ReportBy: this.props.selectedReportBy,
            SortBy: this.props.params.SortBy,
            SortOrder: this.props.params.SortOrder,
            Timestamp : new Date().getTime()
        }
    }

    productChangeHandler = (currentItem, selectedItemsKey) => {
        this.props.setSelectedProduct(selectedItemsKey);
    }

    _renderReportByOption() {
        const { reportByList, selectedReportBy } = this.props;

        return (
            <div className="form-group">
                <label className='label-text'>{LangHelper.getSingleResource('ReportBy')}</label>
                {
                    reportByList.map((option, i) => {
                        const key = 'ReportBy' + i;
                        return (
                            <span key={`Group${key}`}>
                                <input type='radio' value={option.value} checked={selectedReportBy === option.value} id={key}
                                    onChange={(event) => this.props.setSelectedReportBy(event.target.value)} />
                                <label htmlFor={key}>{option.label}</label>
                            </span>)
                    })
                    }
            </div>
        );
                    }

    _renderProductSelectList() {
        const productOptions = AppData.productOptions;
        return productOptions && productOptions.length && (
            <MultipleSelect id="ProductList"
                language={LangHelper.currentLanguage}
                dataSource={productOptions}
                keyField={"Code"}
                valueField={"Name"}
                statusField={"Status"}
                onChange={this.productChangeHandler} />
        );
                    }

    _renderCurrencySelectList() {
        const { selectedCurrency } = this.props;
        const currencyList = AppData.currencyList;
        return <Select instanceId="ddlCurrency"
            value={selectedCurrency.value}
            options={currencyList}
            onChange={(item) => this.props.setSelectedCurrency(item)} />
                    }

    _monthPickerHandle = (dateRange) => {
        this.props.setDateRange(dateRange);
                    }

    _renderMonthPicker() {
        const { dateRange } = this.props;
        const dateConstraint = AppData.dateConstraint;

        const monthOption = {
            label: LangHelper.getSingleResource('ViewDataInMonth')
        };

        const fromDateOption = {
            label: LangHelper.getSingleResource('From'),
            id: 'FromDateInput'
        };
        const toDateOption = {
            label: LangHelper.getSingleResource('To'),
            id: 'ToDateInput'
        };

        return <MonthPicker
            minDate={dateConstraint.minDate}
            maxDate={dateConstraint.maxDate}
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}

            onChange={this._monthPickerHandle}

            monthOption={monthOption}
            fromDateOption={fromDateOption}
            toDateOption={toDateOption} />;
    }

    render() {
        return (
            <div className="page-filter">
                <div className="row">
                    <div className="col-12 col-md-5 col-sm-12 col-lg-5 col-xl-5">
                        <div className="form-group">
                            {this._renderMonthPicker()}
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Currency")}</label>
                            {this._renderCurrencySelectList()}
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-sm-12 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Product")}</label>
                            {this._renderProductSelectList()}
                        </div>
                    </div>
                    <div className='col-12 col-md-5 col-sm-12 col-lg-2 col-xl-3'>
                        {this._renderReportByOption()}
                    </div>
                    <div className="col-12 col-md-3 col-sm-12 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <div className="button-group">
                                <button disabled={!this.isValidModel} type="button" className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="caret-block">
                        <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>
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
    const { gridData, reportTitle, isLoading, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);