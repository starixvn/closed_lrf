import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'
import LangHelper from '@jsroot/lib/langHelper'
import * as types from './types'
import { getLeagueList } from './leagueAction'

const Url = Site.resolveClientUrl('api/CommonDataApi/GetSports');
export const setSelectedSport = (sportId) => {
    return {
        type: types.SET_SELECTED_SPORT,
        data: sportId
    };
}

export const setSportList = (list) => {
    return {
        type: types.SET_SPORT_LIST,
        data: list
    };
}

export function getSportList(productCode, date) {
    return (dispatch) => {
        DataService.getData(Url, { productCode: productCode})
            .then(response => {
                let data = response.data;
                
                let itemAll = { value: 0, label: LangHelper.getSingleResource('All') };
                data.unshift(itemAll);
                dispatch(setSportList(data));
                dispatch(setSelectedSport(itemAll.value));
                if(date){
                    dispatch(getLeagueList(0, date));
                }
            });
    };
}