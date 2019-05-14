import * as dateRangeReducer from '../dateRangeReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('dateRangeReducer ', () => {
    it('dateRange', () => {
        const expected = '2018-01-01';

        const action = {
            type: types.SET_DATE_RANGE,
            data: expected
        }

        const result = dateRangeReducer.dateRange(emptyState, action);

        expect(result).toEqual(expected);
    })
})