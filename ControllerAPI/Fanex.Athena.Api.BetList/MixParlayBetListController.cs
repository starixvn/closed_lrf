// --------------------------------------------------------------------------
// <copyright file="MixParlayBetListController.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.Api.BetList
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using DataAccess.Core.Configuration.Interfaces;
    using Model.BetList.MetaModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using Service.StatelessCore.Interfaces;

    public class MixParlayBetListController : ApiBetListBaseController
    {
        public MixParlayBetListController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService languageService,
            IAuthorizationService authorizationService,
            IBetListApiClient betListApiClient,
            IBalanceUpDataAccess balanceUpDataAccess)
        : base(sessionService, productService, languageService, authorizationService, betListApiClient, balanceUpDataAccess)
        {
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Detail(long transId, int custId)
        {
            CheckDataPermission(custId, transId);

            var metaModel = new MixParlayDetailMetaModel
            {
                CustId = custId,
                TransId = transId,
                UserCurrencyList = UserCurrencyList
            };

            return await BridgeClientService.PostAsync(
                "/MixParlayBetList/Detail",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> NewParlayDetail(long transId, string betTeam, string betCheck, decimal handicap1, decimal handicap2, int custId)
        {
            CheckDataPermission(custId, transId);

            var metaModel = new NewParlayDetailMetaModel
            {
                TransId = transId,
                BetTeam = betTeam,
                BetCheck = betCheck,
                Handicap1 = handicap1,
                Handicap2 = handicap2,
                CustId = custId,
                UserCurrencyList = UserCurrencyList
            };
            return await BridgeClientService.PostAsync(
                "/MixParlayBetList/NewParlayDetail",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }
    }
}