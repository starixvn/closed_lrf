import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Select from 'react-select'
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
        return this.props.refno !== "";
    }

    submit = (event) => {
        event.preventDefault();
        const params = this._getParams();
        if (!params) {
            return;
        }

        this.props.setReportTitle(Service.getTitle(null, null, null, params.BaseCurrency));
        this.props.setRequestParam(params);
        this.props.toggleLoader(true);
        this.props.getGridData(ApiUrl.REFNO_DATA_URL, params);
    }

    exportExcel = (event) => {
        event.preventDefault();
        
        const params = this._getParams();
        if (!params) {
            return;
        }

        params.IsExport = true;
        this.props.toggleLoader(true);
        
        DataService.getFile(ApiUrl.REFNO_DATA_URL, params).then((response) => {
            const NoContentStatusCode = 204;

            if(response.status === NoContentStatusCode){
                alert(LangHelper.getSingleResource("NoInfo"));
            } else {
                Site.downloadFile(response.data, 'BettingTicketsCenter_RefNo.xls');
            }
            this.props.toggleLoader(false);
        });
    }

    _getParams() {
        if (!this.isValidModel) {
            return null;
        }

        const { PageSize, SortBy, SortOrder } = this.props.requestParam;

        return {
            PageSize: PageSize,
            PageIndex: 1,
            Refno: this.props.refno,
            Username: this.props.username,
            BaseCurrency: this.props.isConvertAll ? this.props.selectedBaseCurrency : '',
            IsConvertAll: this.props.isConvertAll,
            SortBy: SortBy,
            SortOrder: SortOrder
        }
    }

    _renderBaseCurrencySelectList() {
        const selectedBaseCurrency = this.props.selectedBaseCurrency;
        const baseCurrencyList = AppData.baseCurrencyList;

        return baseCurrencyList && baseCurrencyList.length && (
            <Select instanceId="ddlBased"
                value={selectedBaseCurrency}
                options={baseCurrencyList}
                onChange={(item) => this.props.setSelectedBaseCurrency(item.value)} />
            );
    }

    render() {
        const excelButton = <i className="icon-excel right" onClick={this.exportExcel} title={LangHelper.getSingleResource("ExportToExcel")}></i>

        return (
            <CollapsiblePanel className="page-filter" stickyFooter={excelButton}>
                <div className="row">
                    <div className="col-12 col-md-4 col-sm-4 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("RefNo")} *</label>
                            <input className="input-text" id="RefNo" name="RefNo" type="number" value={this.props.refno} placeholder={LangHelper.getSingleResource("RefNo")}
                                onChange={(event) => this.props.setRefno(event.target.value)} />
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-sm-4 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("Username")}</label>
                            <AutoComplete url={ApiUrl.CUSTOMER_SEARCH_URL} 
                                onSelect={(value) => this.props.setUsername(value)}
                                onInput={(value) => this.props.setUsername(value)}
                                htmlAttributes={{placeholder:LangHelper.getSingleResource("ExternalIdOrSystemId")}} />
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-4 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">{LangHelper.getSingleResource("BaseCurrency")}</label>
                        {this._renderBaseCurrencySelectList()}
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-sm-4 col-lg-2 col-xl-2">
                        <div className="form-group">
                            <CheckBox id="IsConvertAll"
                            checked={this.props.isConvertAll}
                            onChange={(checked) => this.props.changeIsConvertAll(checked)}
                            label={LangHelper.getSingleResource("ConvertAllFiguresToBaseCurrency")} />
                        </div>    
                    </div>

                    <div className="col-12 col-md-3 col-sm-4 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <div className="button-group">
                        <button type="button" disabled={!this.isValidModel} className="btn btn-submit" onClick={this.submit}>{LangHelper.getSingleResource("Submit")}</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-1" style={{flex: "0 0 4%"}}>
                    {LangHelper.getSingleResource('Note')}:
                        </div>
                        <div className="col-9">
                            * {LangHelper.getSingleResource('BettingTicketCenter_RefnoTabNote1')}
                            <br />
                            * {LangHelper.getSingleResource('BettingTicketCenter_RefnoTabNote2').replace('{0}', AppData.balanceUpDay)}
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
    const { requestParam, refno, username, selectedBaseCurrency, isConvertAll } = state;
    return Object.assign({}, { requestParam, refno, username, selectedBaseCurrency, isConvertAll});
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);