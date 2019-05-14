import Site from '@jsroot/lib/site'
import QueryString from '@jsroot/lib/QueryString'

const BETTYPE_CASHOUT = 911;
const BETTYPE_MIXPARLAY = 9, BETTYPE_SYSTEMPARLAY = 29, BETTYPE_MIXPARLAY_BETRADAR = 2799;
const MIN_BETTYPE_FASTMARKET = 221;
const MAX_BETTYPE_FASTMARKET = 227;

class BetList {

    _isFastMarket(bettype) {
        return bettype >= MIN_BETTYPE_FASTMARKET && bettype <= MAX_BETTYPE_FASTMARKET;
    }

    _getMixParlayResultUrl(refno, winlostdate, bettype) {
        let url = Site.resolveClientUrl('ResultReport/ResultPopup');
        url = QueryString.setParam(url, "refno", refno);
        url = QueryString.setParam(url, "winlossdate", winlostdate);
        url = QueryString.setParam(url, "bettype", bettype);
        url = QueryString.setParam(url, "matchid", 1);

        return url;
    }

    _getSportBookResultUrl (matchid, bettype, raceNo, sporttype, league, isOutright, extension1, extension2) {
        let url = Site.resolveClientUrl('ResultReport/ResultPopup');
        url = QueryString.setParam(url, "matchid", matchid);
        url = QueryString.setParam(url, "bettype", bettype);
        url = QueryString.setParam(url, "raceno", raceNo);
        url = QueryString.setParam(url, "sporttype", sporttype);
        url = QueryString.setParam(url, "isoutright", isOutright);

        if (this._isFastMarket(bettype)) {
            url = QueryString.setParam(url, "handicap1", extension1);
            url = QueryString.setParam(url, "handicap2", extension2);
        } else {
            url = QueryString.setParam(url, "betid", extension1);
        }

        return url;
    }

    getResultUrl (matchid, raceNo, bettype, sporttype, refno,
        username, winlostdate, refnoMixParlay, league, isOutright, extension1, extension2, custid) {
        bettype = Number(bettype);

        let isParlay = bettype === BETTYPE_MIXPARLAY || bettype === BETTYPE_SYSTEMPARLAY || bettype === BETTYPE_MIXPARLAY_BETRADAR;
        let url = isParlay
                ? this._getMixParlayResultUrl(refnoMixParlay, winlostdate, bettype)
                : this._getSportBookResultUrl(matchid, bettype, raceNo, sporttype, league, isOutright, extension1, extension2, custid);

            return url;
    }

    getChoiceParlayDetailUrl (transId, refNo, handicap1, handicap2, betcheck, betteam, custId){
        var url = Site.resolveClientUrl('api/MixParlayBetList/NewParlayDetail');
        url = QueryString.setParam(url, "transId", transId);
        url = QueryString.setParam(url, "refNo", refNo);
        url = QueryString.setParam(url, "handicap1", handicap1);
        url = QueryString.setParam(url, "handicap2", handicap2);
        url = QueryString.setParam(url, "betcheck", betcheck);
        url = QueryString.setParam(url, "betteam", betteam);
        url = QueryString.setParam(url, "custId", custId);

        return url;
    }

    buildChoiceParlayDetail(response){
        let choice = "";
        let length = response.Data === null ? 0 : response.Data.length;
        if (length > 0) {
            for(let i = 0; i < response.Texts.length; i++){
                choice += response.Texts[i];
            }

            choice += "<div class='line'></div>";

            for(let i = 0;i < response.Data.length; i++){
                let item = response.Data[i];
                choice += item;
                if (i < length - 1) {
                    choice += "<div class='line'></div>";
                }
            }
        }

        return choice;
    }

    getParlayDetailUrl (transId, refNo, betId, custId, betTeam, baseCurrency) {
        if (Number(transId) === 0) { return; }

        var url = Site.resolveClientUrl('SystemParlayBetList/Detail');
        url = QueryString.setParam(url, "refno", refNo);
        url = QueryString.setParam(url, "betteam", betTeam);
        url = QueryString.setParam(url, "basecurrency", baseCurrency);

        return url;
    }

    getCashOutHistoryPopupSetting (baseCurrency, transId, refNo, betType, betdaqId) {
        var isCashOut = betdaqId < 1 || betType === BETTYPE_CASHOUT;
        var url = Site.resolveClientUrl('CashOutBetList/Detail');
        url = QueryString.setParam(url, "transId", transId);
        url = QueryString.setParam(url, "refNo", refNo);
        url = QueryString.setParam(url, "betType", betType);
        url = QueryString.setParam(url, "betdaqId", betdaqId);
        url = QueryString.setParam(url, "BaseCurrency", baseCurrency);
        url = QueryString.setParam(url, "isCashout", isCashOut);
        return {
            url: url,
            isCashOut : isCashOut
        };
    }

    getBonusDetailUrl(refCode, transId, baseCurrency) {
        let url = Site.resolveClientUrl('BonusBetList/Detail');
        url = QueryString.setParam(url, "RefCode", refCode);
        url = QueryString.setParam(url, "TransId", transId);
        url = QueryString.setParam(url, "BaseCurrency", baseCurrency);

        return url;
    }
}

export default new BetList();