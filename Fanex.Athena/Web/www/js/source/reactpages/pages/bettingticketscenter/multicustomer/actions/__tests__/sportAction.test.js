import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import * as types from '../types'
import DataService from '@jsroot/lib/DataService.js';
import * as actions from '../sportAction';

jest.mock('../leagueAction');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sportAction ', () => {
    it('setSelectedSport - should create correct action', () => {
        const item = { data: 123 };
        const expectedAction = {
            type: types.SET_SELECTED_SPORT,
            data: item
        }

        const result = actions.setSelectedSport(item);

        expect(result).toEqual(expectedAction)
    })

    it('setSportList - should create correct action', () => {
        const list = [123, 345];
        const expectedAction = {
            type: types.SET_SPORT_LIST,
            data: list
        }

        const result = actions.setSportList(list);

        expect(result).toEqual(expectedAction)
    })

    it('getSportList - get data from service', () => {
        const response = { data: [1,2,3] };
            
        const promise = Promise.resolve(response);
        DataService.getData = jest.fn(() => promise);
        const productCode = "SB";
        const date = new Date(2018, 11, 24);
        const store = mockStore({ });

        store.dispatch(actions.getSportList(productCode, date));
        
        promise.then(() => {
            expect(DataService.getData).toHaveBeenCalledWith('/api/CommonDataApi/GetSports', {"productCode": productCode});
            done();
        });
    });
})