import React, { Component } from 'react';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid';
import { HeaderText } from '../lib/service';

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
            const currency = baseCurrencyList[i];
            const rate = data[currency];

            rows.push(
                <Row key={currency}>
                    <Cell className='center-align'>{currency}</Cell>
                    <Cell title={rate} className='center-align'>{rate}</Cell>
                </Row>
            );
        }
        return rows;
    }

    render() {
        const { data, width, baseCurrency, containerPadding } = this.props;

        return (
            <Table
                width={width}
                minWidth={240}
                autoWidth={false}
                bodyHeight={300}
                containerPadding={containerPadding}
                header={this._buildHeader(baseCurrency, width)}
                body={this._buildBody(data)}
            />
        );
    }
}