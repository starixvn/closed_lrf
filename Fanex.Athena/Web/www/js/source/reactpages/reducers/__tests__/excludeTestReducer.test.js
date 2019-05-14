import * as reducer from '../excludeTestReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('excludeTestReducer ', () => {
    it('isExcludeTest', () => {
        const expected = true;

        const action = {
            type: types.CHANGE_IS_EXCLUDE_TEST,
            data: expected
        }

        const result = reducer.isExcludeTest(emptyState, action);

        expect(result).toEqual(expected);
    })
})