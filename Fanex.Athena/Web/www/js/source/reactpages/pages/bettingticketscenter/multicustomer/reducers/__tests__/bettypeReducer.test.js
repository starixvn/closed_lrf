import * as bettypeReducer from '../bettypeReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('bettypeReducer ', () => {
    it("selectedBettype", () => {
        const action = {
            type: types.SET_SELECTED_BETTYPE,
            data: "123"
        }

        const result = bettypeReducer["selectedBettype"](emptyState, action);

        expect(result).toEqual("123");
    })

    it("bettypeList", () => {
        const action = {
            type: types.SET_BETTYPE_LIST,
            data: ["123", "456"]
        }

        const result = bettypeReducer["bettypeList"](emptyState, action);

        expect(result).toEqual(action.data);
    })
})