import * as currencyReducer from '../currencyReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('currencyReducer ', () => {
    it('selectedCurrency', () => {
        const expected = 1;

        const action = {
            type: types.SET_SELECTED_CURRENCY,
            data: expected
        }

        const result = currencyReducer.selectedCurrency(emptyState, action);

        expect(result).toEqual(expected);
    })
})