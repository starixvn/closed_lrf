import * as types from './types.js'

export const setRefno = (value) => {
    return {
        type: types.SET_REFNO,
        data: value
    }
}