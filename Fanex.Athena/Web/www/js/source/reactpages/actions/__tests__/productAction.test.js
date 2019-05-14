import * as actions from '../productAction'
import * as types from '../types'

describe('productAction ', () => {
    it('setSelectedProduct - should create correct action', () => {
        const selectedProduct = "SB,BA";
        const expectedAction = {
            type: types.SET_SELECTED_PRODUCT,
            data: selectedProduct
        }

        const result = actions.setSelectedProduct(selectedProduct);

        expect(result).toEqual(expectedAction)
    })
})
