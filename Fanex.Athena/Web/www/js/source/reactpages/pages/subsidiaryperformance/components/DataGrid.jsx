import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import LangHelper from '../../../lib/langHelper'
import NumberFormat from '../../../lib/numberFormat'
import NoDataTitle from '../../../components/NoDataTitle'
import { Service, HeaderText, TotalText, Api } from '../lib/service'
import Report from '../../../lib/report'
import { ReportLevel } from '../../../constants/report'

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: { Data: null } };
        this.level = ReportLevel.Main;
        this.baseCurrency = '';
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.Timestamp !== this.props.params.Timestamp) {
            this.level = ReportLevel.Main;
            this.baseCurrency = this.props.params.BaseCurrency;
            this._getGridData(Api.Url, this.props.params);
        }
    }

    _getGridData(url, params) {
        this.props.toggleLoader(true);
        Report.fetchGridData(url, { xsrfToken: this.props.xsrfToken, data: params })
            .then(response => {
                this.setState({ gridData: response.data })
                this.props.toggleLoader(false);
            })
            .catch(error => {
                Service.showErrorMsg();
                this.props.toggleLoader(false);
            });
    }

    _drillDown(subsidiary) {
        let params = Object.assign({}, this.props.params);

        this.subsidiaryListMainLevel = params.SubsidiaryList;
        params.SubsidiaryId = subsidiary;
        params.Level = ReportLevel.CUSTOMER;

        this.level = ReportLevel.CUSTOMER;

        this._getGridData(Api.DetailUrl, params);
        this.props.setParams(params);
    }

    _buildHeader() {
        const customerLevel = this.level === ReportLevel.CUSTOMER;

        return (
            <HeaderRow style={{ height: 32 }}>
                { customerLevel && <HeaderCell colWidth={30} title={HeaderText.Index}>{HeaderText.Index}</HeaderCell> }
                <HeaderCell colWidth={150} title={customerLevel ? HeaderText.ExternalId : HeaderText.Subsidiary}>{customerLevel ? HeaderText.ExternalId : HeaderText.Subsidiary}</HeaderCell>
                { customerLevel && <HeaderCell colWidth={150} title={HeaderText.SystemId}>{HeaderText.SystemId}</HeaderCell> }
                <HeaderCell colWidth={150} title={HeaderText.CurrencyName}>{HeaderText.CurrencyName}</HeaderCell>
                { !customerLevel && <HeaderCell colWidth={200} title={HeaderText.Product}>{HeaderText.Product}</HeaderCell> }
                <HeaderCell colWidth={150} title={HeaderText.BetCount}>{HeaderText.BetCount}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.Turnover}>{HeaderText.Turnover}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.CustomerWinLoss}>{HeaderText.CustomerWinLoss}</HeaderCell>
                <HeaderCell colWidth={200} title={HeaderText.SubsidiaryWinLoss}>{HeaderText.SubsidiaryWinLoss}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildMainBody() {
        const data = this.state.gridData.Data;

        let rows = [];
        let key = 0;
        for (let sub = 0; sub < data.length; sub++) {
            const item = data[sub];
            const totalItem = item.TotalItem;
            const currencies = Object.keys(item.Details);

            for (let cur = 0; cur < currencies.length; cur++) {
                const currency = currencies[cur];
                const products = item.Details[currency];
                const rowSpan = products.length;

                for (let pro = 0; pro < rowSpan; pro++) {
                    const product = products[pro];

                    rows.push(
                        <Row key={key}>
                            { 
                              cur === 0 
                              && pro === 0 
                              && <Cell title={item.Subsidiary} rowSpan={totalItem}><a href="javascript:;" onClick={() => this._drillDown(item.Subsidiary)}>{item.Subsidiary}</a></Cell> 
                            }
                            { pro === 0 && <Cell title={currency} rowSpan={rowSpan} className="center-align">{currency}</Cell> }
                            <Cell title={product.Product}>{product.Product}</Cell>
                            { this._buildCommonCells(product, key) }
                        </Row>
                    );

                    key++;
                }
            }     
        }

        return rows;
    }

    _buildDetailBody() {
        const data = this.state.gridData.Data;
                            
        const rows = data.map((item, index) => {
            return <Row key={index}>
                        <Cell title={index + 1} className="center-align">{index + 1}</Cell>
                        <Cell title={item.ExternalId} className="center-align">{item.ExternalId}</Cell>
                        <Cell title={item.SystemId} className="center-align">{item.SystemId}</Cell>
                        <Cell title={item.CurrencyName} className="center-align">{item.CurrencyName}</Cell>
                        { this._buildCommonCells(item, index) }
                    </Row>
        });

        return rows;
    }

    _buildBody() {
        return this.level === ReportLevel.CUSTOMER ? this._buildDetailBody() : this._buildMainBody();
    }

   _buildFooter() {
        return this.level === ReportLevel.CUSTOMER ? this._buildDetailFooter() : this._buildMainFooter();
    }

    _buildMainFooter() {
        const totalData = this.state.gridData.Total;
        const subs = Object.keys(totalData);
        
        let footer = [];
        for (let i = 0; i < subs.length; i++) {
            const totalName = subs[i];
            const item = totalData[totalName];

            footer.push(
                <Row className="fixed-table-total" key={`total${i}`}>
                    <Cell title={`${TotalText.Total} ${totalName}`}>{`${TotalText.Total} ${totalName}`}</Cell>
                    <Cell title={`${TotalText.Based} ${item.CurrencyName}`} className="center-align" colSpan='2'>{`${TotalText.Based} ${item.CurrencyName}`}</Cell>
                    { this._buildCommonCells(item, `total${i}`) }
                </Row>
            );
        }

        footer.push(this._buildMainGrandTotal());

        return footer;
    }

    _buildMainGrandTotal() {
        const grandTotal = this.state.gridData.GrandTotal;
        if (!grandTotal) {
            return null;
        }

        return (
            <Row key="grandTotal" className="fixed-table-grant-total">
                <Cell title={TotalText.Total}>{TotalText.Total}</Cell>
                <Cell title={`${TotalText.Based} ${grandTotal.CurrencyName}`} className="center-align" colSpan='2'>{`${TotalText.Based} ${grandTotal.CurrencyName}`}</Cell>
                { this._buildCommonCells(grandTotal, 'grandTotal') }
            </Row>
        )
    }

    _buildDetailFooter() {
        const totalData = this.state.gridData.Total;
        const subs = Object.keys(totalData);
        const rowSpan = subs.length;
        
        let footer = [];
        for (let i = 0; i < rowSpan; i++) {
            const totalName = subs[i];
            const item = totalData[totalName];

            footer.push(
                <Row className="fixed-table-total" key={`total${i}`}>
                    { i === 0 && <Cell title={`${TotalText.TotalIn} ${this.baseCurrency}`} colSpan='3' rowSpan={rowSpan} className="center-align">
                        {`${TotalText.TotalIn} ${this.baseCurrency}`}
                    </Cell> }
                    <Cell title={item.CurrencyName} className="center-align" colSpan='1'>{item.CurrencyName}</Cell>
                    { this._buildCommonCells(item, `total${i}`) }
                </Row>
            );
        }

        footer.push(this._buildDetailGrandTotal());

        return footer;
    }

    _buildDetailGrandTotal() {
        const grandTotal = this.state.gridData.GrandTotal;
        if (!grandTotal) {
            return null;
        }

        return (
            <Row key="grandTotal" className="fixed-table-grant-total">
                <Cell title={`${TotalText.TotalIn} ${grandTotal.CurrencyName}`} className="center-align" colSpan='4'>{`${TotalText.TotalIn} ${grandTotal.CurrencyName}`}</Cell>
                { this._buildCommonCells(grandTotal, 'grandTotal') }
            </Row>
        )
    }

    _buildCommonCells(data, index) {
        const betcount = NumberFormat.format(data.BetCount),
            turnover = NumberFormat.formatDecimal(data.Turnover),
            customerWinLoss = NumberFormat.formatDecimal(data.CustomerWinLoss),
            subsidiaryWinLoss = NumberFormat.formatDecimal(data.SubsidiaryWinLoss);

        const cells = [
            <Cell key={`${index}-bc`} title={betcount} className="right-align">{betcount}</Cell>,
            <Cell key={`${index}-tn`} title={turnover} className="right-align">{turnover}</Cell>,
            <Cell key={`${index}-cw`} title={customerWinLoss} className="right-align">{customerWinLoss}</Cell>,
            <Cell key={`${index}-sw`} title={subsidiaryWinLoss} className={`right-align ${data.SubsidiaryWinLoss < 0 ? "negative" : ""}`}>{subsidiaryWinLoss}</Cell>,
        ];

        return cells;
    }

    render() {
        const { Data } = this.state.gridData;
        if (!Data) {
            return null;
        }

        if (!Data.length) {
            return (<NoDataTitle />);
        }

        return (
            <Table
                minWidth={600}
                autoWidth={true}
                bodyHeight={300}
                header={this._buildHeader()}
                body={this._buildBody()}
                footer={this._buildFooter()}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { toggleLoader, setParams } = ActionCreators;
    return bindActionCreators({ toggleLoader, setParams }, dispatch);
}

function mapStateToProps(state) {
    const { xsrfToken, params } = state;
    return Object.assign({}, { xsrfToken, params });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);