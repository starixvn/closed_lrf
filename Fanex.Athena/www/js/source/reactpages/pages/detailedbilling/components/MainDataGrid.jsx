import React, { Component } from 'react'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import NumberFormat from '@jsroot/lib/numberFormat'
import { HeaderText, TotalText } from '../lib/service'
import ReportTitle from '../../../components/ReportTitle'

export default class MainDataGrid extends Component {
    constructor(props) {
        super(props);
    }

    _buildHeader(width) {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={width/5} title={HeaderText.Product}>{HeaderText.Product}</HeaderCell>
                <HeaderCell colWidth={width/5} title={HeaderText.Turnover}>{HeaderText.Turnover}</HeaderCell>
                <HeaderCell colWidth={width/5} title={HeaderText.CustomerWL}>{HeaderText.CustomerWL}</HeaderCell>
                <HeaderCell colWidth={width/5} title={HeaderText.LicenseeNetWL}>{HeaderText.LicenseeNetWL}</HeaderCell>
                <HeaderCell colWidth={width/5} title={HeaderText.AmountDue}>{HeaderText.AmountDue}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildBody(data) {
        let rows = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const turnover = NumberFormat.format(item.Turnover),
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

    _buildFooter(subTotal, total, summary) {
        let rows = [];

        const subTotalText = NumberFormat.format(subTotal),
            totalText = NumberFormat.formatDecimal(total);

        rows.push(
            <Row className='text-bold' key='SubTotal'>
                    <Cell className='left-align' colSpan='4'>{TotalText.SubTotal}</Cell>
                    <Cell className='right-align' title={subTotalText}>{subTotalText}</Cell>
            </Row>
        );

        if (summary) {
            const discount = NumberFormat.formatDecimal(summary.Discount),
                deductAMF= NumberFormat.formatDecimal(summary.DeductAMF),
                deductPrepayment = NumberFormat.formatDecimal(summary.DeductPrepayment);

            rows.push(
                <Row className='text-bold' key='Discount'>
                    <Cell className='left-align' colSpan='4'>{'Less'}</Cell>
                    <Cell className='right-align' title={discount}>{discount}</Cell>
                </Row>,
                <Row className='text-bold' key='DeductAMF'>
                    <Cell className='left-align' colSpan='4'>{TotalText.DeductAMF}</Cell>
                    <Cell className='right-align' title={deductAMF}>{deductAMF}</Cell>
                </Row>,
                <Row className='text-bold' key='DeductPrepayment'>
                    <Cell className='left-align' colSpan='4'>{TotalText.DeductPrepayment}</Cell>
                    <Cell className='right-align' title={deductPrepayment}>{deductPrepayment}</Cell>
                </Row>
            );
        }

        rows.push(
            <Row className='text-bold' key='Total'>
                <Cell className='left-align' colSpan='4'>{TotalText.Total}</Cell>
                <Cell className='right-align' title={totalText}>{totalText}</Cell>
            </Row>
        );

        return rows;
    }

    render() {
        const { data, summary, total, subTotal } = this.props;
        
        if (!data) {
            return null;
        }

        const { width, minWidth, title } = this.props;

        return (
            <div className='result-content'>
                <ReportTitle content={title} />
                <Table
                    width={width}
                    minWidth={minWidth}
                    autoWidth={false}
                    bodyHeight={300}
                    header={this._buildHeader(width)}
                    body={this._buildBody(data)}
                    footer={this._buildFooter(subTotal, total, null)}
                />
            </div>
        );
    }
}