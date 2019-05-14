import * as statusReducer from '../statusReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('statusReducer ', () => {
    it('selectedStatus', () => {
        const expected = 1;

        const action = {
            type: types.SET_SELECTED_STATUS,
            data: expected
        }

        const result = statusReducer.selectedStatus(emptyState, action);

        expect(result).toEqual(expected);
    })
})