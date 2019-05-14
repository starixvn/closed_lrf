import * as types from './types'

export const setRequestParam = (data) => {
    return {
        type: types.SET_REQUEST_PARAM,
        data: data
    }
}