import React from 'react';
import { BetList } from '../BetList';
import renderer from 'react-test-renderer';

import LangHelper from '../../../../lib/langHelper';
import NumberFormat from '../../../../lib/numberFormat'
import { Service } from '../../lib/service'
import Report from '../../../../lib/report'

describe('BetList ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((str) => str);
        NumberFormat.formatDecimal = jest.fn((str) => str);
    })

    describe('constructor ', () => {
        it('initial state',() => {
            const props = {}

            const betList = new BetList(props);
            
            expect(betList.state.showDetail).toBe(false);
            expect(betList.state.detailData).toBe(null);
        })
    })

    describe('_buildHeader ', () => {
        it('match Snapshot',() => {
            const props = {}

            const betList = new BetList(props);
            const content = betList._buildHeader();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('_buildFooter ', () => {
        it('match Snapshot',() => {
            const props = {
                data : { GrandTotal : 1 }
            };

            const betList = new BetList(props);
            const content = betList._buildFooter()[0];
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('_buildBody ', () => {
        it('match Snapshot',() => {
            const mainData = [
                {
                    Ticket : { MarketName : 'market1', EventTypeName : 'Eventtype1', EventName: 'Event1' , WinLost : 1.8, Commission : 0.5 },
                    Details : [
                        { BetId : 1, SelectionName : 'select1', Type: 'lay', BetPlacedDateString : '01/01/2018', OddsAvg : 1.2, Stake : 2.4 },
                        { BetId : 2, SelectionName : 'select2', Type: 'type2', BetPlacedDateString : '01/01/2018', OddsAvg : 3.25, Stake : 3 }
                    ]
                },
                {
                    Ticket : { MarketName : 'market2', EventTypeName : 'Eventtype2', EventName: 'Event2' , WinLost : -1.8, Commission : -0.5 },
                    Details : [{ BetId : 3, SelectionName : 'select3', Type: 'type3', BetPlacedDateString : '01/01/2018', OddsAvg : 10, Stake : 5.55 }]
                }
            ];

            const props = {
                data : { MainData : mainData }
            };

            const betList = new BetList(props);
            const content = betList._buildBody();
            const result = renderer.create(<div>{content}</div>).toJSON();

            expect(result).toMatchSnapshot();
        })

        it('click on bet list detail link - show bet list detail popup',() => {
            const mainData = [
                {
                    Ticket : { MarketName : 'market1', EventTypeName : 'Eventtype1', EventName: 'Event1' , WinLost : 1.8, Commission : 0.5 },
                    Details : [{ BetId : 1, SelectionName : 'select1', Type: 'lay', BetPlacedDateString : '01/01/2018', OddsAvg : 1.2, Stake : 2.4 }]
                }
            ];

            const props = {
                data : { MainData : mainData }
            };

            const betList = new BetList(props);
            betList._showTicketDetail = jest.fn();
            const content = betList._buildBody();
            const betListDetailComponent = content[0].props.children[2].props.children;

            betListDetailComponent.props.onClick();

            expect(betList._showTicketDetail).toHaveBeenCalled();
        })
    })

    describe('render ', () => {
        it('show no data title when gridData is empty - match snapshot',() => {
            const props = {
                data : { MainData : [] }
            };

            const betList = new BetList(props);
            const content = betList.render();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })

        it('show grid when gridData is not empty - match snapshot',() => {
            const mainData = [
                {
                    Ticket : { MarketName : 'market1', EventTypeName : 'Eventtype1', EventName: 'Event1' , WinLost : 1.8, Commission : 0.5 },
                    Details : [
                        { BetId : 1, SelectionName : 'select1', Type: 'type1', BetPlacedDateString : '01/01/2018', OddsAvg : 1.2, Stake : 2.4 }
                    ]
                }
            ];

            const props = {
                data : { MainData : mainData, GrandTotal : -1 }
            };

            const betList = new BetList(props);
            const content = betList.render();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })

        it('show bet list detail popup when show detail state is true - match snapshot',() => {
            const props = {
                data : { MainData : [] }
            };

            const betList = new BetList(props);
            betList.state = { showDetail : true, detailData : [] };
            const content = betList.render();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('closeDetailPopup ', () => {
        it('reset state',() => {
            const props = {
                data : { GrandTotal : 1 }
            };

            const betList = new BetList(props);
            betList.setState = jest.fn();

            betList.closeDetailPopup();

            expect( betList.setState).toHaveBeenCalledWith({ showDetail: false, detailData: null });
        })
    })

    describe('_showTicketDetail ', () => {
        const props = {
            params : { CustId : 1, CurrencyId : 2, BaseCurrency : 3, ExcludeTestData : 4 },
            toggleLoader : jest.fn()
        };
        const betList = new BetList(props);
        const responseData = [1, 2];
        const betId = 1, type = 2;

        beforeAll(() => {
            betList.setState = jest.fn();

            Service.showErrorMsg = jest.fn();

            const fakeReportLib = {
                then: (func) => { func({ data : responseData}); return {catch: (func) => { func('Error'); }}; }
            }

            Report.fetchGridData = jest.fn(() => fakeReportLib);

            betList._showTicketDetail(betId, type);
        })

        it('fetch bet list data with correct parameters',() => {
            expect(Report.fetchGridData).toHaveBeenCalledWith('api/ExchangeWinLossBetList/Detail', {
                data: { 
                    CustId : props.params.CustId, 
                    CurrencyId : props.params.CurrencyId, 
                    BaseCurrency : props.params.BaseCurrency, 
                    ExcludeTestData : props.params.ExcludeTestData, 
                    betId, 
                    type }
            });
        })

        it('set state when fetching data successfully',() => {
            expect(betList.setState).toHaveBeenCalledWith({ showDetail: true, detailData: responseData });
        })

        it('set state when fetching data failed',() => {
            expect(Service.showErrorMsg).toHaveBeenCalled();
        })
    })
});