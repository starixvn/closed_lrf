import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../../actions/resultAmendment/types'

const emptyState = {};

const reducerList = [
    { name: "dateRange", actionType: types.SET_DATE_RANGE, expected: { fromDate: "01/01/2017", toDate: "01/10/2017" } },
    { name: "dateConstraint", actionType: types.GET_DATE_CONSTRAINT, expected: "3" },
    { name: "param", actionType: types.SET_PARAM, expected: { FromDate: "01/01/2017", ToDate: "01/10/2017", PageIndex: 1, PageSize: 5 } },
    { name: "licenseeName", actionType: types.GET_LICENSEE_NAME, expected: "licensee name" }
]

describe('filterHandlerReducer ', () => {
    reducerList.forEach(({ name, actionType, expected }) => {
        it(name, () => {
            const action = {
                type: actionType,
                data: expected
            }

            const result = filterHandlerReducer[name]({}, action);

            expect(result).toEqual(expected);
        })
    })
})