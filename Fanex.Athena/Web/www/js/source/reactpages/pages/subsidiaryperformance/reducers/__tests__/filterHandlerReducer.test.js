import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

const reducerList = [
    { name: "selectedSubsidiary", actionType: types.SET_SUBSIDIARY, expected: "1,2,3,4,5" },
    { name: "dateRange", actionType: types.SET_DATE_RANGE, expected: { fromDate: "09/01/2017", toDate: "09/26/2017" } },
    { name: "convertAll", actionType: types.CHANGE_CONVERT_ALL, expected: true },
    { name: "includeDrawData", actionType: types.CHANGE_INCLUDE_DRAW_DATA, expected: true },
    { name: "params", actionType: types.SET_PARAMS, expected: { fromDate: "01/01/2017", toDate: "09/30/2017" } }
]

describe('filterHandlerReducer ', () => {
    reducerList.forEach(({ name, actionType, expected }) => {
        it(name, () => {
            const action = {
                type: actionType,
                data: expected
            }

            const result = filterHandlerReducer[name](undefined, action);

            expect(result).toEqual(expected);
        })
    })

    it("return default state when no match action type", () => {
        const initialState = { selectedSubsidiary: "1", convertAll: true };
        const action = {
            type: "Action no match",
            data: "1,2,3"
        }

        const result = filterHandlerReducer.selectedSubsidiary(initialState, action)

        expect(result).toEqual(initialState);
    })
})