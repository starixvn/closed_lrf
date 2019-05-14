import * as loaderReducer from '../loaderReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('loaderReducer ', () => {
    it('isLoading', () => {
        const expected = true;

        const action = {
            type: types.TOGGLE_LOADER,
            data: expected
        }

        const result = loaderReducer.isLoading(emptyState, action);

        expect(result).toEqual(expected);
    })
})