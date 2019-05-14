import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import LangHelper from '@jsroot/lib/langHelper'
import NumberFormat from '@jsroot/lib/numberFormat'
import ReportTitle from '@jsroot/components/ReportTitle'
import NoDataTitle from '@jsroot/components/NoDataTitle'
import service from '../lib/service'
import { SettingConst } from '../constants/settingConst'

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.reportTitle = "";
        this.groupBy = 0;
        this.selectedBaseCurrency = "";
        this.selectedReportBy = 0;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.gridData !== prevProps.gridData) {
            const { groupBy, selectedReportBy, selectedTimeZone, dateRange, selectedCurrency, selectedBaseCurrency, isConvertAll } = this.props;
            this.groupBy = groupBy;
            this.selectedReportBy = selectedReportBy;
            this.selectedBaseCurrency = selectedBaseCurrency;
            this.reportTitle = service.getReportTitle(selectedTimeZone, dateRange, selectedCurrency.label, selectedBaseCurrency, isConvertAll);
            this.props.toggleLoader(false);
        }
    }

    _buildHeader() {
        const headerText = service.getHeaderText(this.selectedReportBy, this.groupBy);

        const reportByCell = this.selectedReportBy !== SettingConst.ReportBySummary &&
                            <HeaderCell colWidth={150} title={headerText.ReportBy}>{headerText.ReportBy}</HeaderCell>

        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={50} title="#">{headerText.Index}</HeaderCell>
                {reportByCell}
                <HeaderCell colWidth={150} title={headerText.GroupBy}>{headerText.GroupBy}</HeaderCell>
                <HeaderCell colWidth={150} title={headerText.BetCount}>{headerText.BetCount}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.Turnover}>{headerText.Turnover}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.CustomerComm}>{headerText.CustomerComm}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.LicenseeWL}>{headerText.LicenseeWL}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.LicenseeComm}>{headerText.LicenseeComm}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.LicenseeNetWL}>{headerText.LicenseeNetWL}</HeaderCell>
                <HeaderCell colWidth={200} title={headerText.Margin}>{headerText.Margin}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildBody() {
        const data = this.props.gridData.Data;
                   
        const groupByClassName = this.groupBy === SettingConst.GroupByProduct ? "left-align" : "center-align";
                    
        let rows = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const reportBy = moment(item.ReportBy).format(this.selectedReportBy === 2 ? "MM/DD/YYYY" : "MM/YYYY"),
                    betcount = NumberFormat.format(item.BetCount),
                    turnover = NumberFormat.formatDecimal(item.Turnover),
                    customerComm= NumberFormat.formatDecimal(item.CustomerComm),
                    licenseeWL = NumberFormat.formatDecimal(item.LicenseeWinLoss),
                    licenseeComm = NumberFormat.formatDecimal(item.LicenseeComm),
                    licenseeNetWL = NumberFormat.formatDecimal(item.LicenseeNetWinLoss),
                    margin = NumberFormat.formatDecimal(item.Margin) + "%";
            
            const reportByCell = this.selectedReportBy !== SettingConst.ReportBySummary &&
                                <Cell title={reportBy} className="center-align">{reportBy}</Cell>
            
            rows.push(
                <Row key={`tr${i}`}>
                    <Cell className="center-align">{i + 1}</Cell>
                    {reportByCell}
                    <Cell title={item.GroupBy} className={groupByClassName}>{item.GroupBy}</Cell>
                    <Cell title={betcount} className="right-align">{betcount}</Cell>
                    <Cell title={turnover} className="right-align">{turnover}</Cell>
                    <Cell title={customerComm} className="right-align">{customerComm}</Cell>
                    <Cell title={licenseeWL} className={`right-align ${item.LicenseeWinLoss < 0 ? "negative" : ""}`}>{licenseeWL}</Cell>
                    <Cell title={licenseeComm} className="right-align">{licenseeComm}</Cell>
                    <Cell title={licenseeNetWL} className={`right-align ${item.LicenseeNetWinLoss < 0 ? "negative" : ""}`}>{licenseeNetWL}</Cell>
                    <Cell title={margin} className="right-align">{margin}</Cell>
                </Row>
            );
        }

        return rows;
    }

    _buildFooter() {
        const item = this.props.gridData.Total;
        const betcount = NumberFormat.format(item.BetCount),
                    turnover = NumberFormat.formatDecimal(item.Turnover),
                    customerComm= NumberFormat.formatDecimal(item.CustomerComm),
                    licenseeWL = NumberFormat.formatDecimal(item.LicenseeWinLoss),
                    licenseeComm = NumberFormat.formatDecimal(item.LicenseeComm),
                    licenseeNetWL = NumberFormat.formatDecimal(item.LicenseeNetWinLoss),
                    margin = NumberFormat.formatDecimal(item.Margin) + "%";
            const colSpan = this.selectedReportBy === SettingConst.ReportBySummary ? 2 : 3;
            return [(
                <Row className="fixed-table-grant-total" key={1}>
                   <Cell className="center-align" colSpan={colSpan}>{LangHelper.getSingleResource("Totalin") + " " + this.selectedBaseCurrency}</Cell>
                   <Cell title={betcount} className="right-align">{betcount}</Cell>
                   <Cell title={turnover} className="right-align">{turnover}</Cell>
                   <Cell title={customerComm} className="right-align">{customerComm}</Cell>
                   <Cell title={licenseeWL} className={`right-align ${item.LicenseeWinLoss < 0 ? "negative" : ""}`}>{licenseeWL}</Cell>
                   <Cell title={licenseeComm} className={"right-align"}>{licenseeComm}</Cell>
                   <Cell title={licenseeNetWL} className={`right-align ${item.LicenseeNetWinLoss < 0 ? "negative" : ""}`}>{licenseeNetWL}</Cell>
                   <Cell title={margin} className={"right-align"}>{margin}</Cell>
                </Row>
            )]
    }

    _renderNodata() {
        return (
            <div className="result-content">
                <ReportTitle content={this.reportTitle} />
                <NoDataTitle />
            </div>
        )
    }

    render() {
        const { Data } = this.props.gridData;
        if (!Data) {
            return null;
        }

        if (!Data.length) {
            return this._renderNodata();
        }
        
        return (
            <div className="result-content">
                <ReportTitle content={this.reportTitle} />

                <Table
                    minWidth={600}
                    autoWidth={true}
                    bodyHeight={300}
                    header={this._buildHeader()}
                    body={this._buildBody()}
                    footer={this._buildFooter()}
                />
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
                }
function mapStateToProps(state) {
    const { gridData, groupBy, selectedReportBy, selectedTimeZone, dateRange, selectedCurrency, selectedBaseCurrency, isLoading, isConvertAll } = state;
    return Object.assign({}, { gridData, groupBy, selectedReportBy, selectedTimeZone, dateRange, selectedCurrency, selectedBaseCurrency, isLoading, isConvertAll });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);