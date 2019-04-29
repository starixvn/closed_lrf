import { SET_PARAM } from './types'

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}