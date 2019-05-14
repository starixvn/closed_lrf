import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'
import LangHelper from '@jsroot/lib/langHelper'
import Cache from '@jsroot/lib/Cache'
import * as types from './types'

const Url = Site.resolveClientUrl('api/CommonDataApi/GetBettypes');
const BETTYPE_CACHE_KEY = "BETTYPE_CACHE_KEY";

function dispatchBettypeList(dispatch, data, hasItemAll) {
    // Remove Item All
    data.length && data[0].value == 0 && data.shift();
    const itemAll = { value: 0, label: LangHelper.getSingleResource('All') };

    if(hasItemAll) {
        data.unshift(itemAll);
    }

    dispatch(setBettypeList(data));
    if(data.length > 0)
    {
        const bettype = hasItemAll ? itemAll.value : data[0].value;
        dispatch(setSelectedBettype(bettype || data[0].value));
    }
}

export const setSelectedBettype = (bettypeId) => {
    return {
        type: types.SET_SELECTED_BETTYPE,
        data: bettypeId
    };
}

export const setBettypeList = (list) => {
    return {
        type: types.SET_BETTYPE_LIST,
        data: list
    };
}

export function getBettypeList(productCode, hasItemAll = false) {
    const cacheKey = BETTYPE_CACHE_KEY + productCode;
    return (dispatch) => {
        var cacheData = Cache.get(cacheKey);
        if(cacheData)
        {
            dispatchBettypeList(dispatch, cacheData, hasItemAll);
            return;
        }

        DataService.getData(Url, { productCode: productCode})
            .then(response => {
                var data = response.data;
                Cache.set(cacheKey, data);
                dispatchBettypeList(dispatch, data, hasItemAll);
            });
    };
}