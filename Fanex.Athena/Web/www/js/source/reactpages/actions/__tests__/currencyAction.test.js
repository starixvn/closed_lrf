import * as actions from '../currencyAction'
import * as types from '../types'

describe('currencyAction ', () => {
    it('setSelectedCurrency - should create correct action', () => {
        const currency = "UUS";
        const expectedAction = {
            type: types.SET_SELECTED_CURRENCY,
            data: currency
        }

        const result = actions.setSelectedCurrency(currency);

        expect(result).toEqual(expectedAction)
    })
})