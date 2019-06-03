import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions/index.js';
import { bindActionCreators } from 'redux';

import { Table, HeaderRow, HeaderCell, Row, Cell, Pager } from '@9softstudio/react-grid';
import ReportTitle from '../../../../components/ReportTitle';
import LangHelper from '../../../../lib/langHelper';
import Switcher from '../../../../components/Switcher';
import { specialLevelListWithColor, oddsGroupListWithStyle, columnList } from '../lib/constants';
import MultipleSelect from '@9softstudio/react-multiselect';

const MAX_WIDTH_PAGE = 1920;

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);

        this.maxWidth = Math.min(document.body.clientWidth, MAX_WIDTH_PAGE);

        this.state = {
            selectedPlayerIdList: [],
            pagingOption: {
                PageIndex: 1,
                PageSize: 50,
                PageList: [50, 100, 200, 500],
                TotalItem: 1000
            }
        }

        this.specialLevelList = Object.keys(specialLevelListWithColor).map(item => {
            return {
                value: item,
                label: item === '0' ? 'None' : item
            }
        })

        this.columnList = columnList.map(item => {
            return {
                id: item,
                value: item,
                status: true
            }
        })
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
                <HeaderCell colWidth={50}>Odds Group</HeaderCell>
                <HeaderCell colWidth={50}>BA Status</HeaderCell>
                <HeaderCell colWidth={50}>Special Level</HeaderCell>
                <HeaderCell colWidth={100}>Last Transaction</HeaderCell>
                <HeaderCell colWidth={100}>Email</HeaderCell>
            </HeaderRow>
        )
    }

    _renderDropdownColumn(){
        console.log(this.columnList);
        return (
            <MultipleSelect id="columnList" className="selection-column"
                        dataSource={this.columnList}
                        keyField={"id"}
                        valueField={"value"}
                        statusField={"status"}
                        onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
        )
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        for (let i = 0; i < dataList.length; i++) {
            const dataItem = dataList[i];
            const isChecked = this.state.selectedPlayerIdList.includes(dataItem.CustId);
            dataRows.push(this._buildDataRow(dataItem, isChecked));
        }

        return dataRows;
    }

    _handleSelectPlayer = (event, playerInfo) => {
        event.preventDefault();
        const player = {
            custId: playerInfo.CustId,
            userName: playerInfo.UserName,
            currency: playerInfo.Currency
        };
        this.props.setSelectedPlayer(player);
    }

    _handleCheckPlayer = (custId) => {
        const { selectedPlayerIdList } = this.state;

        const newIdList = selectedPlayerIdList.includes(custId) ?
            selectedPlayerIdList.filter(item => item !== custId) : [...selectedPlayerIdList, custId];

        this.setState({ selectedPlayerIdList: newIdList });
    }

    _handleChangeBaStatus = (e) => {
        console.log(e.target)
    }

    _buildDataRow(dataItem, isChecked) {
        return (
            <Row key={dataItem.CustId}>
                <Cell className="center-align">
                    <input type="checkbox" checked={isChecked} onChange={() => this._handleCheckPlayer(dataItem.CustId)} />
                </Cell>
                <Cell className="center-align">{dataItem.Status}</Cell>
                <Cell className="center-align">
                    <a href="javascript:;" onClick={(e) => this._handleSelectPlayer(e, dataItem)}>{dataItem.UserName}</a>
                </Cell>
                <Cell className="center-align">{dataItem.SystemId}</Cell>
                <Cell className="center-align">{dataItem.Currency}</Cell>
                <Cell className="center-align">{dataItem.CurrentBalance}</Cell>
                <Cell className="center-align">{dataItem.OutstandingBalance}</Cell>
                <Cell className="center-align">
                    <select className="select-default select-oddsgroup" value={dataItem.OddsGroup} onChange={(e) => console.log(e)}>
                        {
                            Object.keys(oddsGroupListWithStyle).map(item => {
                                return(
                                    <option key={item} style={oddsGroupListWithStyle[item]}>{item}</option>
                                )
                            })
                        }
                    </select>
                </Cell>
                <Cell className="center-align"><Switcher checked={dataItem.BaStatus} onChange={this._handleChangeBaStatus} /></Cell>
                <Cell className="center-align">
                    <select className="select-default select-special-level" value={dataItem.SpecialLevel} onChange={(e) => console.log(e)}>
                        {this.specialLevelList.map(item => {
                            const style = {backgroundColor: specialLevelListWithColor[item.value]};
                            return(
                                <option key={item.value} style={style}>{item.label}</option>
                            )
                        })}
                    </select>
                </Cell>
                <Cell className="center-align">{dataItem.LastTransaction}</Cell>
                <Cell className="center-align">{dataItem.Email}</Cell>
            </Row>
        )
    }

    _buildReportTitleContent() {
        const { selectedPlayer } = this.props;
        const { selectedPlayerIdList } = this.state;
        const titleContentList = [];
        if (selectedPlayer) {
            titleContentList.push(
                <React.Fragment key="selectedPlayer">
                    <span className="link" onClick={() => this.props.setSelectedPlayer(null)}>Previous search result</span>
                    <span> <strong>></strong> Player: {selectedPlayer.userName} ({selectedPlayer.currency})</span>
                </React.Fragment>
            )
        }
        else if (selectedPlayerIdList.length > 0) {
            titleContentList.push(
                <React.Fragment key="batchUpdate">
                    <button>BATCH UPDATE</button>
                    <button>{selectedPlayerIdList.length} Player(s) Selected</button>
                </React.Fragment>
            )
        }
        else {
            const { playerList } = this.props;
            titleContentList.push(<span key="searchResult">{`Search Result: ${playerList.length} Player(s)`}</span>);
        }

        titleContentList.push(
            (
                <span key="caretBlock" className="caret-block">
                    {/* <button>Select column</button> */}
                    {this._renderDropdownColumn()}
                    <span className="icon-excel-wrapper"><i className="icon-excel" title={LangHelper.getSingleResource('ExportToExcel')}></i></span>
                </span>
            )
        );

        return titleContentList;
    }

    render() {
        const { playerList, selectedPlayer } = this.props;
        const { pagingOption } = this.state;

        const dataList = selectedPlayer ? [playerList.find(item => item.CustId === selectedPlayer.custId)] : playerList;

        return playerList && (
            <div className="result-content">
                <Pager pageOption={pagingOption} />
                <ReportTitle content={this._buildReportTitleContent()} />
                <Table minWidth={650}
                    autoWidth={true}
                    maxWidth={this.maxWidth}
                    autoHeight={false}
                    bodyHeight={300}
                    adjustedHeight={32}
                    header={this._renderHeader()}
                    body={this._renderDataSection(dataList)}
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