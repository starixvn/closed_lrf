import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

const reducerList = [
    { name: 'reportByList', actionType: types.GET_REPORTBY, expected: [{ value: 1 }, { value: 2 }] },
    { name: 'selectedReportBy', actionType: types.SET_REPORTBY, expected: { value: 1 } },
    { name: 'dateRange', actionType: types.SET_DATE_RANGE, expected: { fromDate: '01/01/2018', toDate: '01/02/2018' } },
    { name: 'xsrfToken', actionType: types.GET_XSRF_TOKEN, expected: 'xsrfToken' },
    { name: 'reportTitle', actionType: types.SET_REPORT_TITLE, expected: 'reportTitle' },
    { name: 'params', actionType: types.SET_PARAMS, expected: [{ value: 1 }] }
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

        const result = filterHandlerReducer.reportByList(initialState, action)

        expect(result).toEqual(initialState);
    })
})