import React from 'react';
import axios from 'axios'

import { PageLayout } from '../PageLayout';
import BetList from '../../lib/BetList';

const DefaultProps = {
    isConvertAll: true,
    selectedBaseCurrency: 'GBP'
};
describe('PageLayout methods ', () => {
    
    it('componentDidMount - Assign functions to window', () => { 
        const pageLayout = new PageLayout(DefaultProps);
            
        pageLayout.componentDidMount();

        expect(typeof(window.ViewResult)).toBe("function");
        expect(typeof(window.showNewCombMP)).toBe("function");
        expect(typeof(window.showCombMPDetail)).toBe("function");
    });

    it('componentWillUnmount - Remove assigned window functions', () => { 
        const pageLayout = new PageLayout(DefaultProps);
            
        pageLayout.componentDidMount(); // assign 
        pageLayout.componentWillUnmount();

        expect(window.ViewResult).toBeUndefined();
        expect(window.showNewCombMP).toBeUndefined();
        expect(window.showCombMPDetail).toBeUndefined();
    });

    it('_closePopup  - set state isShowPopup = false', () => { 
        const pageLayout = new PageLayout();
        pageLayout.setState = jest.fn();

        pageLayout._closePopup();

        expect(pageLayout.setState).toHaveBeenCalledWith({ isShowPopup: false});
    });

    it('window.ViewResult() - Call Betlist and setState correctly',() =>{
        const expectedResultUrl = "www.facebook.com";
        const pageLayout = new PageLayout(DefaultProps);
        pageLayout.setState = jest.fn();
        BetList.getResultUrl = jest.fn(() => expectedResultUrl);
        pageLayout.componentDidMount();

        window.ViewResult(1,2,3,4);

        expect(BetList.getResultUrl).toHaveBeenCalledWith(1,2,3,4);
        expect(pageLayout.setState).toHaveBeenCalledWith({ isShowPopup: true, popupUrl: expectedResultUrl, popupTitle: "Result"});
    });

    it('window.showNewCombMP() - Call _showNewParlayDetail() correctly',() =>{
        const pageLayout = new PageLayout(DefaultProps);
        pageLayout._showNewParlayDetail = jest.fn();
        
        pageLayout.componentDidMount();

        window.showNewCombMP(1,2,3,4);

        expect(pageLayout._showNewParlayDetail).toHaveBeenCalledWith(1,2,3,4);
    });

    it('window.showCombMPDetail() - Call Betlist and setState correctly',() =>{
        const expectedResultUrl = "www.facebook.com";
        const expectedPopupTitle = "System ABC";
        const pageLayout = new PageLayout(DefaultProps);
        BetList.getParlayDetailUrl = jest.fn(() => expectedResultUrl);
        pageLayout.setState = jest.fn();

        pageLayout.componentDidMount();

        window.showCombMPDetail(1,2,3,4,expectedPopupTitle);

        expect(BetList.getParlayDetailUrl).toHaveBeenCalledWith(1,2,3,4,expectedPopupTitle, DefaultProps.selectedBaseCurrency);
        expect(pageLayout.setState).toHaveBeenCalledWith({ isShowPopup: true, popupUrl: expectedResultUrl, popupTitle: expectedPopupTitle});
    });

    describe('window.ViewCashOutHistory()', () => {
        it('is cash out - Call Betlist and setState correctly',() =>{
            const expectedResultUrl = "www.CashOutHistory.com";
            const expectedCashOutPopupTitle = "CashOutDetails";

            BetList.getCashOutHistoryPopupSetting = jest.fn(() => { return { url: expectedResultUrl, isCashOut: true }; });

            const pageLayout = new PageLayout(DefaultProps);
            pageLayout.setState = jest.fn();
            pageLayout.componentDidMount();

            window.ViewCashOutHistory(1,2,3,4);

            expect(BetList.getCashOutHistoryPopupSetting).toHaveBeenCalledWith(DefaultProps.selectedBaseCurrency,1,2,3,4);
            expect(pageLayout.setState).toHaveBeenCalledWith({ isShowPopup: true, popupUrl: expectedResultUrl, popupTitle: expectedCashOutPopupTitle});
        });
    
        it('is not cash out - Call Betlist and setState correctly',() =>{
            const expectedResultUrl = "www.CashOutHistory.com";
            const expectedBoughtPopupTitle = "BoughtDetails";

            BetList.getCashOutHistoryPopupSetting = jest.fn(() => { return { url: expectedResultUrl, isCashOut: false }; });

            const pageLayout = new PageLayout(DefaultProps);
            pageLayout.setState = jest.fn();
            pageLayout.componentDidMount();

            window.ViewCashOutHistory(1,2,3,4);

            expect(BetList.getCashOutHistoryPopupSetting).toHaveBeenCalledWith(DefaultProps.selectedBaseCurrency,1,2,3,4);
            expect(pageLayout.setState).toHaveBeenCalledWith({ isShowPopup: true, popupUrl: expectedResultUrl, popupTitle: expectedBoughtPopupTitle});
        });
    });    

    describe('_showMixParlayDetail()', () => {
        const transId = "abc";
        document.body.innerHTML = `<div id='divEvent_${transId}'></div>`;
        const divEvent = document.querySelector('#divEvent_' + transId);
        
        const pageLayout = new PageLayout({toggleLoader: jest.fn()});
        
        beforeAll(() =>{
            jest.mock('axios');
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('divEvent is hidden - get choice from server and append to divEvent',(done) =>{
            divEvent.style.display = "none";
            const expectedParlayDetailUrl = "/api/MixParlayBetList/Detail?transId=abc";

            const promise = Promise.resolve({
                data: '123'
            });
            axios.get = jest.fn((url, option) => promise);

            pageLayout._showMixParlayDetail(transId, divEvent);
            
            expect(axios.get).toHaveBeenCalledWith(expectedParlayDetailUrl);
            promise.then((result) => {
                expect(divEvent.innerHTML).toBe("1<div class=\"line\"></div>2<div class=\"line\"></div>3");
                expect(divEvent.style.display).toBe('block');
                done();
            });
        });

        it('divEvent is show - hide divEvent and show nameDiv',() =>{
            divEvent.style.display = "block";

            pageLayout._showMixParlayDetail(transId, divEvent);

            expect(divEvent.innerHTML).toBe("");
            expect(divEvent.style.display).toBe('none');
        });
    });

    describe('_showNewParlayDetail()', () => {
        const transId = "abc";
        const transIndex = 999;
        const refNo = "bccc";
        const handicap1 = 222;
        const handicap2 = 333;
        const betcheck = 444;
        const betteam = 555;
        const custId = 123;
        document.body.innerHTML = `<div id='divEvent_${transId}${transIndex}'></div><div id='combinationOfferName_${transId}${transIndex}'></div>`;
        let divEvent = document.querySelector('#divEvent_' + transId + "" + transIndex);
        let nameDiv = document.querySelector('#combinationOfferName_' + transId + transIndex);

        const pageLayout = new PageLayout({toggleLoader: jest.fn()});
        
        beforeAll(() =>{
            jest.mock('axios');
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('Assign class .mx-parlay to divEvent',() =>{
            pageLayout._showNewParlayDetail(transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId);

            expect(divEvent.classList.toString()).toBe('mx-parlay');
        });

        it('divEvent is hidden - get choice from server fail - log error',() =>{
            divEvent.style.display = "none";

            const promise = Promise.reject("error");
            axios.get = jest.fn((url, option) => promise);

            pageLayout._showNewParlayDetail(transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId);

            Promise.reject().catch(() => {
                expect(pageLayout.props.toggleLoader).not.toHaveBeenCalledWith(false);
            });
        });

        it('divEvent is hidden - get choice from server and append to divEvent',() =>{
            divEvent.style.display = "none";
            const expectedParlayDetailUrl = "www.alskdlf.com";

            const promise = Promise.resolve({
                data: '<div>KimJongUn</div>'
            });
            axios.get = jest.fn((url, option) => promise);

            BetList.getChoiceParlayDetailUrl = jest.fn(() => expectedParlayDetailUrl);
            BetList.buildChoiceParlayDetail = jest.fn(() => "abc");

            pageLayout._showNewParlayDetail(transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId);

            expect(BetList.getChoiceParlayDetailUrl).toHaveBeenCalledWith(transId, refNo, handicap1, handicap2, betcheck, betteam, custId);
            expect(axios.get).toHaveBeenCalledWith(expectedParlayDetailUrl);
            promise.then((result) => {
                expect(BetList.buildChoiceParlayDetail).toHaveBeenCalledWith('<div>KimJongUn</div>');
                expect(divEvent.innerHTML).toBe("abc");
                expect(divEvent.style.display).toBe('block');
                expect(nameDiv.style.display).toBe('none');
            });
        });

        it('divEvent is show - hide divEvent and show nameDiv',() =>{
            divEvent.style.display = "block";

            pageLayout._showNewParlayDetail(transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId);

            expect(divEvent.innerHTML).toBe("");
            expect(divEvent.style.display).toBe('none');
            expect(nameDiv.style.display).toBe('block');
        });
    });
});