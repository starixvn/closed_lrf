import * as convertAllReducer from '../convertAllReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('convertAllReducer ', () => {
    it('isConvertAll', () => {
        const expected = true;

        const action = {
            type: types.CHANGE_IS_CONVERT_ALL,
            data: expected
        }

        const result = convertAllReducer.isConvertAll(emptyState, action);

        expect(result).toEqual(expected);
    })
})