namespace Fanex.Athena.Controllers.BetList
{
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using DataAccess.Core.Configuration.Interfaces;
    using Extension.Utility;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using VendorAdapter.Interfaces;

    public class CashOutBetListController : BetListBaseController
    {
#pragma warning disable S107 // Methods should not have too many parameters

        public CashOutBetListController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess,
            ICacheRefAdapter cacheRefAdapter,
            IBetListApiClient betListApiClient)
#pragma warning restore S107 // Methods should not have too many parameters
        : base(languageService, sessionService, appSetting, productService, balanceUpDataAccess, cacheRefAdapter, betListApiClient)
        {
        }

        [HttpGet]
        public async Task<ActionResult> Detail(CashOutBetListDetailMetaModel metaModel)
        {
            var userSession = SessionService.UserSession;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml();
            metaModel.HasPlayerComm = SessionService.LicenseeSession.IsAllowedCustomerComm;
            metaModel.UserCurrencyList = userSession.CurrencyList;

            var viewModel = await BetListApiClient.PostAsync<CashOutBetListDetailViewModel>(
                "/CashOutBetList/Detail",
                metaModel,
                userSession.Language).ConfigureAwait(false);

            return this.View("~/Views/Desktop/BetList/CashOutDetail/Main.cshtml", viewModel);
        }
    }
}