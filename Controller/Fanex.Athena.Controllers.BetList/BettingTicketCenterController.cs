namespace Fanex.Athena.Controllers.BetList
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Constant.DataDomain;
    using DataAccess.Core.Configuration.Interfaces;
    using Extension.Utility;
    using Model.BetList.ViewModel;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Web.ActionFilter;

    [FunctionAuthorization(PermissionKeys.BettingTicketCenter)]
    public class BettingTicketCenterController : ContentBaseController
    {
        private readonly IProductService _productService;

        private readonly IBalanceUpDataAccess _balanceUpDataAccess;

        public BettingTicketCenterController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess)
        : base(languageService, sessionService, appSetting)
        {
            _productService = productService;
            _balanceUpDataAccess = balanceUpDataAccess;
        }

        public ActionResult Index()
        {
            return MultipleCustomers();
        }

        public ActionResult MultipleCustomers()
        {
            var viewModel = new BettingTicketCenterViewModel
            {
                CurrencyList = GetCurrencyList(),
                LiveStatusList = GetLiveStatusList(),
                StatusList = GetStatusList(),
                ProductOptionList = GetProductOptionList(FunctionNames.BettingTicketCenterMultiCustomers),
                MinDate = _balanceUpDataAccess.GetBalanceUp().BalanceUpDay,
                IsAllowedCustomerComm = SessionService.LicenseeSession.IsAllowedCustomerComm
            };
            return View("~/Views/Desktop/BetList/BettingTicketCenter/MultiCustomer.cshtml", viewModel);
        }

        public ActionResult SingleCustomer()
        {
            var viewModel = new BettingTicketCenterViewModel
            {
                LiveStatusList = GetLiveStatusList(),
                StatusList = GetStatusList(),
                PlatformList = GetPlatformList(),
                ProductOptionList = GetProductOptionList(),
                IsAllowedCustomerComm = SessionService.LicenseeSession.IsAllowedCustomerComm
            };
            return View("~/Views/Desktop/BetList/BettingTicketCenter/SingleCustomer.cshtml", viewModel);
        }

        public ActionResult RefNo()
        {
            ViewBag.BalanceUpDay = _balanceUpDataAccess.GetBalanceUp().BalanceUpDay;
            return View(
                "~/Views/Desktop/BetList/BettingTicketCenter/RefNo.cshtml",
                SessionService.LicenseeSession.IsAllowedCustomerComm);
        }

        public ActionResult Running()
        {
            var viewModel = new BettingTicketCenterViewModel
            {
                StatusList = GetRunningStatusList(),
                CurrencyList = GetCurrencyList(),
                ProductOptionList = GetProductOptionList(FunctionNames.BettingTicketCenterRunning),
                IsAllowedCustomerComm = SessionService.LicenseeSession.IsAllowedCustomerComm
            };

            return View("~/Views/Desktop/BetList/BettingTicketCenter/Running.cshtml", viewModel);
        }

        private static IEnumerable<CheckedItem> GetRunningStatusList()
        {
            return new List<CheckedItem>
            {
                new CheckedItem { ID = StatusTypes.Waiting, Name = ViewResources.Running, Checked = true },
                new CheckedItem { ID = StatusTypes.ResultPending, Name = ViewResources.ResultPending, Checked = true },
                new CheckedItem { ID = StatusTypes.UnderSettlement, Name = ViewResources.UnderSettlement, Checked = true }
            };
        }

        private static IEnumerable<CheckedItem> GetStatusList()
        {
            return new List<CheckedItem>
            {
                new CheckedItem { ID = StatusTypes.Won, Name = ViewResources.Won, Checked = true },
                new CheckedItem { ID = StatusTypes.Lose, Name = ViewResources.Lose, Checked = true },
                new CheckedItem { ID = StatusTypes.Draw, Name = ViewResources.Draw, Checked = true },
                new CheckedItem { ID = StatusTypes.Void, Name = ViewResources.Void },
                new CheckedItem { ID = StatusTypes.AbnormalBet, Name = ViewResources.AbnormalBet },
                new CheckedItem { ID = StatusTypes.Reject, Name = ViewResources.Reject },
                new CheckedItem { ID = StatusTypes.Refund, Name = ViewResources.Refund }
            };
        }

        private static IDictionary<int, string> GetPlatformList()
        {
            return new Dictionary<int, string>
            {
                { 0, ViewResources.All },
                { PlatformType.Asia, ViewResources.Asia },
                { PlatformType.China, ViewResources.China },
                { PlatformType.Euro, ViewResources.Euro },
                { PlatformType.Wap, ViewResources.Wap },
                { PlatformType.Mobile, ViewResources.Mobile },
                { PlatformType.Tablet, ViewResources.Tablet },
                { PlatformType.NewAsia, ViewResources.NewAsia },
                { PlatformType.MobileApp, ViewResources.MobileApp },
                { PlatformType.MobileLiteVersion, ViewResources.MobileLiteVersion }
            };
        }

        private static IDictionary<int, string> GetLiveStatusList()
        {
            return new Dictionary<int, string>
            {
                { LiveStatusTypes.NonLive, ViewResources.NoneLive },
                { LiveStatusTypes.Live, ViewResources.Live },
                { LiveStatusTypes.Mix, ViewResources.MixLiveAndNoneLive }
            };
        }

        private IDictionary<int, string> GetCurrencyList()
        {
            return SessionService.UserSession.CurrencyList;
        }

        private IEnumerable<ProductOption> GetProductOptionList(string functionConfigKey = FunctionNames.BettingTicketCenter)
        {
            var productAccess = _productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                functionConfigKey,
                true);

            return productAccess.ProductList.Select(i => new ProductOption
            {
                Code = i.ProductCode,
                Name = i.ProductName,
                Status = true
            }).ToList();
        }
    }
}