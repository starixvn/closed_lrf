import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index'
import DataGrid from './DataGrid'
import FormFilter from './FormFilter'
import Loader from '../../../components/Loader'
import AppLayout from '../../../layouts/AppLayout'
import PlayerDetail from './PlayerDetail';

const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader isLoading={props.isLoading} />
            <FormFilter />
            <div className="result-content">
                <DataGrid />
            </div>
            <PlayerDetail />
        </AppLayout>
    );
}

function mapDispatchToProps(dispatch) {
    const { setParams } = ActionCreators;
    return bindActionCreators({ setParams }, dispatch);
}

function mapStateToProps(state) {
    const { isLoading } = state;
    return Object.assign({}, { isLoading });
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));