import * as leagueReducer from '../leagueReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('leagueReducer ', () => {
    it("selectedLeague", () => {
        const action = {
            type: types.SET_SELECTED_LEAGUE,
            data: "123"
        }

        const result = leagueReducer["selectedLeague"](emptyState, action);

        expect(result).toEqual("123");
    })

    it("leagueList", () => {
        const action = {
            type: types.SET_LEAGUE_LIST,
            data: ["123", "456"]
        }

        const result = leagueReducer["leagueList"](emptyState, action);

        expect(result).toEqual(action.data);
    })
})