import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NoDataTitle from '../../../components/NoDataTitle'
import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import LangHelper from '../../../lib/langHelper'
import NumberFormat from '../../../lib/numberFormat'

export default class BetListDetail extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    _buildHeader() {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={100}>{LangHelper.getSingleResource("BetTaken")}</HeaderCell>
                <HeaderCell colWidth={70}>{LangHelper.getSingleResource("OddsReq")}</HeaderCell>
                <HeaderCell colWidth={70}>{LangHelper.getSingleResource("Stake")}</HeaderCell>
                <HeaderCell colWidth={70}>{LangHelper.getSingleResource("Liability")}</HeaderCell>
                <HeaderCell colWidth={70}>{LangHelper.getSingleResource("OddsMatched")}</HeaderCell>
            </HeaderRow>
        )
    }

    _buildBody() {
        const { data } = this.props;
        const rows = [];
        for (let i = 0; i < data.length; i++) {
            const dataItem = data[i];
            const OddsReqString = NumberFormat.formatDecimal(dataItem.OddsReq);
            const StakeString = NumberFormat.formatDecimal(dataItem.Stake);
            const OddsMatchedString = NumberFormat.formatDecimal(dataItem.OddsMatched);

            rows.push(
                <Row key={`rowDetail-${i}`}>
                    <Cell title={dataItem.BetTakenDateString} className="center-align">{dataItem.BetTakenDateString}</Cell>
                    <Cell title={OddsReqString} className="right-align">{OddsReqString}</Cell>
                    <Cell title={StakeString} className="right-align">{StakeString}</Cell>
                    <Cell title={dataItem.Liability} className="right-align">{dataItem.Liability}</Cell>
                    <Cell title={OddsMatchedString} className="right-align">{OddsMatchedString}</Cell>
                </Row>
            );
        }

        return rows;
    }

    render() {
        const { data } = this.props;

        return data && data.length ?
            (
                <div className="popup-content-default popup-detail-default">
                    <Table
                        autoWidth={false}
                        autoHeight={false}
                        width={700}
                        bodyHeight={350}
                        header={this._buildHeader()}
                        body={this._buildBody()}
                    />
                </div>) :
            <NoDataTitle />
    }
}