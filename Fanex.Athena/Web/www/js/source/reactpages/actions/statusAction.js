import * as types from './types'

export const setSelectedStatus = (item) => {
    return {
        type: types.SET_SELECTED_STATUS,
        data: item
    }
}