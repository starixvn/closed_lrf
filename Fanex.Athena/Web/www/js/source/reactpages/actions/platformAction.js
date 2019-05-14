import * as types from './types'

export const setSelectedPlatform = (item) => {
    return {
        type: types.SET_SELECTED_PLATFORM,
        data: item
    }
}