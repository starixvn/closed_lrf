import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index'
import AppLayout from '../../../layouts/AppLayout'
import AccountProfile from './AccountProfile';
import CustomerBettingStatus from './CustomerBettingStatus';
import FastCrossLink from './FastCrossLink';
import { currentMode } from '../../../constants/integrationInfo';

const AppContainer = (props) => {
    return (
        <AppLayout>
            PlayerAccountInfo from {currentMode}
            <AccountProfile />
            <CustomerBettingStatus />
            <FastCrossLink />
        </AppLayout>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, { });
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));