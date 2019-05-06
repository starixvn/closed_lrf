// -----------------------------------------------------------------------
// <copyright file="IResultDataAccess.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Result.DataAccess
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Common.Model.DTO;
    using Fanex.Result.Core.Racing.DTO;
    using Fanex.Result.Core.Sportsbook.DTO;
    using Model.MetaModel;

    [System.CLSCompliant(false)]
    public interface IResultDataAccess
    {
        Task<IList<Outright>> GetOutRight(ResultMetaModel metal);

        #region Filter

        Task<IList<Sport>> GetSports(DateTime dateValue, int licenseeId);

        Task<IList<League>> GetLeagues(DateTime dateValue, int sportId);

        #endregion Filter

        #region Report

        Task<IList<T>> GetMatches<T>(ResultMetaModel metalModel);

        Task<IList<Racing>> GetVirtualSportMatches(ResultMetaModel metalModel);

        #endregion Report

        #region Popup

        Task<IList<T>> GetPopUpMatches<T>(ResultPopupMetaModel metaModel);

        Task<IList<Parlay>> GetPopUpParalayMatch(long refNo);

        Task<Sportsbook> GetSportsbookGameDetail(int matchId);

        Task<Sportsbook> GetPopUpSingleMatchParlay(int matchId, string marketId);

        #endregion Popup
    }
}