import * as actions from '../requestParamAction'
import * as types from '../types'

describe('requestParamAction ', () => {
    it('setRequestParam  - should create correct action', () => {
        const requestParam = { BaseCurrency: 'EUR' };
        
        const expectedAction = {
            type: types.SET_REQUEST_PARAM,
            data: requestParam
        }

        const result = actions.setRequestParam(requestParam);

        expect(result).toEqual(expectedAction)
    })
})