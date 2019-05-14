import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'
import { DateRange } from '@jsroot/components/date-range/index'
import LangHelper from '@jsroot/lib/langHelper'
import ReportExcel from '../lib/reportExcel'
import Site from '@jsroot/lib/site'
import AppData from '@jsroot/lib/AppData'
import { Service, Api } from '../lib/service'
import { ReportLevel } from '../../../constants/report'
import Report from '../../../lib/report'

const RANGE_MONTH_CONSTRAINT = 3;

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    get isValidModel() {
        const { selectedSubsidiary, selectedProduct } = this.props;
        return (!AppData.subsidiaryList || selectedSubsidiary !== "") && selectedProduct !== "";
    }

    submit = (event) => {
        event.preventDefault();
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setParams(params);
    }

    exportExcel = (event) => {
        event.preventDefault();

        const isCustomerLevel = this.props.params.Level == ReportLevel.CUSTOMER
        const params = isCustomerLevel ? this.props.params : this._getParams();
        if (!params) {
            return;
        }

        this.props.toggleLoader(true);

        Report.fetchGridData(isCustomerLevel ? Api.DetailUrl : Api.Url, { xsrfToken: this.props.xsrfToken, data: params })
            .then(response => {
                if (!response.data.Data.length) {
                    alert(LangHelper.getSingleResource("NoInfo"));
                    this.props.toggleLoader(false);
                    return;
                }

                const title = Service.getReportTitle(params.FromDate, params.ToDate, params.BaseCurrency);
                const excel = new ReportExcel(response.data, title, isCustomerLevel, params.BaseCurrency);
                excel.export(() =>{
                    this.props.toggleLoader(false);
                });
            })
            .catch(error => {
                Service.showErrorMsg();
                this.props.toggleLoader(false);
            });
    }

    _getParams() {
        if (!this.isValidModel) {
            return null;
        }

        const { fromDate, toDate } = this.props.dateRange;

        return {
                BaseCurrency: this.props.selectedBaseCurrency,
                SubsidiaryList: this.props.selectedSubsidiary,
                ProductCodeList: this.props.selectedProduct,
                ConvertAll: this.props.convertAll,
                FromDate: Site.convertDateToString(fromDate),
                ToDate: Site.convertDateToString(toDate),
                IncludeRaw: this.props.includeDrawData,
                IsExcludeTest: this.props.isExcludeTest,
                Timestamp: new Date().getTime(),
                Level: ReportLevel.MAIN
        }
    }

    productChangeHandler = (currentItem, selectedItemsKey) => {
        this.props.setSelectedProduct(selectedItemsKey)
    }

    subsidiaryChangeHandler = (currentItem, selectedItemsKey) => {
        this.props.setSelectedSubsidiary(selectedItemsKey)
    }

    applyDateRangeHandler = (date, isValidMonthRange = true) => {
        if (isValidMonthRange) {
            this.props.setDateRange(date);
        }
        else {
            const message = LangHelper.getSingleResource("DateRangeExceedMsg").replace("{0}", RANGE_MONTH_CONSTRAINT);
            alert(message);
        }
    }

    _renderSubsidiarySelectList() {
        const subsidiaryList = AppData.subsidiaryList;

        return subsidiaryList && subsidiaryList.length ? (
            <MultipleSelect
                language={LangHelper.currentLanguage}
                hasSearchBox={true}
                dataSource={subsidiaryList}
                keyField={"Name"}
                valueField={"Name"}
                statusField={"Checked"}
                onChange={this.subsidiaryChangeHandler} />
        ) : null;
    }

    _renderProductSelectList() {
        const productOptions = AppData.productOptions;
        return productOptions && productOptions.length && (
            <MultipleSelect
                language={LangHelper.currentLanguage}
                dataSource={productOptions}
                keyField={"Code"}
                valueField={"Name"}
                statusField={"Status"}
                onChange={this.productChangeHandler} />
        );
    }

    _renderBaseCurrencySelectList() {
        const { selectedBaseCurrency } = this.props;
        const baseCurrencyList = AppData.baseCurrencyList;
        return baseCurrencyList && baseCurrencyList.length && (
            <Select id="ddlBased"
                name="BaseCurrency"
                value={selectedBaseCurrency}
                options={baseCurrencyList}
                onChange={(item) => this.props.setSelectedBaseCurrency(item.value)} />
        );
    }

    _renderDateRange() {
        const dateRange = this.props.dateRange;
        const dateConstraint = AppData.dateConstraint;

        return (
            <DateRange startDate={dateRange.fromDate} endDate={dateRange.toDate}
                minDate={dateConstraint.minDate} maxDate={dateConstraint.maxDate}
                today={dateRange.toDate} limitedMonthRange={RANGE_MONTH_CONSTRAINT}
                onChange={this.applyDateRangeHandler} />
        )
    }

    render() {
        let subsidiaryDropdown = false;
        if(AppData.subsidiaryList) {
            subsidiaryDropdown = 
                (<div className="col-12 col-md-3 col-sm-5 col-lg-3 col-xl-3">
                    <div className="form-group">
                        <label className="label-text">{LangHelper.getSingleResource("Subsidiary")}</label>
                    {this._renderSubsidiarySelectList()}
                    </div>
                </div>)
        }

        return (
            <div className="page-filter">
                <div className="row">

                    {subsidiaryDropdown}

                    <div className={`col-12 col-md-4 ${subsidiaryDropdown ? 'col-sm-6' : 'col-sm-5' } col-lg-3 col-xl-3`}>
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Date")}</label>
                            {this._renderDateRange()}
                        </div>
                    </div>

                    <div className={`col-12 col-md-3 ${subsidiaryDropdown ? 'col-sm-5' : 'col-sm-4' } col-lg-3 col-xl-3`}>
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Product")}</label>
                            {this._renderProductSelectList()}
                        </div>
                    </div>

                    <div className={`col-12 ${subsidiaryDropdown ? 'col-sm-4 col-md-2' : 'col-sm-3 col-md-3' } col-lg-2 col-xl-2`}>
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("BaseCurrency")}</label>
                            {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className={`col-12 ${subsidiaryDropdown ? 'col-md-3' : 'col-md-4' } col-sm-5 col-lg-3 col-xl-3`}>
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={this.props.convertAll} id="IsConvertAll"
                                    onChange={() => this.props.changeConvertAll(!this.props.convertAll)} />
                                <label htmlFor="IsConvertAll">{LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")}</label>
                            </div>
                        </div>
                    </div>

                    <div className={`col-12 ${subsidiaryDropdown ? 'col-md-4 col-sm-6' : 'col-md-3 col-sm-4' } col-lg-3 col-xl-3`}>
                        <div className="form-group">
                           <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={this.props.includeDrawData} id="IncludeDrawData"
                                    onChange={() => this.props.changeIncludeDrawData(!this.props.includeDrawData)} />
                                <label htmlFor="IncludeDrawData">{LangHelper.getSingleResource("IncludeDrawData")}</label>
                            </div>
                        </div>
                    </div>

                    <div className={`col-12 ${subsidiaryDropdown ? 'col-sm-5 col-lg-3 col-xl-3' : 'col-sm-3 col-lg-2 col-xl-2' } col-md-3`}>
                        <div className="form-group">
                           <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={this.props.isExcludeTest} id="ExcludeTest"
                                    onChange={() => this.props.changeIsExcludeTest(!this.props.isExcludeTest)} />
                                <label htmlFor="ExcludeTest">{LangHelper.getSingleResource("ExcludeTestData")}</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-4 col-lg-2 col-xl-2">
                        <div className="button-group">
                            <button disabled={!this.isValidModel} type="button" className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
                        </div>
                    </div>
                </div>

                <div className="caret-block">
                    <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>
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