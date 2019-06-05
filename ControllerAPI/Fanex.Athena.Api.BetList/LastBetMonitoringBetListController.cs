namespace Fanex.Athena.Api.BetList
{
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base;
    using Base.Attributes;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Service.Core.Common.Interfaces;
    using Model.BetList.MetaModel;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using VendorAdapter.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportLastBetsMonitoring)]
    public class LastBetMonitoringBetListController : BaseApiController
    {
        private readonly IBetListApiClient _betListApiClient;

        private readonly IMatchService _matchService;

        private readonly ICacheRefAdapter _cacheRefAdapter;

        public LastBetMonitoringBetListController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService languageService,
            IBetListApiClient betListApiClient,
            IMatchService matchService,
            ICacheRefAdapter cacheRefAdapter)
        : base(sessionService, productService, languageService)
        {
            _betListApiClient = betListApiClient;
            _matchService = matchService;
            _cacheRefAdapter = cacheRefAdapter;
        }

        [HttpGet]
        public async Task<dynamic> GetRunningMatchList(int sportId)
        {
            var matchList = await _matchService.GetAllRunningMatch(sportId, SessionService.UserSession.Language).ConfigureAwait(false);

            var leagueListNormal = matchList.Where(i => !i.IsOutRight).Select(m => m.LeagueId).Distinct()
                                      .Select(l => new League
                                      {
                                          IsOutRight = false,
                                          LeagueId = l,
                                          LeagueName = _cacheRefAdapter.GetLeagueName(l)
                                      }).ToList();
            var leagueListOutRight = matchList.Where(i => i.IsOutRight).Select(m => m.LeagueId).Distinct()

                                      .Select(l => new League
                                      {
                                          IsOutRight = true,
                                          LeagueId = l,
                                          LeagueName = _cacheRefAdapter.GetLeagueName(l)
                                      }).ToList();

            var leagueList = leagueListNormal.Union(leagueListOutRight);

            return new
            {
                MatchList = matchList.OrderBy(i => i.MatchName),
                LeagueList = leagueList.OrderBy(i => i.LeagueName)
            };
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Index(LastBetsMonitoringMetaModel metaModel)
        {
            if (string.IsNullOrWhiteSpace(metaModel.Currency))
            {
                metaModel.AgentListXml = SessionService.GenerateAgentListXml();
            }
            else
            {
                var currencyIdList = metaModel.Currency.Split(',').Select(int.Parse);
                metaModel.AgentListXml = SessionService.GenerateAgentListXml(currencyIdList);
            }

            metaModel.UserCurrencyList = UserCurrencyList;
            return await _betListApiClient.PostAsync(
                "/LastBetMonitoringBetList/GetData",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }
    }
}