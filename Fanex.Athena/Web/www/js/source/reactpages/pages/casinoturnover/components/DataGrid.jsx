import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import LangHelper from '@jsroot/lib/langHelper'
import NoDataTitle from '@jsroot/components/NoDataTitle'
import NumberFormat from '@jsroot/lib/numberFormat'
import { HeaderText, Service } from '../lib/service'
import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'

const URL = Site.resolveClientUrl("api/CasinoTurnoverReport/GetData");

export class DataGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gridData.timestamp !== this.props.gridData.timestamp) {
            this.props.toggleLoader(false);
        }
    }

    onPaging = (index, size) => {
        const param =  Object.assign({}, this.props.requestParam, { PageIndex: index, PageSize: size });
        this._getData(param);
    }

    _getData(param){
        this.props.toggleLoader(true);
        this.props.getGridData(URL, param);
        this.props.setRequestParam(param);
    }

    _buildHeader() {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={50} title="#">{HeaderText.Index}</HeaderCell>
                <HeaderCell colWidth={150} title={HeaderText.Date}>{HeaderText.Date}</HeaderCell>
                <HeaderCell colWidth={150} title={HeaderText.SystemId}>{HeaderText.SystemId}</HeaderCell>
                <HeaderCell colWidth={150} title={HeaderText.ExternalId}>{HeaderText.ExternalId}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.Product}>{HeaderText.Product}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.TotalTransaction}>{HeaderText.TotalTransaction}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.Turnover}>{HeaderText.Turnover}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.ValidBetAmount}>{HeaderText.ValidBetAmount}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.CustomerWL}>{HeaderText.CustomerWL}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildBody(data) {
            let rows = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const reportBy = moment(item.Date).format("MM/DD/YYYY"),
                        betcount = NumberFormat.format(item.BetCount),
                        turnover = NumberFormat.formatDecimal(item.Turnover),
                        validBetAmount= NumberFormat.formatDecimal(item.ValidBetAmount),
                        customerWL = NumberFormat.formatDecimal(item.CustomerWL);
                    
                rows.push(
                    <Row key={`tr${i}`}>
                        { item.RowSpan > 0 && <Cell title={item.Index} rowSpan={item.RowSpan} className="center-align">{item.Index}</Cell> }
                        { item.RowSpan > 0 && <Cell title={reportBy} rowSpan={item.RowSpan} className='center-align'>{reportBy}</Cell> }
                        { item.RowSpan > 0 && <Cell title={item.SystemId} rowSpan={item.RowSpan} className='center-align'>{item.SystemId}</Cell> }
                        { item.RowSpan > 0 && <Cell title={item.ExternalId} rowSpan={item.RowSpan} className="center-align">{item.ExternalId}</Cell> }
                        <Cell title={item.Product}>{item.Product}</Cell>
                        <Cell title={betcount} className='right-align'>{betcount}</Cell>
                        <Cell title={turnover} className='right-align'>{turnover}</Cell>
                        <Cell title={validBetAmount} className="right-align">{validBetAmount}</Cell>
                        <Cell title={customerWL} className="right-align">{customerWL}</Cell>
                    </Row>
            );
        }

        return rows;
    }

    _buildFooter(data, baseCurrency) {
        const item = data;

        const betcount = NumberFormat.format(item.BetCount),
            turnover = NumberFormat.formatDecimal(item.Turnover),
            validBetAmount= NumberFormat.formatDecimal(item.ValidBetAmount),
            customerWL = NumberFormat.formatDecimal(item.CustomerWL);

        return ([
            <Row className="fixed-table-grant-total" key='1'>
                <Cell className="center-align" colSpan='5'>{LangHelper.getSingleResource("Totalin") + " " + baseCurrency}</Cell>
                <Cell title={betcount} className="right-align">{betcount}</Cell>
                <Cell title={turnover} className="right-align">{turnover}</Cell>
                <Cell title={validBetAmount} className="right-align">{validBetAmount}</Cell>
                <Cell title={customerWL} className={"right-align"}>{customerWL}</Cell>
            </Row>
        ])
    }

    render() {
        if (!this.props.gridData) {
            return null;
        }

        const { Data, Total } = this.props.gridData;
        
        if (!Data) {
            return null;
        }

        if (!Data.length) {
            return <NoDataTitle />
        }

        const param = this.props.requestParam;
        const pageOption = {
            PageIndex: param.PageIndex,
            PageSize: param.PageSize,
            TotalItem: this.props.gridData.TotalRows,
            PageList: [50, 100, 200, 300, 400, 500, 1000, 2000]
        };

        return (
             <Table
                minWidth={800}
                autoWidth={true}
                bodyHeight={300}
                header={this._buildHeader()}
                body={this._buildBody(Data)}
                footer={this._buildFooter(Total, param.BaseCurrency)}
                isPaging={true}
                pageOption={pageOption}
                onPaging={this.onPaging}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { toggleLoader, setRequestParam, getGridData } = ActionCreators;
    return bindActionCreators({ toggleLoader, setRequestParam, getGridData }, dispatch);
}

function mapStateToProps(state) {
    const { requestParam, gridData } = state;
    return Object.assign({}, { requestParam, gridData });
}

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);