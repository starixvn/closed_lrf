import * as baseCurrencyReducer from '../baseCurrencyReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('baseCurrencyReducer ', () => {
    it("selectedBaseCurrency", () => {
        const action = {
            type: types.SET_SELECTED_BASECURRENCY,
            data: "EUR"
        }

        const result = baseCurrencyReducer["selectedBaseCurrency"](emptyState, action);

        expect(result).toEqual("EUR");
    })

    it("baseCurrencyList", () => {
        const action = {
            type: types.SET_BASECURRENCY_LIST,
            data: ["EUR", "USD"]
        }

        const result = baseCurrencyReducer["baseCurrencyList"](emptyState, action);

        expect(result).toEqual(action.data);
    })
})