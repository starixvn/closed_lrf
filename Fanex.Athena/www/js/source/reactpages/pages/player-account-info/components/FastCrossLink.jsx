import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import DataService from '../../../lib/DataService';
import { getActionLink } from '../../../lib/integrationService';

export class FastCrossLink extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData() {
    }

    render() {
        const { data } = this.state;
        return data && (
            <div>
                <h4>Fast Cross Link</h4>
                <ul>
                    <li><a href="#">Betting Ticket Center</a></li>
                    <li><a href="#">Customer Win Loss</a></li>
                </ul>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, {});
};

export default connect(mapStateToProps, mapDispatchToProps)(FastCrossLink);