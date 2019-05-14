import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import * as actions from '../dataHandlerAction'
import * as types from '../types'

import Site from '../../../../lib/site'
import Report from '../../../../lib/report'

jest.mock('axios')
jest.mock('../../../../lib/site')

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dataHandlerAction', () => {
    const fakeResponse = {
        data: {
            DataList: [],
            TotalDataList: [],
            SummaryTotal: {}
        }
    }

    const params = {
        data: { Level: 1 }
    }

    const fakeReportLib = {
        then: (func) => { func(fakeResponse); return {catch: (func) => { func('Error'); }}; }
    }
    const errorHandler = jest.fn();

    const expectedUrl = "api/ExchangeWinLossReport/Index";

    beforeAll(() => {        
        Report.fetchGridData = jest.fn(() => fakeReportLib);
        Site.resolveClientUrl = jest.fn((url) => url);
    })
    
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getGridData - should create an correct action', () => {
        it('dispatch correct action', () => {
            const expectedActions = [
                { type: types.SET_GRID_DATA, data: { level: params.data.Level, data: fakeResponse.data } }
            ];
            const store = mockStore({ gridData: Object.assign({},  { level: params.data.Level, data: fakeResponse.data }) });
            store.dispatch(actions.getGridData(params, errorHandler));

            expect(store.getActions()).toEqual(expectedActions);
        })

        it('call error handler function if failed', () => {                      
            const store = mockStore({ gridData: Object.assign({}, { level: params.data.Level, data: fakeResponse.data }) });
            store.dispatch(actions.getGridData(params, errorHandler));

            expect(errorHandler).toHaveBeenCalled();       
        })
    })

    it('exportExcel - Report.fetchGridData should be called with correct parameters', () => {
        const store = mockStore({ gridData: {} });
        store.dispatch(actions.exportExcel(params));

        expect(Report.fetchGridData).toHaveBeenCalledWith(expectedUrl, params);
    })

    it('setGridData - should create an correct action', () => {
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