// -----------------------------------------------------------------------
// <copyright file="ReportController.CustomerPendingFunds.cs" company="">
// TODO: Update copyright text.
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

    [FunctionAuthorization(PermissionKeys.ReportCustomerPendingFunds)]
    public class CustomerPendingFundsReportController : ReportBaseController
    {
        public CustomerPendingFundsReportController(
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
            var metaModel = new CustomerPendingFundsMetaModel
            {
                LicenseeId = licenseeSession.LicenseeId,
                UserId = userSession.UserId
            };
            SetConvetedUSDCurrencyName(metaModel);
            var productAccess = ProductService.GetProductAccess(
                metaModel.LicenseeId,
                userSession.Language,
                FunctionNames.CustomerPendingFunds,
                true);

            metaModel.ProductOptions = ToProductOptions(productAccess.ProductList);

            var model = new CustomerPendingFundsViewModel
            {
                CurrencyList = userSession.CurrencyList,
                Param = metaModel,
                IsFakeLicensee = IsFakeLicensee(licenseeSession.LicenseeId)
            };

            return View("~/Views/Desktop/Report/CustomerPendingFunds/Main.cshtml", model);
        }
    }
}