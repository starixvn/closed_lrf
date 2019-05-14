import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'
import { DateRange } from '@jsroot/components/date-range/index'
import AutoComplete from '@jsroot/components/auto-complete'
import CheckBox from '@jsroot/components/CheckBox'
import CollapsiblePanel from '@jsroot/components/collapsible-panel'

import { ActionCreators } from '../actions/index.js'
import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'
import AppData from '@jsroot/lib/AppData'
import DataService from '@jsroot/lib/DataService.js'
import ApiUrl from '../../common/constants/apiUrl'
import Service from '../../common/lib/Service'

export class FormFilter extends Component {
    constructor(props) {
        super(props);
    }

    get isValidModel() {
        return !!this.props.username && !!this.props.selectedProduct && !!this.props.selectedStatus && !!this.props.selectedLiveStatus;
    }

    submit = (event) => {
        event.preventDefault();
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setReportTitle(Service.getTitle(params.FromDate, params.ToDate, null, params.BaseCurrency));
        this.props.setRequestParam(params);
        this.props.toggleLoader(true);
        this.props.getGridData(ApiUrl.SINGLECUSTOMER_DATA_URL, params);
    }

    _getParams() {
        if (!this.isValidModel) {
            return null;
        }

        const { fromDate, toDate } = this.props.dateRange;
        const { PageSize, SortBy, SortOrder } = this.props.requestParam;

        return {
            PageSize: PageSize,
            PageIndex: 1,
            FromDate: Site.convertDateToString(fromDate),
            ToDate: Site.convertDateToString(toDate),
            ProductCodeList: this.props.selectedProduct,
            Username: this.props.username,
            BaseCurrency: this.props.isConvertAll ? this.props.selectedBaseCurrency : '',
            Status: this.props.selectedStatus,
            LiveStatus: this.props.selectedLiveStatus,
            Platform: this.props.selectedPlatform,
            SortBy: SortBy,
            SortOrder: SortOrder
        }
    }

    applyDateRangeHandler = (date, isValidMonthRange = true) => {
        if (isValidMonthRange) {
            this.props.setDateRange(date);
        }
        else {
            const message = LangHelper.getSingleResource("DateRangeExceedMsg").replace("{0}", AppData.dateConstraint.limitedMonthRange);
            alert(message);
        }
    }

    exportExcel = (event) => {
        event.preventDefault();
        
        const params = this._getParams();
        if (!params) {
            return;
        }

        params.IsExport = true;
        this.props.toggleLoader(true);
        DataService.getFile(ApiUrl.SINGLECUSTOMER_DATA_URL, params).then((response) => {
            const NoContentStatusCode = 204;

            if(response.status === NoContentStatusCode){
                alert(LangHelper.getSingleResource("NoInfo"));
            } else {
                Site.downloadFile(response.data, 'BettingTicketsCenter_SingleCustomer.xls');
            }
            this.props.toggleLoader(false);
        });
    }

    _renderDateRange() {
        const dateRange = this.props.dateRange;
        const dateConstraint = AppData.dateConstraint;

        return (
            <DateRange startDate={dateRange.fromDate} endDate={dateRange.toDate}
                minDate={dateConstraint.minDate} maxDate={dateConstraint.maxDate}
                today={dateRange.toDate} limitedMonthRange={dateConstraint.limitedMonthRange}
                onChange={this.applyDateRangeHandler} />
        )
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
                onChange={(currentItem, selectedItemsKey) => this.props.setSelectedProduct(selectedItemsKey)} />
        );
    }

    _renderBaseCurrencySelectList() {
        const baseCurrencyList = AppData.baseCurrencyList;

        return baseCurrencyList && baseCurrencyList.length && (
            <Select instanceId="ddlBased"
                value={this.props.selectedBaseCurrency}
                options={baseCurrencyList}
                onChange={(item) => this.props.setSelectedBaseCurrency(item.value)} />
        );
    }

    _renderStatusSelectList() {
        const statusList = AppData.statusList;

        return statusList && statusList.length && (
                <MultipleSelect id="StatusList"
                    language={LangHelper.currentLanguage}
                    dataSource={statusList}
                    keyField={"Id"}
                    valueField={"Value"}
                    statusField={"Status"}
                    onChange={(currentItem, selectedItemsKey) => this.props.setSelectedStatus(selectedItemsKey)} />);
    }

    _renderPlatformSelectList() {
        const platformList = AppData.platformList;

        return platformList && platformList.length && (
            <Select instanceId="PlatformList"
                value={this.props.selectedPlatform}
                options={platformList}
                onChange={(item) => this.props.setSelectedPlatform(item.value)} />
        );
    }

      _renderLiveStatusSelectList() {
          const liveStatusList = AppData.liveStatusList;

          return liveStatusList && liveStatusList.length && (
                      <MultipleSelect id="LiveStatusList"
                    language={LangHelper.currentLanguage}
                    dataSource={liveStatusList}
                    keyField={"Id"}
                    valueField={"Value"}
                    statusField={"Status"}
                    onChange={(currentItem, selectedItemsKey) => this.props.setSelectedLiveStatus(selectedItemsKey)} />);
      }

     render() {
     const excelButton = <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>
        return (
            <CollapsiblePanel className="page-filter" stickyFooter={excelButton}>
                <div className="row">

                     <div className="col-12 col-md-3 col-sm-3 col-lg-4 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Date")}</label>
                            {this._renderDateRange()}
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-4 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Product")}</label>
                            {this._renderProductSelectList()}
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("BaseCurrency")}</label>
                        {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-sm-3 col-lg-2 col-xl-3">
                        <div className="form-group">
                            <CheckBox id="IsConvertAll"
                        checked={this.props.isConvertAll}
                        onChange={(checked) => this.props.changeIsConvertAll(checked)}
                        label={LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")} />
                        </div>    
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-12 col-md-3 col-sm-3 col-lg-4 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Username")} *</label>
                            <AutoComplete url={ApiUrl.CUSTOMER_SEARCH_URL} 
                                onSelect={(value) => this.props.setUsername(value)}
                                onInput={(value) => this.props.setUsername(value)}
                                htmlAttributes={{placeholder:LangHelper.getSingleResource("ExternalIdOrSystemId")}} />
                        </div>
                    </div>

                     <div className="col-12 col-md-3 col-sm-3 col-lg-4 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Status")}</label>
                                {this._renderStatusSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Platform")}</label>
                        {this._renderPlatformSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-3 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Live")}</label>
                        {this._renderLiveStatusSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-2 col-lg-2 col-xl-1">
                        <div className="form-group">
                            <div className="button-group">
                            <button type="button" disabled={!this.isValidModel} className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsiblePanel>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
function mapStateToProps(state) {
    const { requestParam, dateRange, selectedProduct, selectedBaseCurrency, username, selectedStatus, selectedPlatform, selectedLiveStatus, isConvertAll } = state;
    return Object.assign({}, { requestParam, dateRange, selectedProduct, selectedBaseCurrency, username, selectedStatus, selectedPlatform, selectedLiveStatus, isConvertAll });
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);