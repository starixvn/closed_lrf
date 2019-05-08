// -----------------------------------------------------------------------
// <copyright file="ReportController.PlatformWinLoss.cs" company="">
// ReportController copyright.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Controllers.Report
{
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Extension.Utility;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Fanex.Athena.Web.ActionFilter;
    using Model.Core.DataDomain;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;

    [FunctionAuthorization(PermissionKeys.ReportPlatformWinLoss)]
    public class PlatformWinLossReportController : ReportBaseController
    {
        public PlatformWinLossReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService)
            : base(languageService, sessionService, appSetting, productService)
        {
        }

        [HttpGet]
        public ActionResult Index()
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            var licenseeId = licenseeSession.LicenseeId;
            var metaModel = new PlatformWinLossMetaModel { LicenseeId = licenseeId };
            var productAccess = ProductService.GetProductAccess(
                licenseeId,
                userSession.Language,
                FunctionNames.PlatformWinloss,
                true);

            SetConvetedUSDCurrencyId(metaModel);
            SetConvetedUSDCurrencyName(metaModel);

            metaModel.ProductOptions = ToProductOptions(productAccess.ProductList);

            var model = new PlatformWinLossViewModel
            {
                Param = metaModel,
                CurrencyList = userSession.CurrencyList,
                ProductAccess = productAccess,
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };

            return View("~/Views/Desktop/Report/PlatformWinLoss/Main.cshtml", model);
        }
    }
}