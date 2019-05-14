import * as actions from '../excludeTestAction'
import * as types from '../types'

describe('excludeTestAction ', () => {
    it('changeIsExcludeTest - should create correct action', () => {
        const isExcludeTest = true;
        const expectedAction = {
            type: types.CHANGE_IS_EXCLUDE_TEST,
            data: isExcludeTest
        }

        const result = actions.changeIsExcludeTest(isExcludeTest);

        expect(result).toEqual(expectedAction);
    })
})