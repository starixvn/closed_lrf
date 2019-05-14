import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'
import LangHelper from '@jsroot/lib/langHelper'
import Cache from '@jsroot/lib/Cache'
import * as types from './types'

const Url = Site.resolveClientUrl('api/CommonDataApi/GetMatches');
const MATCH_CACHE_KEY = "MATCH_CACHE_KEY";

function dispatchMatchList(dispatch, data){
    if(data.length == 0 || data[0].value != 0)
    {
        data.unshift({value: 0, label: LangHelper.getSingleResource('All')});
    }
    dispatch(setMatchList(data));
    dispatch(setSelectedMatch(data[0].value));
}

export const setSelectedMatch = (matchid) => {
    return {
        type: types.SET_SELECTED_MATCH,
        data: matchid
    };
}

export const setMatchList = (list) => {
    return {
        type: types.SET_MATCH_LIST,
        data: list
    };
}

export function getMatchList(sportId, leagueId, date) {
    const cacheKey = MATCH_CACHE_KEY + sportId + "_" + leagueId + "_" + date
    return (dispatch) => {
        var cacheData = Cache.get(cacheKey);
        if(cacheData)
        {
            dispatchMatchList(dispatch, cacheData);
            return;
        }

        DataService.getData(Url, 
            { 
                sportId: sportId, 
                leagueId: leagueId, 
                fromDate: Site.convertDateToString(date), 
                toDate: Site.convertDateToString(date)
            })
            .then(response => {
                var data = response.data;
                Cache.set(cacheKey, data);
                dispatchMatchList(dispatch, data);
            });
    };
}