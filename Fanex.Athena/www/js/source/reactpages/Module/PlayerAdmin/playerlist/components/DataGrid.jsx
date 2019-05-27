import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'

const MAX_WIDTH_PAGE = 1920;

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);

        this.maxWidth = Math.min(document.body.clientWidth, MAX_WIDTH_PAGE);
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
                <HeaderCell colWidth={100}>Email</HeaderCell>
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

    _handleSelectPlayer = (event, custId) => {
        event.preventDefault();
        this.props.setSelectedPlayer(custId)
    }

    _buildDataRow(dataItem, index) {
        return (
            <Row key={index}>
                <Cell className="center-align"><input type="checkbox" defaultChecked={false} /></Cell>
                <Cell className="center-align">{dataItem.Status}</Cell>
                <Cell className="center-align">
                    <a href="javascript:;" onClick={(e) => this._handleSelectPlayer(e, dataItem.CustId)}>{dataItem.UserName}</a>
                </Cell>
                <Cell className="center-align">{dataItem.SystemId}</Cell>
                <Cell className="center-align">{dataItem.Currency}</Cell>
                <Cell className="center-align">{dataItem.CurrentBalance}</Cell>
                <Cell className="center-align">{dataItem.OutstandingBalance}</Cell>
                <Cell className="center-align">{dataItem.OddsGroup}</Cell>
                <Cell className="center-align"><input type="checkbox" defaultChecked={dataItem.BaStatus} /></Cell>
                <Cell className="center-align">{dataItem.SpecialLevel}</Cell>
                <Cell className="center-align">{dataItem.LastTransaction}</Cell>
                <Cell className="center-align">{dataItem.Email}</Cell>
            </Row>
        )
    }

    render() {
        const { playerList } = this.props;

        return playerList && (
            <div className="result-content">
                <Table minWidth={650}
                    autoWidth={true}
                    maxWidth={this.maxWidth}
                    autoHeight={false}
                    bodyHeight={300}
                    adjustedHeight={32}
                    header={this._renderHeader()}
                    body={this._renderDataSection(playerList)}
                    containerPadding={30}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { setSelectedPlayer } = ActionCreators;
    return bindActionCreators({ setSelectedPlayer }, dispatch);
}

function mapStateToProps(state) {
    const { playerList, selectedPlayer } = state;
    return Object.assign({}, { playerList, selectedPlayer });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);