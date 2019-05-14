import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import * as types from '../types'
import DataService from '@jsroot/lib/DataService.js';
import Site from '@jsroot/lib/site'
import Cache from '@jsroot/lib/Cache'
import * as actions from '../bettypeAction';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('bettypeAction ', () => {
    it('setSelectedBettype - should create correct action', () => {
        const item = { data: 123 };
        const expectedAction = {
            type: types.SET_SELECTED_BETTYPE,
            data: item
        }

        const result = actions.setSelectedBettype(item);

        expect(result).toEqual(expectedAction)
    })

    it('setBettypeList - should create correct action', () => {
        const list = [123, 345];
        const expectedAction = {
            type: types.SET_BETTYPE_LIST,
            data: list
        }

        const result = actions.setBettypeList(list);

        expect(result).toEqual(expectedAction)
    })

    describe('getBettypeList', () => {
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
            const productCode = "BG";
            const hasItemAll = true;
            const store = mockStore({ });

            store.dispatch(actions.getBettypeList(productCode, hasItemAll));
        
            promise.then(() => {
                expect(DataService.getData).toHaveBeenCalledWith('/api/CommonDataApi/GetBettypes', { productCode: productCode });
                expect(Cache.set).toHaveBeenCalledWith("BETTYPE_CACHE_KEYBG", response.data);
                done();
            });
        });

        it('cache contains data - not get data from service', () => {
            Cache.get.mockReturnValue([]);
            Cache.set = jest.fn();
            DataService.getData = jest.fn();
            const productCode = "BG";
            const hasItemAll = false;
            const store = mockStore({ });

            store.dispatch(actions.getBettypeList(productCode, hasItemAll));
        
            expect(DataService.getData).not.toHaveBeenCalled();
            expect(Cache.set).not.toHaveBeenCalled();
        });
    })
})