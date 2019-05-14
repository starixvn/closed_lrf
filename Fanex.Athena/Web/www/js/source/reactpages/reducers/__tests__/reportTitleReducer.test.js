import * as reportTitleReducer from '../reportTitleReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('reportTitleReducer ', () => {
    it('reportTitle', () => {
        const expected = 'title';

        const action = {
            type: types.SET_REPORT_TITLE,
            data: expected
        }

        const result = reportTitleReducer.reportTitle(emptyState, action);

        expect(result).toEqual(expected);
    })
})