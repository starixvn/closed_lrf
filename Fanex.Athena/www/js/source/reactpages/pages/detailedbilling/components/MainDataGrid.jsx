import React, { Component } from 'react';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid';
import NumberFormat from '@jsroot/lib/numberFormat';
import { HeaderText } from '../lib/service';

export default class MainDataGrid extends Component {
    constructor(props) {
        super(props);
    }

    _buildHeader(width) {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={width/5}>{HeaderText.Product}</HeaderCell>
                <HeaderCell colWidth={width/5}>{HeaderText.Turnover}</HeaderCell>
                <HeaderCell colWidth={width/5}>{HeaderText.CustomerWL}</HeaderCell>
                <HeaderCell colWidth={width/5}>{HeaderText.LicenseeNetWL}</HeaderCell>
                <HeaderCell colWidth={width/5}>{HeaderText.AmountDue}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildBody(data) {
        let rows = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const turnover = NumberFormat.formatDecimal(item.Turnover),
                    customerWL = NumberFormat.formatDecimal(item.CustomerWL),
                    licenseeNetWL= NumberFormat.formatDecimal(item.LicenseeNetWL),
                    amountDue = NumberFormat.formatDecimal(item.AmountDue);
                    
            rows.push(
                <Row key={`tr${i}`}>
                    <Cell title={item.Product}>{item.Product}</Cell>
                    <Cell title={turnover} className='right-align'>{turnover}</Cell>
                    <Cell title={customerWL} className='right-align'>{customerWL}</Cell>
                    <Cell title={licenseeNetWL} className={`right-align ${item.LicenseeNetWL < 0 ? 'negative' : ''}`}>{licenseeNetWL}</Cell>
                    <Cell title={amountDue} className='right-align'>{amountDue}</Cell>
                </Row>
            );
    }

        return rows;
    }

    _buildFooter(summary) {
        let rows = [];

        if (summary) {
            for (let i = 0; i < summary.length; i++) {
                const item = summary[i];
                const amount = NumberFormat.formatDecimal(item.Amount);

                rows.push(
                    <Row className='text-bold' key={`summary-${i}`}>
                        <Cell className='left-align' colSpan='4'>{item.Description}</Cell>
                        <Cell className='right-align' title={amount}>{amount}</Cell>
                    </Row>
                );
            }
        }

        return rows;
    }

    render() {
        const { data, summary, width, containerPadding } = this.props;

        return (
            <Table
                width={width}
                minWidth={650}
                autoWidth={false}
                bodyHeight={300}
                containerPadding={containerPadding}
                header={this._buildHeader(width)}
                body={this._buildBody(data)}
                footer={this._buildFooter(summary)}
            />
        );
    }
}