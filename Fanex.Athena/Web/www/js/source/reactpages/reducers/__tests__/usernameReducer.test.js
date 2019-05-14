import * as usernameReducer from '../usernameReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('usernameReducer ', () => {
    it('username', () => {
        const expected = 'Ninja';

        const action = {
            type: types.SET_USERNAME,
            data: expected
        }

        const result = usernameReducer.username(emptyState, action);

        expect(result).toEqual(expected);
    })
})