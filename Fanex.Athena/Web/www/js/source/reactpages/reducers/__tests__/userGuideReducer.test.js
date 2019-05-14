import * as userGuideReducer from '../userGuideReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('userGuideReducer ', () => {
    it('userGuideContent', () => {
        const expected = '<div>Content</div>';

        const action = {
            type: types.USER_GUIDE_CONTENT,
            data: expected
        }

        const result = userGuideReducer.userGuideContent(emptyState, action);

        expect(result).toEqual(expected);
    })
})