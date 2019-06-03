import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions/index.js';
import { bindActionCreators } from 'redux';
import { Service, URL } from '../lib/service';
import DataService from '@jsroot/lib/DataService.js';
import MainDataGrid from './MainDataGrid';
import ExchangeDataGrid from './ExchangeDataGrid';
import Timer from '@jsroot/components/utils/timer.js';
import ReportTitle from '../../../components/ReportTitle';
import NoDataTitle from '@jsroot/components/NoDataTitle';

const MAIN_GRID_MIN_WIDTH = 650;
const MAX_DISTANCE_BETWEEN_GRIDS = 20;
const MIN_DISTANCE_BETWEEN_GRIDS = 5;
const EXCHANGE_GRID_MIN_WITH = 240;
const PADDING = 30;

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            mainWidth: MAIN_GRID_MIN_WIDTH,
            exchangeWidth: EXCHANGE_GRID_MIN_WITH
        };

        this.handleResize = Timer.debounce(this._resize, 400);
    }

    componentDidMount() {
        this._resize();
        window.addEventListener('resize', this.handleResize);
        console.log('componentDidMount');
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requestParam.Timestamp !== this.props.requestParam.Timestamp) {
            this._getData(this.props.requestParam);
        }
        
        if (this.state.data !== prevState.data) {
            this.props.toggleLoader(false);
        }
    }

    _resize = (e) => {
        e && e.preventDefault();

        const clientWidth = document.body.clientWidth;
        const gapWidth = clientWidth - MAIN_GRID_MIN_WIDTH - EXCHANGE_GRID_MIN_WITH - PADDING;

        if (gapWidth < MIN_DISTANCE_BETWEEN_GRIDS) {
            this.setState({ mainWidth: clientWidth, exchangeWidth: clientWidth });
        }
        else if (gapWidth > MAX_DISTANCE_BETWEEN_GRIDS) {
            this.setState({ 
                mainWidth: clientWidth - EXCHANGE_GRID_MIN_WITH - MAX_DISTANCE_BETWEEN_GRIDS,
                exchangeWidth: EXCHANGE_GRID_MIN_WITH
            });
        }
        else {
            this.setState({ 
                mainWidth: MAIN_GRID_MIN_WIDTH,
                exchangeWidth: EXCHANGE_GRID_MIN_WITH
            });
        }

        console.log('_resize');
    }

    _getData(params){
        this.props.toggleLoader(true);
        DataService.postData(URL, params)
            .then(response => this.setState({ data: response.data }))
            .catch(() => Service.showErrorMsg());
    }

    render() {
        if (!this.state.data) {
            return null;
        }
        
        const { Data, Summary, Exchange } = this.state.data;
        const { mainWidth, exchangeWidth } = this.state;
        const params = this.props.requestParam;
        
        const mainTitle = Service.getReportTitle(params.FromDate, params.ToDate, params.BaseCurrency),
            exchangeTitle = Service.getExchangeTitle(params.ToDate);
        const noMainData = !Data || !Data.length,
            noExchangeData = !Exchange || !Object.keys(Exchange).length;

        return (
        <div className='result-content'>
            <div className='main-table'>
                <ReportTitle content={mainTitle} />
                {
                    noMainData
                    ? <div style={{ width: mainWidth - (noMainData ? PADDING : 0) }}><NoDataTitle /></div>
                    : <MainDataGrid
                            data={Data}
                            summary={Summary}
                            width={mainWidth}
                            containerPadding={PADDING}
                        />
                }
            </div>
            <div className='exchange-table'>
                <ReportTitle content={exchangeTitle} />
                {
                    noExchangeData
                    ? <div style={{ width: exchangeWidth - (noExchangeData ? PADDING : 0) }}><NoDataTitle /></div>
                    : <ExchangeDataGrid
                            data={Exchange}
                            baseCurrency={params.BaseCurrency}
                            width={exchangeWidth}
                            containerPadding={PADDING}
                        />
                }
            </div>
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