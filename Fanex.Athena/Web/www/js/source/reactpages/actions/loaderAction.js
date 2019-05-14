import * as types from './types'

export const toggleLoader = (show) => {
    return {
        type: types.TOGGLE_LOADER,
        data: show
    }
}