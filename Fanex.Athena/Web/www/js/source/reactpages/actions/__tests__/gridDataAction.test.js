import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import * as actions from '../gridDataAction'
import * as types from '../types'

import Site from '@jsroot/lib/site'
import Report from '@jsroot/lib/report'
import DataService from '@jsroot/lib/DataService'

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('gridDataAction', () => {
    const promise = Promise.resolve({
        data: {xxx:123456}
    });
    beforeAll(() =>{
        DataService.postData = jest.fn(() => promise);
        Site.getXsrfToken = jest.fn();
    });

    const expectedUrl = "api/XXReport/Index";
    
    describe('getGridData - should create a correct action', () => {
        it('dispatch correct action', (done) => {
            const timeStamp = 99999999;
            const expectedActions = [
                { type: types.SET_GRID_DATA, data: { xxx:123456, timestamp: timeStamp } }
            ];
            
            const store = mockStore({ gridData: Object.assign({},  { data: {a:1}}) });
            spyOn(Date.prototype, 'getTime').and.returnValue(timeStamp);

            store.dispatch(actions.getGridData(expectedUrl, {}));

            promise.then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
        })
    })

    it('setGridData - should create a correct action', () => {
        const data = {
            DataList: []
        };

        const expectedAction = {
            type: types.SET_GRID_DATA,
            data: data
        };

        expect(actions.setGridData(data)).toEqual(expectedAction);
    })
})