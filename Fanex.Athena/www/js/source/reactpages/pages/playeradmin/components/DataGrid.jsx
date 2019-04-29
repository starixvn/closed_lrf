import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        const { param } = this.props;
        if (param !== prevProps.param) {
            this._fetchData();
        }
    }

    _fetchData() {

    }


    submit = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                Data Grid
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