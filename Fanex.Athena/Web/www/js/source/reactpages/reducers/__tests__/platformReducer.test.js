import * as platformReducer from '../platformReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('platformReducer ', () => {
    it('selectedPlatform', () => {
        const expected = 1;

        const action = {
            type: types.SET_SELECTED_PLATFORM,
            data: expected
        }

        const result = platformReducer.selectedPlatform(emptyState, action);

        expect(result).toEqual(expected);
    })
})