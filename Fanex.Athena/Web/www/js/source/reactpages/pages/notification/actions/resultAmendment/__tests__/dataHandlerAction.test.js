import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import * as actions from '../dataHandlerAction'
import * as types from '../types'

import Site from '../../../../../lib/site'
import axios from 'axios'

const XsrfToken = "XXXX_TOKEN";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const expectedHeader = {
    'X-Requested-With': 'XMLHttpRequest',
    '__RequestVerificationToken': XsrfToken
}

describe('dataHandlerAction', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn((url) => url);
        Site.getXsrfToken = jest.fn(() => XsrfToken);
        jest.mock('axios');
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getGridData', () => {
        const expectedUrl = 'api/NotificationReport/ResultAmendment';
        const fakeDataResponse = {
            data: {
                DataList: [],
                TotalRows: 0
            }
        }
        const params = {
            data: { FromDate: '01/01/2017', ToDate: '01/10/2017' }
        }
        
        beforeAll(() => {
            const promise = Promise.resolve(fakeDataResponse);
            axios.post = jest.fn(() => promise);
        })

        it('dispatch correct action', () => {
            const expectedActions = [
                { 
                    type: types.SET_GRID_DATA, 
                    data: { 
                        Data: fakeDataResponse.data.DataList, 
                        Total: fakeDataResponse.data.TotalRows
                    } 
                }
            ];
            const store = mockStore({ gridData: Object.assign({}, { 
                Data: fakeDataResponse.data.DataList, 
                Total: fakeDataResponse.data.TotalRows }) });
            store.dispatch(actions.getGridData({}));

            Promise.resolve().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })

        it('axios.post should be called with correct parameters', () => {
            const store = mockStore({ gridData: Object.assign({}, fakeDataResponse.data) });
            store.dispatch(actions.getGridData(params));

            Promise.resolve().then(() => {
                expect(axios.post).toHaveBeenCalledWith(expectedUrl, params.data, { headers: expectedHeader });
            })
        })
    })

    describe('setGridData', () => {
        it('create an correct action', () => {
            const data = {
                Data: [],
                Total: 0
            };
            const expectedAction = {
                type: types.SET_GRID_DATA,
                data: data
            }

            const result = actions.setGridData(data);

            expect(result).toEqual(expectedAction);
        })
    })

    describe('markItemAsRead', () => {
        const expectedUrl = 'api/NotificationReport/MarkNotificationAsRead';
        const params = {
            Id: 1,
            Type: 2,
            Index: 0,
            Data: [{ Id: 1 }],
            Total: 1
        };

        it('axios.post should be called with correct parameters', () => {
            const promise = Promise.resolve({ data: { IsSuccessful: false } });
            axios.post = jest.fn(() => promise);

            const store = mockStore({ gridData: Object.assign({}, { Data: [{ Id: 1 }], Total: 1 }) });
            store.dispatch(actions.markItemAsRead(params));

            Promise.resolve().then(() => {
                expect(axios.post).toHaveBeenCalledWith(expectedUrl, { MessageId: params.Id, MessageType: params.Type }, { headers: expectedHeader });
            })
        })

        it('is not successful - do not dispatch to setGridData', () => {
            const promise = Promise.resolve({ data: { IsSuccessful: false } });
            axios.post = jest.fn(() => promise);
            const expectedActions = [{ 
                type: types.SET_GRID_DATA, 
                data: { Data: [{ Id: 1, IsRead: true }], Total: 1 } }
            ];
            const store = mockStore({ gridData: Object.assign({}, { Data: [{ Id: 1 }], Total: 1 }) });
            store.dispatch(actions.markItemAsRead(params));

            Promise.resolve().then(() => {
                expect(store.getActions()).not.toEqual(expectedActions);
            })
        })

        it('is successful - do not dispatch to setGridData', () => {
            const promise = Promise.resolve({ data: { IsSuccessful: true } });
            axios.post = jest.fn(() => promise);
            const expectedActions = [{ 
                type: types.SET_GRID_DATA, 
                data: { Data: [{ Id: 1, IsRead: true }], Total: 1 } }
            ];
            const store = mockStore({ gridData: Object.assign({}, { Data: [{ Id: 1 }], Total: 1 }) });
            store.dispatch(actions.markItemAsRead(params));

            Promise.resolve().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })
    })

    describe('exportAttachment', () => {
        it('axios.post should be called with correct parameters', () => {
            const expectedUrl = 'api/NotificationReport/DownLoadFileAttachment';
            const params = {
                api: 'api',
                fileName: 'fileName'
            };
            const promise = Promise.resolve({ data: {} });
            axios.post = jest.fn(() => promise);

            const store = mockStore({});
            store.dispatch(actions.exportAttachment(params));

            Promise.resolve().then(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    expectedUrl, 
                    { FileName: params.fileName }, 
                    { headers: expectedHeader, responseType: 'blob'});
            })
        })
    })
})