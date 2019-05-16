import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import { Service } from '../lib/service'
import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'
import NoDataTitle from '@jsroot/components/NoDataTitle'
import MainDataGrid from './MainDataGrid'
import ExchangeDataGrid from './ExchangeDataGrid'

const URL = Site.resolveClientUrl('api/DetailedBillingReport/GetData');

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.requestParam.Timestamp !== this.props.requestParam.Timestamp) {
            this._getData(this.props.requestParam);
        }
        else {
            this.props.toggleLoader(false);
        }
    }

    _getData(params){
        this.props.toggleLoader(true);
        DataService.postData(URL, params).then(response => {            
            this.setState({ data: response.data });
        });
    }

    render() {
        if (!this.state.data) {
            return null;
        }

        const { Data } = this.state.data;
        
        if (!Data) {
            return null;
        }

        if (!Data.length) {
            return <NoDataTitle />
        }
        
        const { Summary, Exchange, Total, SubTotal } = this.state.data;
        const params = this.props.requestParam;

        return (
        <div>
            <MainDataGrid
                data={Data}
                summary={Summary}
                total={Total}
                subTotal={SubTotal}
                title={Service.getReportTitle(params.FromDate, params.ToDate, params.BaseCurrency)}
                width={800}
                minWidth={800}
            />
            <ExchangeDataGrid
                data={Exchange}
                title={Service.getExchangeTitle(params.ToDate)}
                baseCurrency={params.BaseCurrency}
                width={240}
                minWidth={240}
            />
        </div>);
    }
}

function mapDispatchToProps(dispatch) {
    const { toggleLoader } = ActionCreators;
    return bindActionCreators({ toggleLoader }, dispatch);
}

function mapStateToProps(state) {
    const { requestParam } = state;
    return Object.assign({}, { requestParam });
}

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);