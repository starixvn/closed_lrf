import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { systemType } from '../../../constants/configInfo';
import ParasiticContainerService from '../../../lib/parasiticContainerService';

const apiInfo = {
    accountProfile: {action: 'api/PlayerAccountInfo/GetAccountProfile', type: systemType.lrf}
}

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
        const { accountProfile } = apiInfo;
        const dataService = new ParasiticContainerService();
        const ajaxConfig = {
            method: 'GET',
            params: {}
        }

        dataService.fetchData(accountProfile.type, accountProfile.action, ajaxConfig)
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
                <h4>Account Profile (Call From LRF)</h4>
                <ul>
                    <li>Created Date: {data.CreatedDate}</li>
                    <li>Last Login: {data.LastLogin}</li>
                    <li>Last Txn: {data.LastTxn}</li>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile);