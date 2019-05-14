import * as types from './types'

export const changeIsExcludeTest = (checked) => {
    return {
        type: types.CHANGE_IS_EXCLUDE_TEST,
        data: checked
    }
}