import * as sportReducer from '../sportReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('sportReducer ', () => {
    it("selectedSport", () => {
        const action = {
            type: types.SET_SELECTED_SPORT,
            data: "123"
        }

        const result = sportReducer["selectedSport"](emptyState, action);

        expect(result).toEqual("123");
    })

    it("sportList", () => {
        const action = {
            type: types.SET_SPORT_LIST,
            data: ["123", "456"]
        }

        const result = sportReducer["sportList"](emptyState, action);

        expect(result).toEqual(action.data);
    })
})