import * as filterHandlerReducer from '../filterHandlerReducer'
import * as types from '../../actions/types'

const emptyState = {};

const reducerList = [
    { name: 'timeZoneList', actionType: types.GET_TIMEZONE, expected: [{ value: 'GMT +1' }, { value: 'GMT +2' }] },
    { name: 'selectedTimeZone', actionType: types.SET_TIMEZONE, expected: 'GMT +1' },
    { name: 'reportByList', actionType: types.GET_REPORTBY, expected: [1,2,3,4,5] },
    { name: 'selectedReportBy', actionType: types.SET_REPORTBY, expected: 1 },
    { name: 'dateRange', actionType: types.SET_DATE_RANGE, expected: [{ FromDate: '2018-01-01', ToDate: '2018-01-02' }] },
    { name: 'groupBy', actionType: types.CHANGE_GROUPBY, expected: 1 },
    { name: 'isConvertAll', actionType: types.CHANGE_IS_CONVERT_ALL, expected: true },
    { name: 'isIncludeDrawData', actionType: types.CHANGE_IS_INCLUDE_DRAW_DATA, expected: false },
    { name: 'dateConstraint', actionType: types.GET_DATE_CONSTRAINT, expected: { minDate: '2017-01-01' } }
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

        const result = filterHandlerReducer.timeZoneList(initialState, action)

        expect(result).toEqual(initialState);
    })
})