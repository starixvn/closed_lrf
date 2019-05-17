namespace Fanex.Athena.Controllers.Report
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Report.ViewModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;
    using Service.Core.Users.Interfaces;
    using Web.ActionFilter;

    [FunctionAuthorization(PermissionKeys.ReportDetailedBilling)]
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
            var baseCurrency = _dataAccess.GetLicenseeBaseCurrency(SessionService.LicenseeSession.LicenseeId);
            var baseCurrencyList = GetBaseCurrencyList(baseCurrency);
            var viewModel = new DetailedBillingViewModel
            {
                FromDate = new DateTime(today.Year, today.Month, 1),
                ToDate = today,
                BaseCurrencyList = baseCurrencyList,
                BaseCurrency = string.IsNullOrEmpty(baseCurrency) ? baseCurrency : baseCurrencyList.FirstOrDefault(),
                ReportSetting = _reportSettingService.GetSetting(PermissionKeys.ReportDetailedBilling)
            };

            return View("~/Views/Desktop/Report/DetailedBilling/Main.cshtml", viewModel);
        }

        private static IList<string> GetBaseCurrencyList(string baseCurrency)
        {
            if (string.IsNullOrEmpty(baseCurrency) && !SystemConstants.NewBaseCurrencyList.Any(x=>x == baseCurrency))
            {
                var baseCurrencyList = new List<string> { baseCurrency };
                baseCurrencyList.AddRange(SystemConstants.NewBaseCurrencyList);

                return baseCurrencyList;
            }

            return SystemConstants.NewBaseCurrencyList;
        }
    }
}
