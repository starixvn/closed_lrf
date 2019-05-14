import * as types from './types.js'

export const setUsername = (value) => {
    return {
        type: types.SET_USERNAME,
        data: value
    }
}