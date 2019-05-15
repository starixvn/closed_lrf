import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

export class AccountProfile extends PureComponent {
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
        this.props.getAccountInfo(params)
            .then(result => {
                this.setState({ data: result });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { data } = this.state;
        return data && (
            <div>
                <h4>Account Profile (Call From LRF & LAP)</h4>
                <ul>
                    <li>Created Date: {data.CreatedDate}</li>
                    <li>Last Login: {data.LastLogin}</li>
                    <li>Last Txn: {data.LastTxn}</li>
                    <li>Email (LAP): {data.Email}</li>
                    <li>LapInfo1 (LAP): {data.LapInfo1}</li>
                    <li>LapInfo2 (LAP): {data.LapInfo2}</li>
                </ul>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    const { getAccountInfo } = ActionCreators;
    return bindActionCreators({ getAccountInfo }, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, {});
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile);