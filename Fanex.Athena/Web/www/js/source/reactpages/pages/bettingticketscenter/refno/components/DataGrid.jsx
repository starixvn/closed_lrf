import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ActionCreators } from '../actions'
import { HeaderRow, Row, HeaderCell, Cell } from '@9softstudio/react-grid'
import BaseDataGrid from '../../common/components/BaseDataGrid'
import Service from '../../common/lib/Service'
import ApiUrl from '../../common/constants/apiUrl'
import AppData from '@jsroot/lib/AppData'

export class DataGrid extends BaseDataGrid {
    constructor(props) {
        super(props);
    }
     
    get dataUrl(){
        return ApiUrl.REFNO_DATA_URL;
    }

    _buildHeader() {
        var headerText = Service.getHeaderText();
        const licenseeWLText = `${headerText.LicenseeWL}/${headerText.Comm}`;
        const winlossText = AppData.isAllowedCustomerComm ? `${headerText.WinLoss}/${headerText.Comm}` : headerText.WinLoss;

        return (
            <HeaderRow style={{ height: 32 }}>
                <HeaderCell colWidth={40} title={headerText.Index}>{headerText.Index}</HeaderCell>               
                <HeaderCell colWidth={120} title={headerText.ExternalId}>{headerText.ExternalId}</HeaderCell>
                <HeaderCell colWidth={120} title={headerText.SystemId}>{headerText.SystemId}</HeaderCell>
                <HeaderCell colWidth={110} title={headerText.RefNo}>{headerText.RefNo}</HeaderCell>
                <HeaderCell colWidth={150} title={headerText.TransTime}>{headerText.TransTime}</HeaderCell>
                <HeaderCell colWidth={400} title={headerText.Choice}>{headerText.Choice}</HeaderCell>
                <HeaderCell colWidth={70} title={headerText.Odds}>{headerText.Odds}</HeaderCell>
                <HeaderCell colWidth={70} title={headerText.OddsType}>{headerText.OddsType}</HeaderCell>
                <HeaderCell colWidth={100} title={headerText.Stake}>{headerText.Stake}</HeaderCell>
                <HeaderCell colWidth={100} title={winlossText}>{winlossText}</HeaderCell>
                <HeaderCell colWidth={100} title={licenseeWLText}>{licenseeWLText}</HeaderCell>
                <HeaderCell colWidth={80} title={headerText.Status}>{headerText.Status}</HeaderCell>
                <HeaderCell colWidth={80} title={headerText.Platform}>{headerText.Platform}</HeaderCell>
                <HeaderCell colWidth={80} title={headerText.Live}>{headerText.Live}</HeaderCell>
            </HeaderRow>
        )
    }
  }

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
  }
function mapStateToProps(state) {
    const { requestParam, gridData, reportTitle } = state;
    return Object.assign({}, { requestParam, gridData, reportTitle });
  };

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);