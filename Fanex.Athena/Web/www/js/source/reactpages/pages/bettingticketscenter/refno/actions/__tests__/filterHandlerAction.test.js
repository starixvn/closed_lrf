import * as actions from '../filterHandlerAction'
import * as types from '../types'

describe('filterHandlerAction', () => {
    it('setRefno - should create an correct action', () => {
        const data = { value: 123456 };
        const expectedAction = {
            type: types.SET_REFNO,
            data: data
        };

        const result = actions.setRefno(data);

        expect(result).toEqual(expectedAction);
    })
})