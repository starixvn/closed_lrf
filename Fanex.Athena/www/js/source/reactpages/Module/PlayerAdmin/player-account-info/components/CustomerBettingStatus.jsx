import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

export class CustomerBettingStatus extends PureComponent {
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
        const params = {};
        this.props.getCustomerBettingStatus(params)
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { data } = this.state;
        return data && (
            <div>
                <h4>Customer Betting Status (Call From LRF)</h4>
                <ul>
                    <li>Win: {data.Win}</li>
                    <li>Loss: {data.Loss}</li>
                    <li>Void/Reject/Cancel: {data.VoidRejectCancel}</li>
                </ul>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { getCustomerBettingStatus } = ActionCreators;
    return bindActionCreators({ getCustomerBettingStatus }, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, {});
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBettingStatus);