import * as productReducer from '../productReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('productReducer ', () => {
    it("selectedProduct", () => {
        const action = {
            type: types.SET_SELECTED_PRODUCT,
            data: "SB,BA"
        }

        const result = productReducer["selectedProduct"](emptyState, action);

        expect(result).toEqual("SB,BA");
    })
})