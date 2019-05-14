import * as liveStatusReducer from '../liveStatusReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('liveStatusReducer ', () => {
    it('selectedLiveStatus', () => {
        const expected = 1;

        const action = {
            type: types.SET_SELECTED_LIVESTATUS,
            data: expected
        }

        const result = liveStatusReducer.selectedLiveStatus(emptyState, action);

        expect(result).toEqual(expected);
    })
})