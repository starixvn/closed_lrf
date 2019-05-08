import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import DataService from '../../../lib/DataService';
import { getApiActionLink } from '../../../lib/integrationService';
import { systemType, currentMode, mode, apiInfo } from '../../../constants/integrationInfo';

export class CustomerBettingStatus extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        if (currentMode === mode.parasitic) {
            this._fetchData();
        }
    }

    _fetchData() {
        const { custBettingStatus } = apiInfo;
        const actionLink = getApiActionLink(custBettingStatus.type, custBettingStatus.action);
        DataService.postDataFromExternal(actionLink, {})
            .then(response => {
                this.setState({ data: response.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (currentMode === mode.self) {
            return (<div>This site don't support api data for customer betting status</div>);
        }

        const { data } = this.state;
        return data && (
            <div>
                <h4>Customer Betting Status (Call From LAP)</h4>
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
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    return Object.assign({}, {});
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBettingStatus);