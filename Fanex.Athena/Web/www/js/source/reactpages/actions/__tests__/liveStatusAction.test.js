import * as actions from '../liveStatusAction'
import * as types from '../types'

describe('liveStatusAction ', () => {
    it('setSelectedLiveStatus - should create correct action', () => {
        const item = {abc: 123};
        const expectedAction = {
            type: types.SET_SELECTED_LIVESTATUS,
            data: item
        }

        const result = actions.setSelectedLiveStatus(item);

        expect(result).toEqual(expectedAction);
    })
})