import * as dataHandlerReducer from '../dataHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('dataHandlerReducer ', () => {
    it("gridData", () => {
        const expectedResult = { DataList: [], TotalDataList: [], SummaryTotal: {} };
        const action = {
            type: types.SET_GRID_DATA,
            data: expectedResult
        }

        const result = dataHandlerReducer.gridData(emptyState, action);

        expect(result).toEqual(expectedResult);
    })
})