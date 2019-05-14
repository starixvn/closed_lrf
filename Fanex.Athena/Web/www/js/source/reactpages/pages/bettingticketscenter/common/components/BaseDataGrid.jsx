import React, { Component } from 'react'

import { Table, Row, Cell } from '@9softstudio/react-grid'
import ReportTitle from '@jsroot/components/ReportTitle'
import Popup from '@jsroot/components/popup'
import LangHelper from '@jsroot/lib/langHelper'
import NoDataTitle from '@jsroot/components/NoDataTitle'

const DEFAULT_PAGE_SIZE = 50;

export default class BaseDataGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const param = this.props.requestParam;
        param.PageSize = DEFAULT_PAGE_SIZE;
        this.props.setRequestParam(param);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.gridData !== prevProps.gridData) {
            this.props.toggleLoader(false);
        }
    }
    
    get dataUrl(){
        // This property should be override in child class.
    }
    
    get hasWinLossColumns(){
        // This property may be override in child class.
        return true;
    }

    onPaging = (index, size) => {
        let param = this.props.requestParam;

        param.PageIndex = index;
        param.PageSize = size;

        this._getData(param);
    }
    
    _getData(param){
        this.props.toggleLoader(true);
        this.props.getGridData(this.dataUrl, param);
        this.props.setRequestParam(param);
    }

    _buildHeader() {
        // This method should be override in child class.
        return [];
    }

    _buildBody(){
        const data = this.props.gridData.Data;
        let rows = [];

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            
            rows.push(
                   <Row key={`product-${i}`}>
                    <Cell title={item.Index} className="center-align">{item.Index}</Cell>                  
                    <Cell title={item.ExternalId}>{item.ExternalId}</Cell>
                    <Cell title={item.SystemId}>{item.SystemId}</Cell>
                    <Cell className="center-align" dangerouslySetInnerHTML={{ __html: item.RefNo }}></Cell>
                    <Cell className="center-align" dangerouslySetInnerHTML={{ __html: item.TransTime }}></Cell>
                    <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.Choice}}></Cell>
                    <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.Odds}}></Cell>
                    <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.OddsType}}></Cell>
                    <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.Stake}}></Cell>

                    {this.hasWinLossColumns && <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.WinLoss}}></Cell>}
                    {this.hasWinLossColumns && <Cell className="right-align" dangerouslySetInnerHTML={{ __html: item.LicenseeWL}}></Cell>}
                    <Cell className="center-align" dangerouslySetInnerHTML={{ __html: item.Status}}></Cell>
                    <Cell className="center-align">{item.Platform}</Cell>
                    <Cell className="center-align" dangerouslySetInnerHTML={{ __html: item.Live}}></Cell>
                </Row>
            );
    }

        return rows;
    }

    _renderNodata() {
        return (
            <div className="result-content">
                <ReportTitle content={this.props.reportTitle} />
                <NoDataTitle />
            </div>
        )
    }

    onSort= (sortBy, sortOrder) =>{
        let param = this.props.requestParam;

        param.SortBy = sortBy;
        param.SortOrder = sortOrder;
        
        this._getData(param);
    }

    render() {
        if (!this.props.gridData || !this.props.gridData.Data) {
            return null;
    }

        const { Data } = this.props.gridData;
        
        if (!Data.length) {
            return this._renderNodata();
    }

        const param = this.props.requestParam;
        const pageOption = {
        PageIndex: param.PageIndex,
        PageSize: param.PageSize,
        TotalItem: this.props.gridData.TotalRows,
        PageList: [DEFAULT_PAGE_SIZE, 100, 200, 300, 400, 500, 1000, 2000]
    };

        return (
            <div className="betlist-container result-content">
                <ReportTitle content={this.props.reportTitle} />
                <Table
                    onSort={this.onSort}
                    minWidth={980}
                    autoWidth={true}
                    bodyHeight={300}
                    header={this._buildHeader()}
                    body={this._buildBody()}
                    footer={this._buildFooter && this._buildFooter()}
                    isPaging={true}
                    pageOption={pageOption}
                    onPaging={this.onPaging}
                    alwaysVisiblePager={true}
                />
            </div>
        );
    }
    }