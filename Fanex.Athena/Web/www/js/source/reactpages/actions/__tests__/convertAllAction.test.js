import * as actions from '../convertAllAction'
import * as types from '../types'

describe('convertAllAction ', () => {
    it('changeIsConvertAll - should create correct action', () => {
        const expectedAction = {
            type: types.CHANGE_IS_CONVERT_ALL,
            data: true
        }

        const result = actions.changeIsConvertAll(true);

        expect(result).toEqual(expectedAction)
    })
})