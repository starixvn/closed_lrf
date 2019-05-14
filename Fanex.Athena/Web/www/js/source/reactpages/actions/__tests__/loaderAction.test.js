import * as actions from '../loaderAction'
import * as types from '../types'

describe('loaderAction ', () => {
    it('toggleLoader - should create correct action', () => {
        const isShow = true;
        const expectedAction = {
            type: types.TOGGLE_LOADER,
            data: isShow
        }

        const result = actions.toggleLoader(isShow);

        expect(result).toEqual(expectedAction)
    })
})