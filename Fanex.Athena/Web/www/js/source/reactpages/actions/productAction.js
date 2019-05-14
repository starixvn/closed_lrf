import * as types from './types'

export const setSelectedProduct = (product) => {
    return {
        type: types.SET_SELECTED_PRODUCT,
        data: product
    };
}