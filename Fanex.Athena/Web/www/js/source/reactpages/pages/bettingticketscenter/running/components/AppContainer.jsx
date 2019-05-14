import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from './DataGrid'
import FormFilter from './FormFilter'
import PageLayout from '../../common/components/PageLayout'

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PageLayout selectedTabIndex="3" isLoading={this.props.isLoading}>
                <FormFilter />
                <DataGrid />
            </PageLayout>
        );
    }
}

function mapStateToProps(state) {
    return Object.assign({}, { isLoading: state.isLoading });
}

export default connect(mapStateToProps)(AppContainer);