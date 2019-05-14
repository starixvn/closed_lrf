import * as types from './types'

export const setSelectedBaseCurrency = (baseCurrency) => {
    return {
        type: types.SET_SELECTED_BASECURRENCY,
        data: baseCurrency
    }
}

export const setBaseCurrencyList = (baseCurrencyList) => {
    return {
        type: types.SET_BASECURRENCY_LIST,
        data: baseCurrencyList
    }
}