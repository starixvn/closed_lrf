import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

export class DataGrid extends PureComponent {
    constructor(props) {
        super(props);
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
    return bindActionCreators({  }, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, { });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);