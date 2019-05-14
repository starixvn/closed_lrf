import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import { DateRange } from '../../../components/date-range/index'
import LangHelper from '../../../lib/langHelper'
import Site from '@jsroot/lib/site'
import AppData from '@jsroot/lib/AppData'
import { ReportLevel } from '../../../constants/report'
import { BaseCurrency } from '../../../constants/currency'
import ReportExcel from '../lib/reportExcel'
import { Service } from '../lib/service'
import moment from 'moment'

const RANGE_MONTH_CONSTRAINT = 3;

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

        this.props.toggleLoader(true);
        this.props.getGridData(params, () => {
            Service.showErrorMsg();
            this.props.toggleLoader(false);
        });

        this.props.setParams(params.data);
    }

    exportExcel = (event) => {
        event.preventDefault();

        const level = this.props.gridData.level || 0;

        const isAllowedCustomerComm = this.props.isAllowedCustomerComm;
        const params = this._getParams();
        if (!params) {
            return;
        }
     
        this.props.toggleLoader(true);
        if (level === ReportLevel.MAIN) {            
            this.props.exportExcel(params)
                .then(response => this._doExportExcel(level, params.data, isAllowedCustomerComm, response.data))
                .catch(() => {
                    Service.showErrorMsg();
                    this.props.toggleLoader(false);
                });
        }
        else {
            this._doExportExcel(level, params.data, isAllowedCustomerComm, this.props.gridData.data);
        }
    }

    _doExportExcel(level, params, isAllowedCustomerComm, gridData) {
        if (!gridData || !gridData.DataList.length) {
            this.props.toggleLoader(false);
            alert(LangHelper.getSingleResource("NoInfo"));
            return;
        }

        let excelData;
        if (level === ReportLevel.MAIN) {
            excelData = params;
        }
        else {
            const firstRow = gridData.DataList[0];
            const drillDownDate = Service.getDrilldownDateRange(params.ReportBy, params.FromDate, params.ToDate, firstRow.Date);

            excelData = {
                FromDate: Site.convertDateToString(moment(drillDownDate.fromDate)),
                ToDate: Site.convertDateToString(moment(drillDownDate.toDate)),
                BaseCurrency: gridData.AdditionalInfo,
                CurrencyName: firstRow.CurrencyName,
                CurrencyId: firstRow.CurrencyId,
                ReportBy: params.ReportBy
            };
        }

        const title = Service.getReportTitle(
            { fromDate: excelData.FromDate, toDate: excelData.ToDate }, 
            excelData.BaseCurrency ? excelData.BaseCurrency : excelData.CurrencyName , 
            level === ReportLevel.MAIN ? excelData.CurrencyId === 0 : false);
        const excel = new ReportExcel(gridData, title, level, isAllowedCustomerComm, excelData.ReportBy);
        excel.export(() => {
            this.props.toggleLoader(false);
        });
    }

    _getParams() {
        let param = {};

        const { fromDate, toDate } = this.props.dateRange;
        const baseCurrency = BaseCurrency.find(x => x.value === this.props.selectedCurrency.value);

        param = {
            CurrencyId: this.props.selectedCurrency.value,
            BaseCurrency: baseCurrency ? baseCurrency.text : "",
            CurrencyName: baseCurrency ? baseCurrency.text : this.props.selectedCurrency.label,
            FromDate: Site.convertDateToString(fromDate),
            ToDate: Site.convertDateToString(toDate),
            ReportBy: this.props.selectedReportBy,
            ExcludeTestData: this.props.isExcludeTest,
            Level: 0
        };
        
        return {
            data: param
        };
    }

    applyDateRangeHandler = (date, isValidMonthRange = true) => {
        if (isValidMonthRange) {
            this.props.setDateRange(date);
        }
        else {
            const message = LangHelper.getSingleResource('DateRangeExceedMsg').replace('{0}', RANGE_MONTH_CONSTRAINT);
            alert(message);
        }
    }

    changeReportBy = (event) => {
        const newValue = parseInt(event.target.value, 10);
        if (!isNaN(newValue) && this.props.selectedReportBy !== newValue) {
            this.props.setReportBy(newValue);
        }
    }

    _renderDateRange() {
        const { dateRange } = this.props;
        const dateConstraint = AppData.dateConstraint;
        return (
            <DateRange startDate={dateRange.fromDate} endDate={dateRange.toDate}
                minDate={dateConstraint.minDate} maxDate={dateConstraint.maxDate}
                today={dateConstraint.toDay} limitedMonthRange={RANGE_MONTH_CONSTRAINT}
                onChange={this.applyDateRangeHandler} />
        );
    }

    _renderCurrencySelectList() {
        const { selectedCurrency } = this.props;
        const currencyList = AppData.currencyList;
        return <Select instanceId='ddlCurrency'
            name='form-field-name'
            value={selectedCurrency}
            options={currencyList}
            onChange={(item) => this.props.setSelectedCurrency(item)} />
    }

    _renderReportByOption() {
        const { reportByOption, selectedReportBy } = this.props;

        return (<div className='form-group'>
            <label className='label-text'>{LangHelper.getSingleResource('ReportBy')}</label>
            {   
                reportByOption.map((option, i) => {
                    const key = 'ReportBy' + i;
                    return (<span key={`Group${key}`}>
                        <input type='radio' value={option.value} checked={selectedReportBy === option.value} id={key}
                            onChange={this.changeReportBy} />
                        <label htmlFor={key}>{option.label}</label>
                    </span>)  
                })
            }
        </div>);
    }

    _renderExcludeTestDataCheckBox() {
        return (<div className="checkbox-group">
            <input type="checkbox" className="checkbox" checked={this.props.isExcludeTest} id="ExcludeTest"
                   onChange={() => this.props.changeIsExcludeTest(!this.props.isExcludeTest)} />
            <label style={{marginLeft: "0px"}} htmlFor="ExcludeTest">{LangHelper.getSingleResource("ExcludeTestData")}</label>
        </div>);
    }

    render() {
        return (
            <div className='page-filter'>
                <div className='row'>
                    <div className='col-12 col-sm-7 col-md-4 col-xl-3'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('Date')}</label>
                            {this._renderDateRange()}
                        </div>
                    </div>

                     <div className='col-12 col-sm-4 col-md-2 col-xl-2'>
                        <div className='form-group'>
                            <label className='label-text'>{LangHelper.getSingleResource('Currency')}</label>
                            {this._renderCurrencySelectList()}
                        </div>
                    </div>

                    <div className='col-12 col-sm-4 col-md-2 col-xl-2'>
                        {this._renderReportByOption()}
                    </div>

                    <div className='col-12 col-sm-3 col-md-2 col-xl-2'>
                        <div className="form-group">
                           {this._renderExcludeTestDataCheckBox()}
                        </div>
                    </div>

                    <div className='col-12 col-sm-3 col-md-2 col-xl-2'>
                        <div className='form-group button-group'>
                            <button type='button' className='btn btn-submit' onClick={this.submit}>{LangHelper.getSingleResource('Submit')}</button>
                        </div>
                    </div>
                </div>
                <div className='caret-block'>
                    <i className='icon-excel right' onClick={this.exportExcel} title={LangHelper.getSingleResource('ExportToExcel')}></i>
                </div> 
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
};

function mapStateToProps(state) {
    const { licenseeId, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);