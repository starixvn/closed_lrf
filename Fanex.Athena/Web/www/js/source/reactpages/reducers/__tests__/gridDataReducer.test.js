import * as gridDataReducer from '../gridDataReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('gridDataReducer ', () => {
    it('gridData', () => {
        const expected = { Data: [1, 2, 3, 4] };

        const action = {
            type: types.SET_GRID_DATA,
            data: expected
        }

        const result = gridDataReducer.gridData(emptyState, action);

        expect(result).toEqual(expected);
    })
})