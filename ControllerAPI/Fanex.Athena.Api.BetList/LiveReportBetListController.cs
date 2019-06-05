// --------------------------------------------------------------------------
// <copyright file="LiveReportBetListController.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>

// --------------------------------------------------------------------------

namespace Fanex.Athena.Api.BetList
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base.Attributes;
    using DataAccess.Core.Configuration.Interfaces;
    using Fanex.Athena.Model.Core.DataDomain;
    using Model.BetList.MetaModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using Service.StatelessCore.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportLiveReport)]
    public class LiveReportBetListController : ApiBetListBaseController
    {
        public LiveReportBetListController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService languageService,
            IAuthorizationService authorizationService,
            IBetListApiClient betListApiClient,
            IBalanceUpDataAccess balanceUpDataAccess)
        : base(sessionService, productService, languageService, authorizationService, betListApiClient, balanceUpDataAccess)
        {
        }

        [HttpPost]
        public async Task<dynamic> Match(LiveReportBetListMetaModel metaModel)
        {
            if (!IsValidCurrencyId(metaModel.CurrencyId))
            {
                return null;
            }

            const string UspKey = "Lrf_BetList_LiveReport_SelWinlossByMatch";

            return await GetData(metaModel, UspKey).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<dynamic> Outright(LiveReportBetListMetaModel metaModel)
        {
            if (IsValidCurrencyId(metaModel.CurrencyId))
            {
                const string UspKey = "Lrf_BetList_LiveReport_SelWinlossOutright";
                return await GetData(metaModel, UspKey).ConfigureAwait(false);
            }

            return null;
        }

        [HttpGet]
        public async Task<dynamic> NumberGame([FromUri] LiveReportBetListMetaModel metaModel, int page, int rows)
        {
            if (IsValidCurrencyId(metaModel.CurrencyId))
            {
                metaModel.IsServerPaging = true;
                const string UspKey = "Lrf_BetList_LiveReport_SelWinlossNumberGame";

                return await GetPagingData(metaModel, UspKey, page, rows).ConfigureAwait(false);
            }

            return null;
        }

        [HttpGet]
        public async Task<dynamic> MixParlay([FromUri] LiveReportBetListMetaModel metaModel, int page, int rows)
        {
            if (IsValidCurrencyId(metaModel.CurrencyId))
            {
                const string UspKey = "Lrf_BetList_LiveReport_SelWinlossParlay";

                metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);

                return await GetPagingData(metaModel, UspKey, page, rows).ConfigureAwait(false);
            }

            return null;
        }

        [HttpGet]
        public async Task<dynamic> VirtualSports([FromUri] LiveReportBetListMetaModel metaModel, int page, int rows)
        {
            if (IsValidCurrencyId(metaModel.CurrencyId))
            {
                const string UspName = "Lrf_BetList_LiveReport_SelWinlossVHRacing";

                return await GetPagingData(metaModel, UspName, page, rows).ConfigureAwait(false);
            }

            return null;
        }

        #region Utility

        private async Task<HttpResponseMessage> GetData(LiveReportBetListMetaModel metaModel, string uspKey)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            metaModel.HasPlayerCom = licenseeSession.IsAllowedCustomerComm;
            metaModel.CurrencyList = userSession.CurrencyList;
            metaModel.UspKey = uspKey;

            return await BridgeClientService.PostAsync(
                "/LiveReportBetList/GetData",
                metaModel,
                userSession.Language).ConfigureAwait(false);
        }

        private async Task<HttpResponseMessage> GetPagingData(LiveReportBetListMetaModel metaModel, string uspKey, int pageIndex, int pageSize)
        {
            const int DefautlPageSize = 100;

            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            metaModel.PageIndex = pageIndex < 1 ? 1 : pageIndex;
            metaModel.PageSize = pageSize < 1 ? DefautlPageSize : pageSize;
            metaModel.LicenseeId = licenseeSession.LicenseeId;
            metaModel.HasPlayerCom = licenseeSession.IsAllowedCustomerComm;
            metaModel.CurrencyList = userSession.CurrencyList;
            metaModel.UspKey = uspKey;

            return await BridgeClientService.PostAsync(
                "/LiveReportBetList/GetPagingData",
                metaModel,
                userSession.Language).ConfigureAwait(false);
        }

        #endregion Utility
    }
}