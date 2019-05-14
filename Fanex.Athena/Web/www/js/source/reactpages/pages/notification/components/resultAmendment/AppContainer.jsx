import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from './DataGrid'
import FormFilter from './FormFilter'
import Loader from '../../../../components/Loader'
import AppLayout from '../../../../layouts/AppLayout'
import LangHelper from '../../../../lib/langHelper'

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout>
                <Loader isLoading={this.props.isLoading} />
                <FormFilter />
                <DataGrid />
            </AppLayout>
        );
    }
}

function mapStateToProps(state) {
    return Object.assign({}, { isLoading: state.isLoading });
}

export default connect(mapStateToProps)(AppContainer);