import * as actions from '../statusAction'
import * as types from '../types'

describe('statusAction ', () => {
    it('setSelectedStatus - should create correct action', () => {
        const item = {abc: 123};
        const expectedAction = {
            type: types.SET_SELECTED_STATUS,
            data: item
        }

        const result = actions.setSelectedStatus(item);

        expect(result).toEqual(expectedAction);
    })
})