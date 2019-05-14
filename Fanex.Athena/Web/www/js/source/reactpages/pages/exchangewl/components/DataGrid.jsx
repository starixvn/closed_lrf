import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import NumberFormat from '../../../lib/numberFormat'
import ReportTitle from '../../../components/ReportTitle'
import { Service, TotalText, HeaderText, BreadcrumbText } from '../lib/service'
import { ReportLevel, ReportBy } from '../../../constants/report'
import { Licensee } from '../../../constants/licensee'
import NoDataTitle from '../../../components/NoDataTitle'
import moment from 'moment'
import { Breadcrumb } from '@9softstudio/react-breadcrumb'
import Site from '../../../lib/site'
import BetList from './BetList'
import Popup from '../../../components/popup'
import Report from '../../../lib/report'
import LangHelper from '../../../lib/langHelper.js';

const CUSTOMER_BETLIST_TEXT = LangHelper.getSingleResource("CustomerBetList");

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.isAllowedCustomerComm = props.isAllowedCustomerComm;
        this.licenseeId = props.licenseeId;

        this.levelGridData = [];
        this.drillDownParams = [];
        this.betlistTitle = null;
        this.betlistParams = {};

        this.state = {
            showBetList: false,
            betListData: {}
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.params !== prevProps.params) {
            this.drillDownParams[ReportLevel.MAIN] = this.props.params;
        }

        if (this.props.gridData !== prevProps.gridData) {
            this.props.toggleLoader(false);
        }
    }

    _getColSpan(level) {
        switch (level) {
            case ReportLevel.MAIN:
                return 2;
            case ReportLevel.LICENSEE:
                return 2;
            case ReportLevel.CUSTOMER:
                return 3;
            default: return 2;
        }
    }

    _getDrillDownParams(level, date, currencyId, currencyName, custId) {
        const mainParam = this.drillDownParams[ReportLevel.MAIN];
        if (!mainParam) {
            return null;
        }

        const drillDownDate = Service.getDrilldownDateRange(mainParam.ReportBy, mainParam.FromDate, mainParam.ToDate, date);
        const drillDownData = {
            ...mainParam,
            CurrencyId: currencyId,
            CurrencyName: currencyName,
            FromDate: Site.convertDateToString(moment(drillDownDate.fromDate)),
            ToDate: Site.convertDateToString(moment(drillDownDate.toDate)),
            Level: level,
            CustId: custId
        };

        this.drillDownParams[level] = drillDownData;

        return {
            data: drillDownData
        };
    }

    _drillDownData(level, date, currencyId, currencyName, custId) {
        const currentLevel = this.props.gridData.level;

        if (currentLevel === level || level < ReportLevel.MAIN || level > ReportLevel.CUSTOMER) {
            return;
        }

        if (level > currentLevel) {
            const params = this._getDrillDownParams(level, date, currencyId, currencyName, custId);
            if (!params) {
                return;
            }

            this.props.toggleLoader(true);

            this.levelGridData[currentLevel] = this.props.gridData.data;

            this.props.getGridData(params, () => {
                Service.showErrorMsg();
                this.props.toggleLoader(false);
            });
        }
        else {
            const data = this.levelGridData[level];
            if (!data) {
                return;
            }

            this.props.toggleLoader(true);
            this.props.setGridData({
                data: data,
                level: level
            });
        }
    }

    _renderDrillDownLink(text, level, date, currencyId, currencyName, custId) {
        return <a onClick={() => this._drillDownData(level, date, currencyId, currencyName, custId)} href='javascript:;'>{text}</a>
    }

    _buildHeader(level, reportBy) {
        let headerRows = [];

        headerRows.push(
            <HeaderRow style={{ height: 32 }} key='tr-header1'>
                <HeaderCell colWidth={30} title={HeaderText.index} rowSpan='2'>{HeaderText.index}</HeaderCell>
                {level === ReportLevel.MAIN && <HeaderCell colWidth={100} title={reportBy === ReportBy.DAILY ? HeaderText.date : HeaderText.month} rowSpan='2'>{reportBy === ReportBy.DAILY ? HeaderText.date : HeaderText.month}</HeaderCell>}
                {level === ReportLevel.CUSTOMER && <HeaderCell colWidth={100} title={HeaderText.externalId} rowSpan='2'>{HeaderText.externalId}</HeaderCell>}
                {level !== ReportLevel.MAIN && <HeaderCell colWidth={100} title={HeaderText.systemId} rowSpan='2'>{HeaderText.systemId}</HeaderCell>}
                <HeaderCell colWidth={70} title={HeaderText.currency} rowSpan='2'>{HeaderText.currency}</HeaderCell>
                <HeaderCell colWidth={100} title={HeaderText.turnover} rowSpan='2'>{HeaderText.turnover}</HeaderCell>
                <HeaderCell colWidth={100} title={HeaderText.netTurnover} rowSpan='2'>{HeaderText.netTurnover}</HeaderCell>
                <HeaderCell colWidth={80} title={HeaderText.totalTransaction} rowSpan='2'>{HeaderText.totalTransaction}</HeaderCell>
                {
                    this.isAllowedCustomerComm
                        ? <HeaderCell colWidth={100} title={HeaderText.customer} colSpan='3'>{HeaderText.customer}</HeaderCell>
                        : <HeaderCell colWidth={100} title={HeaderText.customerWL} rowSpan='2'>{HeaderText.customerWL}</HeaderCell>
                }
                <HeaderCell colWidth={100} title={HeaderText.licensee} colSpan='4'>{HeaderText.licensee}</HeaderCell>
            </HeaderRow>
        );

        if (this.isAllowedCustomerComm) {
            headerRows.push(
                <HeaderRow style={{ height: 32 }} key='tr-header2'>
                    <HeaderCell colWidth={100} title={HeaderText.customerWL}>{HeaderText.customerWL}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.customerComm}>{HeaderText.customerComm}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.total}>{HeaderText.total}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.licenseeWL}>{HeaderText.licenseeWL}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.amountDueTo}>{HeaderText.amountDueTo}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.licenseeComm}>{HeaderText.licenseeComm}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.total}>{HeaderText.total}</HeaderCell>
                </HeaderRow>
            );
        }
        else {
            headerRows.push(
                <HeaderRow style={{ height: 32 }} key='tr-header2'>
                    <HeaderCell colWidth={100} title={HeaderText.licenseeWL}>{HeaderText.licenseeWL}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.amountDueTo}>{HeaderText.amountDueTo}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.licenseeComm}>{HeaderText.licenseeComm}</HeaderCell>
                    <HeaderCell colWidth={100} title={HeaderText.total}>{HeaderText.total}</HeaderCell>
                </HeaderRow>
            );
        }

        return headerRows;
    }

    _buildBody(level, reportBy) {
        const data = this.props.gridData.data.DataList;
        let rows = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const date = moment(item.Date).format(reportBy === ReportBy.DAILY ? "MM/DD/YYYY" : "MM/YYYY");

            rows.push(
                <Row key={`tr-main${i}`}>
                    <Cell title={i + 1} className='center-align'>{i + 1}</Cell>
                    {level === ReportLevel.MAIN && <Cell title={date} className='center-align'>{date}</Cell>}
                    {
                        level === ReportLevel.CUSTOMER &&
                        <Cell title={item.ExternalId} className='left-align'>
                            {this._renderBetListLink(item.ExternalId, item.ExternalId, item.SystemId, item.CustId)}
                        </Cell>
                    }
                    {
                        level !== ReportLevel.MAIN &&
                        <Cell title={item.SystemId} className='left-align'>
                            {
                                level === ReportLevel.LICENSEE ?
                                    this._renderDrillDownLink(item.SystemId, ReportLevel.CUSTOMER, item.Date, item.CurrencyId, item.CurrencyName, item.CustId) :
                                    this._renderBetListLink(item.SystemId, item.ExternalId, item.SystemId, item.CustId)
                            }
                        </Cell>
                    }
                    <Cell title={item.CurrencyName} className='center-align'>
                        {
                            level === ReportLevel.MAIN
                                ? this._renderDrillDownLink(item.CurrencyName, this.licenseeId === Licensee.ONE_TWO_BET ? ReportLevel.LICENSEE : ReportLevel.CUSTOMER, item.Date, item.CurrencyId, item.CurrencyName)
                                : item.CurrencyName
                        }
                    </Cell>
                    {this._buildCell(item)}
                </Row>
            );
        }

        return rows;
    }

    _buildFooter(level) {
        let totalRows = [];

        const data = this.props.gridData.data.TotalDataList,
            colSpan = this._getColSpan(level),
            rowSpan = data.length;

        for (let i = 0; i < rowSpan; i++) {
            const item = data[i];

            totalRows.push(
                <Row key={`tr-total${i}`} className="fixed-table-total">
                    {i === 0 && <Cell title={TotalText.total} className='center-align' rowSpan={rowSpan} colSpan={colSpan}>{TotalText.total}</Cell>}
                    <Cell title={item.CurrencyName} className='center-align'>{item.CurrencyName}</Cell>
                    {this._buildCell(item)}
                </Row>
            );
        }

        const dataSummary = this.props.gridData.data.SummaryTotal,
            baseCurrencyList = Object.keys(dataSummary),
            colSummarySpan = this._getColSpan(level) + 1;

        for (let i = baseCurrencyList.length - 1; i >= 0; i--) {
            const currency = baseCurrencyList[i],
                item = dataSummary[currency];

            totalRows.push(
                <Row key={`tr-grandtotal${i}`} className="fixed-table-grant-total">
                    <Cell title={`${TotalText.totalIn} ${currency}`} className='center-align' colSpan={colSummarySpan}>{`${TotalText.totalIn} ${currency}`}</Cell>
                    {this._buildCell(item)}
                </Row>
            );
        }

        return totalRows;
    }

    _buildCell(item) {
        const turnover = NumberFormat.formatDecimal(item.Turnover),
            netTurnover = NumberFormat.formatDecimal(item.NetTurnover),
            totalTransaction = NumberFormat.format(item.TotalTransaction),
            customerWL = NumberFormat.formatDecimal(item.CustomerWL),
            customerComm = NumberFormat.formatDecimal(item.CustomerComm),
            customerWLTotal = NumberFormat.formatDecimal(item.CustomerWLTotal),
            licenseeWL = NumberFormat.formatDecimal(item.LicenseeWL),
            amountDueTo = NumberFormat.formatDecimal(item.AmountDueTo),
            licenseeComm = NumberFormat.formatDecimal(item.LicenseeComm),
            licenseeWLTotal = NumberFormat.formatDecimal(item.LicenseeWLTotal);

        let cells =
            [<Cell key='turnover' title={turnover} className='right-align'>{turnover}</Cell>,
            <Cell key='netturnover' title={netTurnover} className='right-align'>{netTurnover}</Cell>,
            <Cell key='totalTransaction' title={totalTransaction} className='right-align'>{totalTransaction}</Cell>,
            <Cell key='customerWL' title={customerWL} className='right-align'>{customerWL}</Cell>,
            this.isAllowedCustomerComm && <Cell key='customerComm' title={customerComm} className='right-align'>{customerComm}</Cell>,
            this.isAllowedCustomerComm && <Cell key='customerWLTotal' title={customerWLTotal} className='right-align'>{customerWLTotal}</Cell>,
            <Cell key='licenseeWL' title={licenseeWL} className={`right-align ${item.LicenseeWL < 0 ? 'negative' : ''}`}>{licenseeWL}</Cell>,
            <Cell key='amountDueTo' title={amountDueTo} className='right-align'>{amountDueTo}</Cell>,
            <Cell key='licenseeComm' title={licenseeComm} className='right-align'>{licenseeComm}</Cell>,
            <Cell key='licenseeWLTotal' title={licenseeWLTotal} className={`right-align ${item.LicenseeWLTotal < 0 ? 'negative' : ''}`}>{licenseeWLTotal}</Cell>];

        return cells;
    }

    _renderBreadcrumb() {
        const items = [{
            label: BreadcrumbText.main,
            value: ReportLevel.MAIN,
        }];

        if (Number(this.licenseeId) === Licensee.ONE_TWO_BET) {
            items.push({
                label: BreadcrumbText.licensee,
                value: ReportLevel.LICENSEE,
            });
        }

        items.push({
            label: BreadcrumbText.customer,
            value: ReportLevel.CUSTOMER,
        });

        return <Breadcrumb items={items} value={this.props.gridData.level} onChange={(item) => this._drillDownData(item.value)} />
    }

    _renderNodata(title) {
        return (
            <div className="result-content">
                {this._renderBreadcrumb()}
                <ReportTitle content={title} />
                <NoDataTitle />
            </div>
        )
    }

    _renderBetListLink(text, externalId, systemId, custId) {
        return (<a href="javascript:;" onClick={() => this.showBetListPopup(externalId, systemId, custId)}>{text}</a>);
    }

    showBetListPopup = (externalId, systemId, custId) => {
        const { CurrencyId, BaseCurrency, FromDate, ToDate, CurrencyName, ExcludeTestData } = this.drillDownParams[ReportLevel.CUSTOMER];
        const url = "api/ExchangeWinLossBetList/Index";
        this.betlistParams = { CustId : custId , CurrencyId, BaseCurrency, FromDate, ToDate, ExcludeTestData };

        const params = {
            data: this.betlistParams
        }

        const viewIn = LangHelper.getSingleResource("Viewin").replace("{0}", BaseCurrency ? BaseCurrency : CurrencyName)

        this.betlistTitle = (
            <p>
                {CUSTOMER_BETLIST_TEXT}{" "}
                {FromDate} → {ToDate} - {externalId}({systemId}) -{" "}
                <span className="base-currency-title">{viewIn}</span>
            </p>
        )

        this.props.toggleLoader(true);
        Report.fetchGridData(url, params)
            .then(response => {
                this.setState({
                    showBetList: true,
                    betListData: response.data
                });
                this.props.toggleLoader(false);
            })
            .catch(error => {
                Service.showErrorMsg();
                this.props.toggleLoader(false);
            })
        window.logOpenBetlistEvent && window.logOpenBetlistEvent();
    }

    closeBetListPopup = () => {
        this.setState({ showBetList: false, betListData: null });
    }

    render() {
        const gridData = this.props.gridData;
        if (!gridData || !gridData.data) {
            return null;
        }

        const reportLevel = gridData.level;
        const params = this.drillDownParams[reportLevel];
        const title = Service.getReportTitle(
            { fromDate: params.FromDate, toDate: params.ToDate }, 
            params.BaseCurrency ? params.BaseCurrency : params.CurrencyName, 
            reportLevel === ReportLevel.MAIN ? params.CurrencyId === 0 : false);

        if (!gridData.data.DataList.length) {
            return this._renderNodata(title);
        }

        const reportBy = this.props.params.ReportBy;
        const { showBetList, betListData } = this.state;

        return (
            <div className='result-content'>
                {this._renderBreadcrumb()}

                <ReportTitle content={title} />

                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={this._buildHeader(reportLevel, reportBy)}
                    body={this._buildBody(reportLevel, reportBy)}
                    footer={this._buildFooter(reportLevel)}
                />

                {
                    reportLevel === ReportLevel.CUSTOMER && showBetList &&
                    <Popup isShow={showBetList} title={CUSTOMER_BETLIST_TEXT} width={900} height={600} onClose={this.closeBetListPopup}>
                        <BetList data={betListData} title={this.betlistTitle} params={this.betlistParams} />
                    </Popup>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
};

function mapStateToProps(state) {
    const { gridData, params, licenseeId, isAllowedCustomerComm } = state;
    return Object.assign({}, { gridData, params, licenseeId, isAllowedCustomerComm });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);