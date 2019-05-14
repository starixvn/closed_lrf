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
import service from '../lib/service'
import { SettingConst } from '../constants/settingConst'
import UserGuide from '@jsroot/components/UserGuide'
import AppData from '@jsroot/lib/AppData'

const RANGE_MONTH_CONSTRAINT = 3;

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    get isValidModel() {
        return this.props.selectedProduct !== "";
    }

    submit = (event) => {
        event.preventDefault();
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.toggleLoader(true);
        this.props.getGridData(params);
    }

    exportExcel = (event) => {
        event.preventDefault();
        const { selectedTimeZone, dateRange, selectedCurrency, selectedBaseCurrency } = this.props;
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.toggleLoader(true);
        this.props.exportExcel(params).then(response => {
            if(response.data.Data.length === 0)
            {
                alert(LangHelper.getSingleResource("NoInfo"));
                this.props.toggleLoader(false);
                return;
            }

            const title = service.getReportTitle(selectedTimeZone, dateRange, selectedCurrency.label, selectedBaseCurrency, this.props.isConvertAll);
            const excel = new ReportExcel(response.data, title, this.props.selectedReportBy, this.props.groupBy, selectedBaseCurrency);
            excel.export(() =>{
                this.props.toggleLoader(false);
            });
        });
    }

    showUserGuide = () => {
        const userGuideContent = this.props.userGuideContent;

        if (!userGuideContent || userGuideContent.length === 0) {
            this.props.getUserGuideContent('LicenseeWLByTimeZone');
        }
    }

    changeGroupBy = (value) => {
        this.props.changeGroupBy(value);
        if (value === SettingConst.GroupByProduct && this.props.selectedCurrency.value === 0)
        {
            this.props.changeIsConvertAll(true);
        }
    }

    _getParams() {
        if (!this.isValidModel) {
            return null;
        }

        const { fromDate, toDate } = this.props.dateRange;

        return {
            data: {
                BaseCurrency: this.props.selectedBaseCurrency,
                CurrencyId: this.props.selectedCurrency.value,
                ProductCodeList: this.props.selectedProduct,
                IsConvertAll: this.props.isConvertAll,
                IsIncludeDrawData: this.props.isIncludeDrawData,
                FromDate: Site.convertDateToString(fromDate),
                ToDate: Site.convertDateToString(toDate),
                TimeZone: this.props.selectedTimeZone,
                ReportBy: this.props.selectedReportBy,
                GroupBy: this.props.groupBy,
                IsExcludeTestData: this.props.isExcludeTest
            }
        }
    }

    productChangeHandler = (currentItem, selectedItemsKey) => {
        this.props.setSelectedProduct(selectedItemsKey)
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

    _renderTimeZoneSelectList() {
        const { timeZoneList, selectedTimeZone } = this.props;

        return <Select instanceId="ddlTimeZone" value={selectedTimeZone} options={timeZoneList}
        onChange={(item) => this.props.setSelectedTimeZone(item.value)} />
    }

    _renderReportBySelectList() {
        const { reportByList, selectedReportBy } = this.props;

        return <Select instanceId="ddlReportBy" value={selectedReportBy} options={reportByList}
                onChange={(item) => this.props.setSelectedReportBy(item.value)} />
    }

    _renderProductSelectList() {
        const productOptions = AppData.productOptions;
        return productOptions && productOptions.length ? (
            <MultipleSelect id="ProductList"
                language={LangHelper.currentLanguage}
                dataSource={productOptions}
                keyField={"Code"}
                valueField={"Name"}
                statusField={"Status"}
                onChange={this.productChangeHandler} />
        ) : null;
    }

    _renderCurrencySelectList() {
        const { selectedCurrency } = this.props;
        const currencyList = AppData.currencyList;
        return <Select instanceId="ddlCurrency"
                value={selectedCurrency.value}
                options={currencyList}
                onChange={(item) => this.props.setSelectedCurrency(item)} />
    }

    _renderBaseCurrencySelectList() {
        const { selectedBaseCurrency } = this.props;
        const baseCurrencyList = AppData.baseCurrencyList;
        return baseCurrencyList && baseCurrencyList.length ? (
            <Select instanceId="ddlBased"
                value={selectedBaseCurrency}
                options={baseCurrencyList}
                onChange={(item) => this.props.setSelectedBaseCurrency(item.value)} />
        ) : null;
    }

    _renderDateRange() {
        const { dateRange, dateConstraint } = this.props;

        return (
            <DateRange startDate={dateRange.fromDate} endDate={dateRange.toDate}
                minDate={dateConstraint.minDate} maxDate={dateConstraint.maxDate}
                today={dateRange.toDate} limitedMonthRange={RANGE_MONTH_CONSTRAINT}
                onChange={this.applyDateRangeHandler} />
        )
    }

    _renderUserGuide() {
        const userGuideContent = this.props.userGuideContent;

        return (<UserGuide 
                title={LangHelper.getSingleResource("UserGuide")} 
                contentTitle={LangHelper.getSingleResource("WinLossByTimeZone")}
                onClick={this.showUserGuide}
                content={userGuideContent} />)
    }

    render() {
        return (
            <div className="page-filter">
                <div className="row">

                    <div className="col-12 col-md-4 col-sm-7 col-lg-3 col-xl-3">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Date")}</label>
                            {this._renderDateRange()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("TimeZone")}</label>
                            {this._renderTimeZoneSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-4 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Product")}</label>
                            {this._renderProductSelectList()}
                        </div>
                    </div>

                     <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Currency")}</label>
                            {this._renderCurrencySelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("BaseCurrency")}</label>
                            {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>

                </div>

                <div className="row">
                 <div className="col-12 col-md-4 col-sm-4 col-lg-3 col-xl-3">
                        <div className="form-group">
                               <label className="label-text">{LangHelper.getSingleResource("GroupBy")}</label>
                                <input type="radio" value={1} checked={this.props.groupBy == 1} name="GroupBy" id="GroupByProduct"
                                onChange={() => this.changeGroupBy(1) } />
                                <label htmlFor="GroupByProduct">{LangHelper.getSingleResource("Product")}</label>
                                <input type="radio" value={2} name="GroupBy" id="GroupByCurrency" checked={this.props.groupBy == 2}
                                        onChange={() => this.changeGroupBy(2)} />
                                <label htmlFor="GroupByCurrency">{LangHelper.getSingleResource("Currency")}</label>
                        </div>
                </div>
                 <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("ReportBy")}</label>
                           {this._renderReportBySelectList()}
                           </div>
                       </div>

                    <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                           <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={this.props.isIncludeDrawData} id="IncludeDrawData"
                                onChange={() => this.props.changeIsIncludeDrawData(!this.props.isIncludeDrawData)} />
                                <label htmlFor="IncludeDrawData">{LangHelper.getSingleResource("IncludeDrawData")}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-4 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={(this.props.groupBy === 1 && this.props.selectedCurrency.value == 0) || this.props.isConvertAll} id="IsConvertAll"
                                 disabled={this.props.groupBy === 1 && this.props.selectedCurrency.value == 0}
                                onChange={() => this.props.changeIsConvertAll(!this.props.isConvertAll)} />
                                <label htmlFor="IsConvertAll">{LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")}</label>

                            </div>
                        </div>
                        
                    </div>
                     <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                           <div className="checkbox-group">
                                <input type="checkbox" className="checkbox" checked={this.props.isExcludeTest} id="ExcludeTest"
                           onChange={() => this.props.changeIsExcludeTest(!this.props.isExcludeTest)} />
                           <label style={{marginLeft: "0px"}} htmlFor="ExcludeTest">{LangHelper.getSingleResource("ExcludeTestData")}</label>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    
                    <div className="col-12 col-md-1 col-sm-1 col-lg-1 col-xl-1">
                    <div className="form-group">
                        <div className="button-group">
                        <button disabled={!this.isValidModel} type="button" className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
                        </div>
                    </div>
                    </div>
                    <div className="caret-block">
                        <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>
                        {this._renderUserGuide()}
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
    const { gridData, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);