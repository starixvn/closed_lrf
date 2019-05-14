import * as requestParamReducer from '../requestParamReducer'
import * as types from '../../actions/types'

const emptyState = {};

describe('requestParamReducer ', () => {
    it('requestParam', () => {
        const expected = { FromDate: '2018-01-01', ToDate: '2018-01-02' };

        const action = {
            type: types.SET_REQUEST_PARAM,
            data: expected
        }

        const result = requestParamReducer.requestParam(emptyState, action);

        expect(result).toEqual(expected);
    })
})