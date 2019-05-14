// -----------------------------------------------------------------------
// <copyright file="BetType.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Constant.DataDomain
{
    public enum BetType
    {
        /// <summary>
        /// None, value = 0.
        /// </summary>
        None = 0,

        /// <summary>
        /// Handicap bet type, value = 1.
        /// </summary>
        Handicap = 1,

        /// <summary>
        /// OddEven bet type, value = 2.
        /// </summary>
        OddEven = 2,

        /// <summary>
        /// OverUnder bet type, value = 3.
        /// </summary>
        OverUnder = 3,

        /// <summary>
        /// CorrectScore bet type, value = 4.
        /// </summary>
        CorrectScore = 4,

        /// <summary>
        /// Ft_1X2 bet type, value = 5.
        /// </summary>
        Ft1X2 = 5,

        /// <summary>
        /// TotalGoal bet type, value = 6.
        /// </summary>
        TotalGoal = 6,

        /// <summary>
        /// First Half Total Goal bet type ,value=126.
        /// </summary>
        FirstHalfTotalGoal = 126,

        /// <summary>
        /// FirstHalfHandicap bet type, value = 7.
        /// </summary>
        FirstHalfHandicap = 7,

        /// <summary>
        /// FirstHalfOverUnder bet type, value = 8.
        /// </summary>
        FirstHalfOverUnder = 8,

        /// <summary>
        /// MixParlay bet type, value = 9.
        /// </summary>
        MixParlay = 9,

        /// <summary>
        /// CombinationMixParlay bet type, value = 29.
        /// </summary>
        CombinationMixParlay = 29,

        /// <summary>
        /// Outright bet type, value = 10.
        /// </summary>
        Outright = 10,

        /// <summary>
        /// TotalCorners bet type, value = 11.
        /// </summary>
        TotalCorners = 11,

        /// <summary>
        /// FirstHalfOddEven bet type, value = 12.
        /// </summary>
        FirstHalfOddEven = 12,

        /// <summary>
        /// CleanSheet bet type, value = 13.
        /// </summary>
        CleanSheet = 13,

        /// <summary>
        /// FirstGoalLastGoal bet type, value = 14.
        /// </summary>
        FirstGoalLastGoal = 14,

        /// <summary>
        /// First Half first goal,last goal,value=127.
        /// </summary>
        FirstHalFirsGoalLastGoal = 127,

        /// <summary>
        /// FirstHalf_1X2 bet type, value = 15.
        /// </summary>
        FirstHalf1X2 = 15,

        /// <summary>
        /// Half time full time bet type, value = 16.
        /// </summary>
        HtFt = 16,

        /// <summary>
        /// Second Half Handicap bet type, value = 17.
        /// </summary>
        SecondHalfHdp = 17,

        /// <summary>
        /// SecondHalfOverUnder bet type, value = 18.
        /// </summary>
        SecondHalfOverUnder = 18,

        /// <summary>
        /// Substitutes bet type, value = 19.
        /// </summary>
        Substitutes = 19,

        /// <summary>
        /// MoneyLine bet type, value = 20.
        /// </summary>
        MoneyLine = 20,

        /// <summary>
        /// NextGoal bet type, value = 22.
        /// </summary>
        NextGoal = 22,

        /// <summary>
        /// NextCorner bet type, value = 23.
        /// </summary>
        NextCorner = 23,

        ToWinToNil = 27,

        ThreeWayHandicap = 28,

        /// <summary>
        /// Win bet type, value = 31.
        /// </summary>
        Win = 31,

        /// <summary>
        /// Place bet type, value = 32.
        /// </summary>
        Place = 32,

        /// <summary>
        /// WinPlace bet type, value = 33.
        /// </summary>
        WinPlace = 33,

        /// <summary>
        /// Win United Kingdom Tote bet type, value = 41.
        /// </summary>
        WinUkTote = 41,

        /// <summary>
        /// Place United Kingdom Tote bet type, value = 42.
        /// </summary>
        PlaceUkTote = 42,

        /// <summary>
        /// Win Place  United Kingdom Tote bet type, value = 43.
        /// </summary>
        WinPlaceUkTote = 43,

        /// <summary>
        /// CasinoGames bet type, value = 71.
        /// </summary>
        CasinoGames = 71,

        /// <summary>
        /// P2PGames bet type, value = 72.
        /// </summary>
        P2PGames = 72,

        /// <summary>
        /// MiniGames bet type, value = 73.
        /// </summary>
        MiniGames = 73,

        /// <summary>
        /// Balance bet type, value = 100.
        /// </summary>
        Bal = 100,

        /// <summary>
        /// NG1stBallOU bet type, value = 81.
        /// </summary>
        NG1StBallOU = 81,

        /// <summary>
        /// NgLastBall over under bet type, value = 82.
        /// </summary>
        NgLastBallOu = 82,

        /// <summary>
        /// Ng1StBall odd even bet type, value = 83.
        /// </summary>
        Ng1StBallOe = 83,

        /// <summary>
        /// NgLastBall odd even bet type, value = 84.
        /// </summary>
        NgLastBallOe = 84,

        /// <summary>
        /// Number game over under full time bet type, value = 85.
        /// </summary>
        NgOuFt = 85,

        /// <summary>
        /// Number game odd even full time bet type, value = 86.
        /// </summary>
        NgOeFt = 86,

        /// <summary>
        /// NgHighLow bet type, value = 87.
        /// </summary>
        NgHighLow = 87,

        /// <summary>
        /// NgWarrior bet type, value = 88.
        /// </summary>
        NgWarrior = 88,

        /// <summary>
        /// NgNextCombo bet type, value = 89.
        /// </summary>
        NgNextCombo = 89,

        /// <summary>
        /// NgNumberGroup bet type, value = 90.
        /// </summary>
        NgNumberGroup = 90,

        /// <summary>
        /// BetTrade bet type, value = 902.
        /// </summary>
        BetTradeBought = 902,

        CashOutBought = 912,

        LotteryPenaltyShootOut = 1041,

        LotteryPenaltyShootOut2 = 1042,

        VirtualSports2Ft1X2 = 2701,

        VirtualSports2MixParlay = 2799,

        FirstHalfThreeWayHandicap = 453,

        VirtualBasketballOverUnder = 2803,

        VirtualBasketballFirstHalfHandicap = 2806,

        NumberGameHappy5OddEven = 8102,

        PromotionPrize = 4300,

        SingleMatchParlay = 38
    }
}