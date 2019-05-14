// -----------------------------------------------------------------------
// <copyright file="RunningBettypesBetListController.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Controllers.BetList
{
    #region Using

    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Constant.DataDomain;
    using DataAccess.Core.Configuration.Interfaces;
    using Extension.Utility;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Web.ActionFilter;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using VendorAdapter.Interfaces;

    #endregion Using

    /// <summary>
    /// RunningBetList contains bet list:.
    /// Mix Parlay              - bet type: 9.
    /// Clean Sheet             - bet type: 13.
    /// Double Chance           - bet type: 24.
    /// B/O/N team to score     - bet type: 26.
    /// To win to nil           - bet type: 27.
    /// 3-Way Handicap          - bet type: 28.
    /// </summary>
    public class RunningBettypesBetListController : BetListBaseController
    {
        private const string DoubleChangeBettypes = "24,151,186,410,431";

        private const string BONTeamToScoreBettypes = "26,145,146,170,188,427,433";

        private readonly int[] _parlayBettypes = new[] { (int)BetType.CombinationMixParlay, (int)BetType.SingleMatchParlay };

        public RunningBettypesBetListController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess,
            ICacheRefAdapter cacheRefAdapter,
            IBetListApiClient betListApiClient)
        : base(languageService, sessionService, appSetting, productService, balanceUpDataAccess, cacheRefAdapter, betListApiClient)
        {
        }

        [HttpGet]
        [FunctionAuthorization(PermissionKeys.TotalBetMixParlay)]
        public async Task<ActionResult> MixParlay(BetListExcelMetaModel metaModel)
        {
            metaModel.MultipleBettype = string.Join(",", _parlayBettypes);
            ViewBag.ReportTitle = Menu.Menu_12;
            ViewBag.UserGuideName = "TotalBetsMixParlay";
            return await ProcessRequest(metaModel).ConfigureAwait(false);
        }

        [HttpGet]
        [FunctionAuthorization(PermissionKeys.TotalBetDoubleChance)]
        public async Task<ActionResult> DoubleChange(BetListExcelMetaModel metaModel)
        {
            metaModel.MultipleBettype = DoubleChangeBettypes;
            ViewBag.ReportTitle = ViewResources.DoubleChance;
            ViewBag.UserGuideName = "TotalBetsDoubleChance";
            return await ProcessRequest(metaModel).ConfigureAwait(false);
        }

        [HttpGet]
        [FunctionAuthorization(PermissionKeys.TotalBetBONTeamToScore)]
        public async Task<ActionResult> BONTeamToScore(BetListExcelMetaModel metaModel)
        {
            metaModel.MultipleBettype = BONTeamToScoreBettypes;
            ViewBag.ReportTitle = ViewResources.BONTeamToScore;
            ViewBag.UserGuideName = "TotalBetsBON";
            return await ProcessRequest(metaModel).ConfigureAwait(false);
        }

        private async Task<ActionResult> ProcessRequest(BetListExcelMetaModel metaModel)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            CreateDefaultMetaModel(metaModel);
            var currencies = userSession.CurrencyList;

            if (metaModel.IsExportExcel)
            {
                if (metaModel.CurrencyId == BaseCurrencyType.All || currencies.ContainsKey(metaModel.CurrencyId))
                {
                    metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
                    return await Excel(metaModel).ConfigureAwait(false);
                }

                return EmptyExcel();
            }

            SetConvetedUSDCurrencyName(metaModel);

            var model = new BetListBaseViewModel
            {
                ShowEmptyContent = true,
                Param = metaModel,
                CurrencyList = currencies,
                ProductAccess = ProductService.GetProductAccess(metaModel.LicenseeId, userSession.Language),
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };

            return View("~/Views/Desktop/BetList/RunningBetListMultipleBettypes/Main.cshtml", model);
        }

        private async Task<ActionResult> Excel(BetListExcelMetaModel metaModel)
        {
            metaModel.UspKey = "Lrf_BetList_SelRunningByBettypeList";

            metaModel.ShowingOption = new BetListShowingOption
            {
                CustomerCommVisible = SessionService.LicenseeSession.IsAllowedCustomerComm,
            };

            var firstBettype = metaModel.MultipleBettype.Split(',').FirstOrDefault();
            metaModel.Title = $"{CacheRefAdapter.GetBettype(firstBettype)} - {GetViewInCurrency(metaModel)}";

            metaModel.IsShowSumStake = true;
            metaModel.HiddenColumns = HiddenColumnIndexes;

            return await ProcessExportExcel(metaModel, "RunningBetList").ConfigureAwait(false);
        }
    }
}