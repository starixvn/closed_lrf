import * as dataHandlerReducer from '../dataHandlerReducer'
import * as types from '../../../actions/resultAmendment/types'

describe('dataHandlerReducer ', () => {
    it("gridData", () => {
        const expectedResult = { Data: [], Total: 0 };
        const action = {
            type: types.SET_GRID_DATA,
            data: expectedResult
        }

        const result = dataHandlerReducer.gridData({}, action);

        expect(result).toEqual(expectedResult);
    })
})