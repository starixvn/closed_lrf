import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'
import AutoComplete from '@jsroot/components/auto-complete'
import CollapsiblePanel from '@jsroot/components/collapsible-panel'
import CheckBox from '@jsroot/components/CheckBox'

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

        this.baseCurrencyList = AppData.baseCurrencyList;
        this.defaultBaseCurrency = props.selectedBaseCurrency;
    }

    get isValidModel() {
        return !!this.props.selectedProduct && !!this.props.selectedStatus && !!this.props.selectedCurrency;
    }

    submit = (event) => {
        event.preventDefault();
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setReportTitle(Service.getTitle(null, null, params.CurrencyName, params.BaseCurrency));
        this.props.setRequestParam(params);
        this.props.toggleLoader(true);
        this.props.getGridData(ApiUrl.RUNNING_DATA_URL, params);
    }

    _getParams() {
        if (!this.isValidModel) {
            return null;
        }

        const { PageSize, SortBy, SortOrder } = this.props.requestParam;

        return {
            PageSize: PageSize,
            PageIndex: 1,
            ProductCodeList: this.props.selectedProduct,
            Username: this.props.username,
            CurrencyIdList: this.props.selectedCurrency,
            BaseCurrency: this.props.selectedBaseCurrency,
            Status: this.props.selectedStatus,
            SortBy: SortBy,
            SortOrder: SortOrder,
            IsConvertAll: this.props.isConvertAll
        }
    }

    productChangeHandler = (currentItem, selectedItemsKey) => {
        this.props.setSelectedProduct(selectedItemsKey)
    }

    exportExcel = (event) => {
        event.preventDefault();
        
        const params = this._getParams();
        if (!params) {
            return;
        }

        params.IsExport = true;
        this.props.toggleLoader(true);
        DataService.getFile(ApiUrl.RUNNING_DATA_URL, params).then((response) => {
            const NoContentStatusCode = 204;

            if(response.status === NoContentStatusCode){
                alert(LangHelper.getSingleResource("NoInfo"));
            }else {
                Site.downloadFile(response.data, 'BettingTicketsCenter_Running.xls');
            }
            this.props.toggleLoader(false);
        });
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
        const currencyList = AppData.currencyList;
       
        return currencyList && currencyList.length && (
                <MultipleSelect id="ddlCurrency"
                language={LangHelper.currentLanguage}
                dataSource={currencyList}
                keyField={"Id"}
                valueField={"Value"}
                statusField={"Status"}
                onChange={(currentItem, selectedItemsKey) => this._onChangeCurrency(selectedItemsKey)} />);
    }

     _onChangeCurrency = (currencyIdList) => {
         let baseCurrency = "";

         if(!currencyIdList || currencyIdList.indexOf(',') > 0){ // none or multi currencies
             this.baseCurrencyList = AppData.baseCurrencyList;
             baseCurrency = this.baseCurrencyList.find(x => x.label === this.props.selectedBaseCurrency) ?
                             this.props.selectedBaseCurrency :
                             this.defaultBaseCurrency;
        }
        else
        {
             const currencyName =  AppData.currencyList.find(x => x.Id == currencyIdList).Value;
             baseCurrency = currencyName;
             if(!this.baseCurrencyList.find(x => x.label === currencyName)){
                 this.baseCurrencyList = AppData.baseCurrencyList.slice(0);
                 this.baseCurrencyList.push({value: currencyName, label: currencyName});      
             }
        }

        this.props.setSelectedCurrency(currencyIdList)
        this.props.setSelectedBaseCurrency(baseCurrency);
    }


    _renderBaseCurrencySelectList() {
        const baseCurrencyList = this.baseCurrencyList;

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

     render() {
         const excelButton = <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>
         
        return (
            <CollapsiblePanel className="page-filter" stickyFooter={excelButton}>
                <div className="row">

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Product")}</label>
                            {this._renderProductSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Username")}</label>
                            <AutoComplete url={ApiUrl.CUSTOMER_SEARCH_URL} 
                                onSelect={(value) => this.props.setUsername(value)}
                                onInput={(value) => this.props.setUsername(value)}
                                htmlAttributes={{placeholder:LangHelper.getSingleResource("ExternalIdOrSystemId")}} />
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Currency")}</label>
                            {this._renderCurrencySelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("BaseCurrency")}</label>
                            {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                        <CheckBox id="IsConvertAll"
                            checked={this.props.isConvertAll}
                            onChange={(checked) => this.props.changeIsConvertAll(checked)}
                            label={LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")} />
                    </div>    
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Status")}</label>
                        {this._renderStatusSelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-2 col-sm-2 col-lg-2 col-xl-1">
                        <div className="form-group">
                            <div className="button-group">
                            <button disabled={!this.isValidModel} type="button" className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
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
    const { requestParam, selectedProduct, selectedCurrency, selectedBaseCurrency, username, selectedStatus, isConvertAll } = state;
    return Object.assign({}, { requestParam, selectedProduct, selectedCurrency, selectedBaseCurrency, username, selectedStatus, isConvertAll });
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);