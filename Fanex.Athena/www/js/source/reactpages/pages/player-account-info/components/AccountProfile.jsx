import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import DataService from '../../../lib/DataService';
import { getApiActionLink } from '../../../lib/integrationService';
import { mode, currentMode, apiInfo } from '../../../constants/integrationInfo';
import Site from '../../../lib/site.js';

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
        if (currentMode === mode.self) {
            const apiUrl = 'PlayerAccountInfo/GetAccountProfile';
            DataService.getData(Site.resolveClientUrl(apiUrl), {})
                .then(response => {
                    this.setState({ data: response.data });
                })
        }
        else {
            const { accountProfile } = apiInfo;
            const actionLink = getApiActionLink(accountProfile.type, accountProfile.action);
            DataService.getData(actionLink, {})
                .then(response => {
                    const apiActionUrl = `${response.data.ApiUrl}/${accountProfile.action}`;
                    return DataService.getData(apiActionUrl, { token: response.data.Token })
                })
                .then(response => {
                    this.setState({ data: response.data });
                })
                .catch(err => {
                    console.log(err);
                });
        }
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