import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);
    }

    _renderHeader() {
        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={30}><input type="checkbox" /></HeaderCell>
                <HeaderCell colWidth={80}>Status</HeaderCell>
                <HeaderCell colWidth={80}>Username</HeaderCell>
                <HeaderCell colWidth={100}>SystemId</HeaderCell>
                <HeaderCell colWidth={60}>Currency</HeaderCell>
                <HeaderCell colWidth={80}>Current Balance</HeaderCell>
                <HeaderCell colWidth={80}>Outstanding Balance</HeaderCell>
                <HeaderCell colWidth={70}>Odds Group</HeaderCell>
                <HeaderCell colWidth={70}>BA Status</HeaderCell>
                <HeaderCell colWidth={70}>Special Level</HeaderCell>
                <HeaderCell colWidth={100}>Last Transaction</HeaderCell>
            </HeaderRow>
        )
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        for (let i = 0; i < dataList.length; i++) {
            const dataItem = dataList[i];
            dataRows.push(this._buildDataRow(dataItem, i));
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        return (
            <Row key={index}>
                <Cell className="center-align"><input type="checkbox" defaultChecked={false} /></Cell>
                <Cell className="center-align">{dataItem.Status}</Cell>
                <Cell className="center-align">{dataItem.UserName}</Cell>
                <Cell className="center-align">{dataItem.SystemId}</Cell>
                <Cell className="center-align">{dataItem.Currency}</Cell>
                <Cell className="center-align">{dataItem.CurrentBalance}</Cell>
                <Cell className="center-align">{dataItem.OutstandingBalance}</Cell>
                <Cell className="center-align">{dataItem.OddsGroup}</Cell>
                <Cell className="center-align"><input type="checkbox" defaultChecked={dataItem.BaStatus} /></Cell>
                <Cell className="center-align">{dataItem.SpecialLevel}</Cell>
                <Cell className="center-align">{dataItem.LastTransaction}</Cell>
            </Row>
        )
    }

    render() {
        const { playerList } = this.props;

        return playerList && (
            <div className="result-content">
                <Table minWidth={650}
                    autoWidth={true}
                    autoHeight={false}
                    bodyHeight={300}
                    adjustedHeight={32}
                    header={this._renderHeader()}
                    body={this._renderDataSection(playerList)} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { searchPlayer } = ActionCreators;
    return bindActionCreators({ searchPlayer }, dispatch);
}

function mapStateToProps(state) {
    const { playerList } = state;
    return Object.assign({}, { playerList });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);