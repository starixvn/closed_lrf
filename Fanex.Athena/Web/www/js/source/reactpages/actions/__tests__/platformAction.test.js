import * as actions from '../platformAction'
import * as types from '../types'

describe('platformAction ', () => {
    it('setSelectedPlatform - should create correct action', () => {
        const item = {abc: 123};
        const expectedAction = {
            type: types.SET_SELECTED_PLATFORM,
            data: item
        }

        const result = actions.setSelectedPlatform(item);

        expect(result).toEqual(expectedAction);
    })
})