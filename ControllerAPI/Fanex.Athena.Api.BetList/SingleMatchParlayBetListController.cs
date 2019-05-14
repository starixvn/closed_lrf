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

    public class SingleMatchParlayBetListController : ApiBetListBaseController
    {
        public SingleMatchParlayBetListController(
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
        public async Task<HttpResponseMessage> Detail(long transId, int custId, string status)
        {
            CheckDataPermission(custId, transId);

            var metaModel = new SingleMatchParlayDetailMetaModel
            {
                CustId = custId,
                TransId = transId,
                Status = status
            };

            return await BridgeClientService.PostAsync("/SingleMatchParlayBetList/Detail", metaModel).ConfigureAwait(false);
        }
    }
}