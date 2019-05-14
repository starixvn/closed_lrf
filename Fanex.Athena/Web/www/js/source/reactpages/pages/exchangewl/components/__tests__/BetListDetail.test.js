import React from 'react';
import BetListDetail from '../BetListDetail';
import renderer from 'react-test-renderer';

import LangHelper from '../../../../lib/langHelper';
import NumberFormat from '../../../../lib/numberFormat'

describe('BetListDetail ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((str) => str);
        NumberFormat.formatDecimal = jest.fn((str) => str);
    })

    describe('_buildHeader ', () => {
        it('match Snapshot',() => {
            const props = {}

            const betListDetail = new BetListDetail(props);
            const content = betListDetail._buildHeader();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('_buildBody ', () => {
        it('match Snapshot',() => {
            const data = [{ BetTakenDateString : '01/01/2018', OddsReq : 1.34, Stake: 1.5 , Liability : 1.8, OddsMatched : 0.5 }];

            const props = {
                data : data
            };

            const betListDetail = new BetListDetail(props);
            const content = betListDetail._buildBody();
            const result = renderer.create(<div>{content}</div>).toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('render ', () => {
        it('show no data title when gridData is empty - match snapshot',() => {
            const props = {
                data : []
            };

            const betListDetail = new BetListDetail(props);
            const content = betListDetail.render();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })

        it('show grid when gridData is not empty - match snapshot',() => {
            const data = [{ BetTakenDateString : '01/01/2018', OddsReq : 1.34, Stake: 1.5 , Liability : 1.8, OddsMatched : 0.5 }];

            const props = {
                data : data
            };

            const betListDetail = new BetListDetail(props);
            const content = betListDetail.render();
            const result = renderer.create(content).toJSON();

            expect(result).toMatchSnapshot();
        })
    })  
});