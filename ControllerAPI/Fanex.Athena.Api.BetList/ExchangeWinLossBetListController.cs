namespace Fanex.Athena.Api.BetList
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base;
    using Base.Attributes;
    using Fanex.Athena.Service.StatelessCore.Interfaces;
    using Model.BetList.DTO;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using Model.Core.DataDomain;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility;
    using Service.Core.Utility.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportExchangeWinLoss)]
    public class ExchangeWinLossBetListController : BaseApiController
    {
        private readonly IBetListApiClient _betListApiClient;

        private readonly IAuthorizationService _authorizationService;

        public ExchangeWinLossBetListController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService languageService,
            IBetListApiClient betListApiClient,
            IAuthorizationService authorizationService)

        : base(sessionService, productService, languageService)
        {
            _betListApiClient = betListApiClient;
            _authorizationService = authorizationService;
        }

        [HttpPost]
        public async Task<dynamic> Index(ExchangeBetListMetaModel metaModel)
        {
            if (!IsValidRequest(metaModel))
            {
                return new ExchangeBetListViewModel
                {
                    MainData = null
                };
            }

            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.ExcludeTestData);

            return await _betListApiClient.PostAsync(
                "/ExchangeWinLossBetList/GetData",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<dynamic> Detail(ExchangeBetListDetailMetaModel metaModel)
        {
            if (!IsValidRequest(metaModel))
            {
                return new List<ExchangeTicketDetail>();
            }

            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.ExcludeTestData);

            return await _betListApiClient.PostAsync(
                "/ExchangeWinLossBetList/Detail",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }

        private bool IsValidRequest(BaseExchangeBetListMetaModel metaModel)
        {
            return metaModel.IsValid
                && (metaModel.CurrencyId == BaseCurrencyType.All || KeanOceanBusinessHelper.VerifyKeanOceanCurrencyRequest(
                    SessionService.UserSession.CurrencyList, SessionService.LicenseeSession.LicenseeId, metaModel.CurrencyId))
                && _authorizationService.HasPermissionOnData(SessionService.LicenseeSession.LicenseeId, metaModel.CustId, 0);
        }
    }
}