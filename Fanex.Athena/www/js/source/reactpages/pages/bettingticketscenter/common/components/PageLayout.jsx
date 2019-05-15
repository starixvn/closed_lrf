import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { ActionCreators } from './action.js'
import AppLayout from '@jsroot/layouts/AppLayout'
import Loader from '@jsroot/components/Loader'
import { Tabs, Tab } from '@9softstudio/react-simple-tab'
import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'
import BetList from '../lib/BetList'
import Popup from '@jsroot/components/popup'

export class PageLayout extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isShowPopup : false,
            popupUrl: null,
            popupTitle: null
        };

    }
    
    componentDidMount() {
        window.onload = () => {
            window.logOpenBetlistEvent && window.logOpenBetlistEvent("BTC");
        };
        
        window.ViewResult = (...args) => {
            const url = BetList.getResultUrl.apply(BetList, args);
            this._openPopup(url, LangHelper.getSingleResource("Result"));
        };

        window.showMP = (transId) => {
            var divEvent = document.querySelector('#divEvent_' + transId);
            divEvent.classList.add("mx-parlay"); //to make line-through for void-parlay-ticket
            this._showMixParlayDetail(transId, divEvent);
        };

        window.showCombMP = (transId, index) => {
            var divEvent = document.querySelector('#divEvent_' + transId + "" + index);
            divEvent.classList.add("mx-parlay"); //to make line-through for void-parlay-ticket
            this._showMixParlayDetail(transId, divEvent);
        };

        // expand choice content
        window.showNewCombMP = (...args) => {
            this._showNewParlayDetail.apply(this, args);
        };

        // expand choice content
        window.showSingleMatchParlayDetail = (...args) => {
            this._showSingleMatchParlayDetail.apply(this, args);
        };

        // show detail popup (in choice column)
        window.showCombMPDetail = (transId, refNo, betId, custId, betTeam) => {
            const baseCurrency =  this.props.isConvertAll ? this.props.selectedBaseCurrency : '';
            const url = BetList.getParlayDetailUrl(transId, refNo, betId, custId, betTeam, baseCurrency);
            this._openPopup(url, betTeam);
        };

        window.ViewCashOutHistory = (transId, refNo, betType, betdaqId) => {
            const baseCurrency =  this.props.isConvertAll ? this.props.selectedBaseCurrency : '';
            const {url, isCashOut } = BetList.getCashOutHistoryPopupSetting(baseCurrency, transId, refNo, betType, betdaqId);
            const title = LangHelper.getSingleResource(isCashOut ? "CashOutDetails" : "BoughtDetails");
            this._openPopup(url, title);
        }

        window.ShowBonusDetails = (refCode, transId) => {
            const baseCurrency = this.props.isConvertAll ? this.props.selectedBaseCurrency : '';
            const url = BetList.getBonusDetailUrl(refCode, transId, baseCurrency);

            const title = LangHelper.getSingleResource("TransactionDetail");
            this._openPopup(url, title);
        }
    }
    componentWillUnmount() {
        window.showMP = undefined;
        window.showCombMP = undefined;
        window.ViewResult = undefined;
        window.showNewCombMP = undefined;
        window.showCombMPDetail = undefined;
        window.ViewCashOutHistory = undefined;
        window.ShowBonusDetails = undefined;
        window.showSingleMatchParlayDetail = undefined;
    }
    
    _showMixParlayDetail(transId, divEvent) {
        if (divEvent.style.display === 'none') {
            this.props.toggleLoader(true);
            var url = Site.resolveClientUrl('api/MixParlayBetList/Detail?transId=' + transId);
            axios.get(url)
               .then((result) => {               
                   let choice = "";
                   const length = result.data.length;
                   for(let i = 0; i < length; i++) {
                       choice += result.data[i];
                       if (i < length - 1) {
                           choice += "<div class='line'></div>";
                       }
                   }
                   
                   divEvent.innerHTML = choice;
                   divEvent.style.display = 'block';
                   this.props.toggleLoader(false);
               }).catch(function (error) {
                   console.log(error);
               });
        }
        else {
            divEvent.style.display = 'none';
            divEvent.innerHTML = "";
        }
    }

    _showNewParlayDetail (transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId) {
        let divEvent = document.querySelector('#divEvent_' + transId + "" + transIndex);
        let nameDiv = document.querySelector('#combinationOfferName_' + transId + transIndex);
        divEvent.classList.add("mx-parlay"); //to make line-through for void-parlay-ticket
        
        if (divEvent.style.display == "none") {
            let url = BetList.getChoiceParlayDetailUrl(transId, refNo, handicap1, handicap2, betcheck, betteam, custId);
            this.props.toggleLoader(true);
            axios.get(url)
               .then((result) => {
                   let choice = BetList.buildChoiceParlayDetail(result.data);
                   divEvent.innerHTML = choice;
                   divEvent.style.display = 'block';
                   nameDiv.style.display = 'none';
                   this.props.toggleLoader(false);
               }).catch(function (error) {
                   console.log(error);
               });
        }
        else {
            divEvent.style.display = 'none';
            divEvent.innerHTML = "";
            nameDiv.style.display = 'block';
        }
    }

    _showSingleMatchParlayDetail (transId, custId, status, transIndex) {
        let divEvent = document.querySelector('#divEvent_' + transId + "" + transIndex);
        
        if (divEvent.style.display == "none") {
            let url = BetList.getSingleMatchParlayDetailUrl(transId, custId, status);
            this.props.toggleLoader(true);
            axios.get(url)
               .then((result) => {
                   let selection = BetList.buildSingleMatchParlayDetail(result.data);
                   
                   divEvent.innerHTML = selection;
                   divEvent.style.display = 'block';
                   this.props.toggleLoader(false);
               }).catch(function (error) {
                   console.log(error);
               });
        }
        else {
            divEvent.style.display = 'none';
            divEvent.innerHTML = '';
        }
    }

    _openPopup (url, title) {
        this.setState({ isShowPopup: true, popupUrl: url, popupTitle: title});
    }

    _closePopup(){
        this.setState({ isShowPopup: false });
    }

    render() {
        return (
            <AppLayout>
                <Loader isLoading={this.props.isLoading} />
                <Tabs>
                     <Tab isActive={this.props.selectedTabIndex == 0} label={LangHelper.getSingleResource("MultiCustomers")}
                        url={Site.resolveClientUrl("BettingTicketCenter/MultipleCustomers")}>
                    </Tab>
                    <Tab isActive={this.props.selectedTabIndex == 1} label={LangHelper.getSingleResource("SingleCustomer")}
                        url={Site.resolveClientUrl("BettingTicketCenter/SingleCustomer")}>
                    </Tab>
                    <Tab isActive={this.props.selectedTabIndex == 2} label={LangHelper.getSingleResource("RefNo")}
                        url={Site.resolveClientUrl("BettingTicketCenter/RefNo")}>
                    </Tab>
                    <Tab isActive={this.props.selectedTabIndex == 3} label={LangHelper.getSingleResource("Running")}
                        url={Site.resolveClientUrl("BettingTicketCenter/Running")}>
                    </Tab>
                </Tabs>
                <div>
                    {this.props.children}
                </div>
                 {this.state.isShowPopup &&
                       <Popup isShow={true} 
                            iframeUrl={this.state.popupUrl}
                            title={this.state.popupTitle}
                            width={900} height={600}
                            onClose={() => this._closePopup()}
                            >
                    </Popup>}
            </AppLayout>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
};

function mapStateToProps(state) {
    const { isConvertAll, selectedBaseCurrency } = state;
    return Object.assign({}, { isConvertAll, selectedBaseCurrency } );
}

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);