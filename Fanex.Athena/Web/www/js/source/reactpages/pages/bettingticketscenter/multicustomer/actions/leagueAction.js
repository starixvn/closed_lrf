import moment from 'moment'
import DataService from '@jsroot/lib/DataService.js'
import Site from '@jsroot/lib/site'
import LangHelper from '@jsroot/lib/langHelper'
import Cache from '@jsroot/lib/Cache'
import * as types from './types'
import { getMatchList } from './matchAction'

const Url = Site.resolveClientUrl('api/CommonDataApi/GetLeagues');
const LEAGUE_CACHE_KEY = "LEAGUE_CACHE_KEY";

function dispatchLeagueList(dispatch, data, date, sportId){
    if(data.length == 0 || data[0].value != 0)
    {
        data.unshift({value: 0, label: LangHelper.getSingleResource('All')});
    }
    dispatch(setLeagueList(data));
    dispatch(setSelectedLeague(data[0].value));
    dispatch(getMatchList(sportId, data[0].value, date, date));
}

export const setSelectedLeague = (leagueid) => {
    return {
        type: types.SET_SELECTED_LEAGUE,
        data: leagueid
    };
}

export const setLeagueList = (list) => {
    return {
        type: types.SET_LEAGUE_LIST,
        data: list
    };
}

export function getLeagueList(sportId, date) {
    var dateString = moment(date,"MM/DD/YYYY").format("YYYY-MM-DD");
    
    const cacheKey = LEAGUE_CACHE_KEY + sportId + "_" + dateString
    return (dispatch) => {
        var cacheData = Cache.get(cacheKey);
        if(cacheData)
        {
            dispatchLeagueList(dispatch, cacheData, dateString, sportId);
            return;
        }

        DataService.getData(Url, { sportId: sportId, fromDate: dateString, toDate: dateString})
            .then(response => {
                var data = response.data;
                Cache.set(cacheKey, data);
                dispatchLeagueList(dispatch, data, dateString, sportId);
            });
    };
}