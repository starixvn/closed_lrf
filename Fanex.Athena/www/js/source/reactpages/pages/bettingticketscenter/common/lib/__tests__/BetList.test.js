import Site from '@jsroot/lib/site'
import BetList from '../BetList'

describe("BetList", function () {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn((url) => url);
    });

    describe("_getMixParlayResultUrl(refno, winlostdate, bettype)", function () {
        it("should return an url with correct parameters", function () {
            const result = BetList._getMixParlayResultUrl(1, 2, 3);
            expect(result).toBe('ResultReport/ResultPopup?refno=1&winlossdate=2&bettype=3&matchid=1');
        });
    });

    describe("_getSportBookResultUrl(matchid, bettype, raceNo, sporttype, league, isOutright, betid)", function () {
        it("should return an url with correct parameters", function () {
            const result = BetList._getSportBookResultUrl(1, 2, 3, 4, 5, 6, 7, 8);
            expect(result).toBe('ResultReport/ResultPopup?matchid=1&bettype=2&raceno=3&sporttype=4&isoutright=6&betid=7');
        });

        it("is fast market - should return an url with correct parameters", function () {
            const MIN_BETTYPE_FASTMARKET = 221;
            const result = BetList._getSportBookResultUrl(1, MIN_BETTYPE_FASTMARKET, 3, 4, 5, 6, 7, 8);
            expect(result).toBe('ResultReport/ResultPopup?matchid=1&bettype=221&raceno=3&sporttype=4&isoutright=6&handicap1=7&handicap2=8');
        });
    });

    describe("getResultUrl(matchid, raceNo, bettype, sporttype, refno, username, winlostdate, refnoMixParlay, league, isOutright, betid, betcheck, custid)", function () {
        it("BetList._getMixParlayResultUrl() should be called if bettype is MixParlay", function () {
            const BETTYPE_MIXPARLAY = 9;
            const expectedUrl = "mixparlayurl";
            BetList._getMixParlayResultUrl = jest.fn(() => expectedUrl);
            var url = BetList.getResultUrl(0, 1, BETTYPE_MIXPARLAY, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

            expect(BetList._getMixParlayResultUrl).toHaveBeenCalled();
            expect(url).toBe(expectedUrl);
        });

        it("BetList._getSportBookResultUrl() should be called if bettype is NOT MixParlay", function () {
            const expectedUrl = "sportsbookurl";
            BetList._getSportBookResultUrl = jest.fn(() => expectedUrl);
            var url = BetList.getResultUrl(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

            expect(BetList._getSportBookResultUrl).toHaveBeenCalled();
            expect(url).toBe(expectedUrl);
        });
    });

    describe("getChoiceParlayDetailUrl(transId, refNo, handicap1, handicap2, betcheck, betteam, custId)", function () {
        it("should return an url with correct parameters", function () {
            const result = BetList.getChoiceParlayDetailUrl(1, 2, 3, 4, 5, 6, 7);
            expect(result).toBe('api/MixParlayBetList/NewParlayDetail?transid=1&refno=2&handicap1=3&handicap2=4&betcheck=5&betteam=6&custid=7');
        });
    });

    describe("buildChoiceParlayDetail(response)", function () {
        it("response has data - return correct result", function () {
            const response = {
                Data: ["Choice111", "Choice222"],
                Texts: ["abc", "def"]
            };
            const result = BetList.buildChoiceParlayDetail(response);
            expect(result).toBe("abcdef<div class='line'></div>Choice111<div class='line'></div>Choice222");
        });

        it("response has no data - return empty string", function () {
            const response = {
                Data: null,
                Texts: ["abc", "def"]
            };
            const result = BetList.buildChoiceParlayDetail(response);
            expect(result).toBe("");
        });
    });

    describe("getParlayDetailUrl(transId, refNo, betId, custId, betTeam, baseCurrency)", function () {
        it("should return an url with correct parameters", function () {
            const result = BetList.getParlayDetailUrl(1, 2, 3, 4, 5, 6);
            expect(result).toBe('SystemParlayBetList/Detail?refno=2&betteam=5&basecurrency=6');
        });

        it("transId is 0 - should return nothing", function () {
            const result = BetList.getParlayDetailUrl(0, 2, 3, 4, 5, 6);
            expect(result).toBe(undefined);
        });
    });

    describe("getCashOutHistoryPopupSetting(baseCurrency, transId, refNo, betType, betdaqId)", function () {
        it("is cash out bet type - should return an url with correct parameters", function () {
            const result = BetList.getCashOutHistoryPopupSetting('USD', 1, 2, 911, 0);
            expect(result).toEqual({ url: 'CashOutBetList/Detail?transid=1&refno=2&bettype=911&betdaqid=0&basecurrency=USD&iscashout=true', isCashOut: true });
        });

        it("is not cash out bet type - should return an url with correct parameters", function () {
            const result = BetList.getCashOutHistoryPopupSetting('USD', 1, 2, 3, 1);
            expect(result).toEqual({ url: 'CashOutBetList/Detail?transid=1&refno=2&bettype=3&betdaqid=1&basecurrency=USD&iscashout=false', isCashOut: false });
        });
    });

    describe('getSingleMatchParlayDetailUrl(transId, custId, status)', function () {
        it('should return an url with correct parameters', function () {
            const result = BetList.getSingleMatchParlayDetailUrl(1, 2, 3);
            expect(result).toBe('api/SingleMatchParlayBetList/Detail?transid=1&custid=2&status=3');
        });
    });

    describe('buildSingleMatchParlayDetail(data)', function () {
        it('has data - return correct result', function () {
            const data = ['Text1', 'Text2'];
            const result = BetList.buildSingleMatchParlayDetail(data);
            expect(result).toBe('<div class="single-match-parlay-detail">Text1Text2</div>');
        });

        it('has no data - return empty string', function () {
            const data = null;
            const result = BetList.buildSingleMatchParlayDetail(data);
            expect(result).toBe('');
        });
    });
});