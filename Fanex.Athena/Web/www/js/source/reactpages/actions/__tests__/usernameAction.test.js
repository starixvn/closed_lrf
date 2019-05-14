import * as actions from '../usernameAction'
import * as types from '../types'

describe('usernameAction ', () => {
    it('setUsername - should create correct action', () => {
        const value = "dlfsdlfkjslkdj";
        const expectedAction = {
            type: types.SET_USERNAME,
            data: value
        }

        const result = actions.setUsername(value);

        expect(result).toEqual(expectedAction);
    })
})