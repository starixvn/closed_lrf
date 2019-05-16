import React, { Component } from 'react'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import { HeaderText } from '../lib/service'
import ReportTitle from '../../../components/ReportTitle'

export default class ExchangeDataGrid extends Component {
    constructor(props) {
        super(props);
    }

    _buildHeader(baseCurrency, width) {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={width/2} title={HeaderText.Currency}>{HeaderText.Currency}</HeaderCell>
                <HeaderCell colWidth={width/2} title={`${baseCurrency}/ 1 ${HeaderText.Unit}`}>{`${baseCurrency}/ 1 ${HeaderText.Unit}`}</HeaderCell>
            </HeaderRow>
        );
    }

    _buildBody(data) {
        let rows = [];
        const baseCurrencyList = Object.keys(data);
        for (let i = 0; i < baseCurrencyList.length; i++) {
            const currrency = baseCurrencyList[i];

            rows.push(
                <Row key={currrency}>
                    <Cell title={currrency} className='center-align'>{currrency}</Cell>
                    <Cell title={data[currrency]} className='center-align'>{data[currrency]}</Cell>
                </Row>
            );
        }
        return rows;
    }

    render() {
        const { data } = this.props;
        
        if (!data) {
            return null;
        }

        const { width, minWidth, title, baseCurrency } = this.props;

        return (
            <div className='result-content exchange-table'>
                <ReportTitle content={title} />
                <Table
                    minWidth={minWidth}
                    width={width}
                    autoWidth={false}
                    bodyHeight={300}
                    header={this._buildHeader(baseCurrency, width)}
                    body={this._buildBody(data)}
                    />
            </div>
        );
    }
}