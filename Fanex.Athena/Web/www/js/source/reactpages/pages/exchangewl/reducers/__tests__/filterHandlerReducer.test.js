import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

const reducerList = [
    { name: 'reportByOption', actionType: types.GET_REPORTBY, expected: [{ value: 1 }, { value: 2 }] },
    { name: 'selectedReportBy', actionType: types.SET_REPORTBY, expected: { value: 1 } },
    { name: 'licenseeId', actionType: types.GET_LICENSEE, expected: 1 },
    { name: 'isAllowedCustomerComm', actionType: types.GET_ISALLOWED_CUSTOMERCOMM, expected: false },
    { name: 'params', actionType: types.SET_PARAM, expected: [{ value: 1 }] }
]

describe('filterHandlerReducer ', () => {
    reducerList.forEach(({ name, actionType, expected }) => {
        it(name, () => {
            const action = {
                type: actionType,
                data: expected
            }

            const result = filterHandlerReducer[name](emptyState, action);

            expect(result).toEqual(expected);
        })
    })

    it('return default state when no match action type', () => {
        const initialState = {};
        const action = {
            type: 'Action no match',
            data: '1,2,3'
        }

        const result = filterHandlerReducer.reportByOption(initialState, action)

        expect(result).toEqual(initialState);
    })
})