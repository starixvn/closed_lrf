namespace Fanex.Athena.Result.Service.Interfaces
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Common.Model.DTO;
    using Fanex.Result.Core.Base;
    using Fanex.Result.Core.Happy5.DTO;
    using Fanex.Result.Core.NumberGame.DTO;
    using Fanex.Result.Core.Racing.DTO;
    using Fanex.Result.Core.Sportsbook.DTO;
    using Model.MetaModel;

    [System.CLSCompliant(false)]
    public interface IResultService
    {
        Task<IList<Outright>> GetOutRight(ResultMetaModel metal);

        #region ResultEngine

        MemoryStream ExcelParser<T>(IList<T> dataList, ResultSetting setting);

        string HtmlGameDetailParser(dynamic data, ResultSetting setting);

        string HtmlParser<T>(IList<T> dataList, ResultSetting setting);

        #endregion ResultEngine

        #region Filter

        Task<IList<Sport>> GetSports(DateTime dateValue, int licenseeId);

        Task<IList<League>> GetLeagues(DateTime dateValue, int sportId);

        #endregion Filter

        #region Report

        Task<IList<Sportsbook>> GetMatches(ResultMetaModel metalModel);

        Task<IList<NumberGame>> GetNumberGameMatches(ResultMetaModel metalModel);

        Task<IList<Happy5>> GetHappy5Matches(ResultMetaModel metalModel);

        Task<IList<Racing>> GetVirtualSportMatches(ResultMetaModel metalModel);

        #endregion Report

        #region Popup

        Task<Sportsbook> GetSportsbookGameDetail(int matchId);

        Task<IList<Sportsbook>> GetPopUpMatch(ResultPopupMetaModel metalModel);

        Task<IList<Racing>> GetPopUpVirtualSportMatch(ResultPopupMetaModel metalModel);

        /// <summary>
        /// Select matches from BetTransM by reference no.
        /// For view MixParlay result.
        /// </summary>
        /// <param name="refNo">The reference no.</param>
        /// <returns>The parlay list.</returns>
        Task<IList<Parlay>> GetPopUpParlayMatch(long refNo);

        /// <summary>
        ///  Get match result of number game.
        /// </summary>
        /// <param name="matchId">The match id.</param>
        /// <returns>The match info.</returns>
        Task<IList<NumberGame>> GetPopUpNumberGameMatchs(int matchId);

        Task<IList<Happy5>> GetPopUpHappy5Matches(int matchId);

        Task<Sportsbook> GetPopUpSingleMatchParlay(int matchId, string marketId);

        #endregion Popup
    }
}