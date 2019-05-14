import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('filterHandlerReducer ', () => {
    it('refno ', () => {
        const expected = 123456;

        const action = {
            type: types.SET_REFNO,
            data: expected
        }

        const result = filterHandlerReducer.refno(emptyState, action);

        expect(result).toEqual(expected);
    })
})