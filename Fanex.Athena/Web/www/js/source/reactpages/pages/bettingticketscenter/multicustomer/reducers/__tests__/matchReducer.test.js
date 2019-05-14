import * as matchReducer from '../matchReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('matchReducer ', () => {
    it("selectedMatch", () => {
        const action = {
            type: types.SET_SELECTED_MATCH,
            data: "123"
        }

        const result = matchReducer["selectedMatch"](emptyState, action);

        expect(result).toEqual("123");
    })

    it("matchList", () => {
        const action = {
            type: types.SET_MATCH_LIST,
            data: ["123", "456"]
        }

        const result = matchReducer["matchList"](emptyState, action);

        expect(result).toEqual(action.data);
    })
})