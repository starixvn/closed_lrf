namespace Fanex.Athena.Controllers.Report
{
    using System;
    using System.Web.Mvc;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Report.ViewModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;
    using Service.Core.Users.Interfaces;
    using Web.ActionFilter;

    ////[FunctionAuthorization(PermissionKeys.ReportDetailedBilling)]
    public class DetailedBillingReportController : ReportBaseController
    {
        private readonly IDetailedBillingDataAccess _dataAccess;

        private readonly IReportSettingService _reportSettingService;

        public DetailedBillingReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IDetailedBillingDataAccess dataAccess,
            IReportSettingService reportSettingService)
            : base(languageService, sessionService, appSetting, productService)
        {
            _dataAccess = dataAccess;
            _reportSettingService = reportSettingService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var today = DateTime.Today;
            var viewModel = new DetailedBillingViewModel
            {
                FromDate = new DateTime(today.Year, today.Month, 1),
                ToDate = today,
                BaseCurrencyList = SystemConstants.NewBaseCurrencyList,
                BaseCurrency = _dataAccess.GetLicenseeBaseCurrency(SessionService.LicenseeSession.LicenseeId),
                ReportSetting = _reportSettingService.GetSetting(PermissionKeys.ReportDetailedBilling)
            };

            return View("~/Views/Desktop/Report/DetailedBilling/Main.cshtml", viewModel);
        }
    }
}
