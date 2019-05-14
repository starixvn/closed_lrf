import * as types from './types'

export const changeIsConvertAll = (checked) => {
    return {
        type: types.CHANGE_IS_CONVERT_ALL,
        data: checked
    }
}