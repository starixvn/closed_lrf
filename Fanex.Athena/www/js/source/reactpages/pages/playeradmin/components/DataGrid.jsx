import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

import { Table, HeaderRow, HeaderCell, Row, Cell } from '@9softstudio/react-grid'
import DataService from '../../../lib/DataService';
import Site from '@jsroot/lib/site'
import { getApiActionLink } from '../../../lib/integrationService';
import { mode, currentMode, apiInfo } from '../../../constants/integrationInfo';

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this._fetchData();
    }
    

    componentDidUpdate(prevProps, prevState) {
        const { param } = this.props;
        if (param !== prevProps.param) {
            this._fetchData();
        }
    }

    _fetchData() {
        if (currentMode === mode.self) {
            DataService.postData(Site.resolveClientUrl('PlayerAdmin/GetPlayerList'), this.props.param)
                .then(response => {
                    this.setState({ data: response.data });
                })
        }
        else {
            const { playerList } = apiInfo;
            const actionLink = getApiActionLink(playerList.type, playerList.action);
            DataService.getData(actionLink, {})
                .then(response => {
                    const apiActionUrl = `${response.data.ApiUrl}/${playerList.action}`;

                    return DataService.getData(apiActionUrl, { ...this.props.param, token: response.data.Token })
                })
                .then(response => {
                    this.setState({ data: response.data });
                })
                .catch(err => {
                    console.log(err);
                });
        }
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
        const { data } = this.state;

        return data && (
            <div className="result-content">
                <Table minWidth={650}
                    autoWidth={true}
                    autoHeight={false}
                    bodyHeight={300}
                    adjustedHeight={32}
                    header={this._renderHeader()}
                    body={this._renderDataSection(data)} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    const { param } = state;
    return Object.assign({}, { param });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);