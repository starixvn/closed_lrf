import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import * as types from '../types'
import DataService from '@jsroot/lib/DataService.js';
import Site from '@jsroot/lib/site'
import Cache from '@jsroot/lib/Cache'
import * as actions from '../leagueAction';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('leagueAction ', () => {
    it('setSelectedLeague - should create correct action', () => {
        const item = { data: 123 };
        const expectedAction = {
            type: types.SET_SELECTED_LEAGUE,
            data: item
        }

        const result = actions.setSelectedLeague(item);

        expect(result).toEqual(expectedAction)
    })

    it('setLeagueList - should create correct action', () => {
        const list = [123, 345];
        const expectedAction = {
            type: types.SET_LEAGUE_LIST,
            data: list
        }

        const result = actions.setLeagueList(list);

        expect(result).toEqual(expectedAction)
    })

    describe('getLeagueList', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('cache does not contain data - get data from service', (done) => {
            const response = { data: [1,2,3] };
            
            const promise = Promise.resolve(response);
            DataService.getData = jest.fn(() => promise);
            Site.resolveClientUrl = jest.fn((url) => url);
            Cache.get = jest.fn();
            Cache.set = jest.fn();
            const sportId = 123;
            const date = new Date(2018, 11, 24);
            const store = mockStore({ });

            store.dispatch(actions.getLeagueList(sportId, date));
        
            promise.then(() => {
                expect(DataService.getData)
                    .toHaveBeenCalledWith('/api/CommonDataApi/GetLeagues', {"fromDate": "2018-12-24", "sportId": sportId, "toDate": "2018-12-24"});
                expect(Cache.set).toHaveBeenCalledWith("LEAGUE_CACHE_KEY123_2018-12-24", response.data);
                done();
            });
        });

        it('cache contains data - not get data from service', () => {
            Cache.get.mockReturnValue([]);
            Cache.set = jest.fn();
            DataService.getData = jest.fn();
            const sportId = 123;
            const date = new Date(2018, 11, 24);
            const store = mockStore({ });

            store.dispatch(actions.getLeagueList(sportId, date));
        
            expect(DataService.getData).not.toHaveBeenCalled();
            expect(Cache.set).not.toHaveBeenCalled();
        });
    })
})