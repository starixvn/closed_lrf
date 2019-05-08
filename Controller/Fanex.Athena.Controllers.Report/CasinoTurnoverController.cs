namespace Fanex.Athena.Controllers.Report
{
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Constant.DataDomain;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Report.ViewModel;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;
    using Service.Core.Users.Interfaces;
    using Web.ActionFilter;

    [FunctionAuthorization(PermissionKeys.ReportCasinoTurnover)]
    public class CasinoTurnoverController : ReportBaseController
    {
        private readonly IReportSettingService _reportSettingService;

        public CasinoTurnoverController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IReportSettingService reportSettingService)
        : base(languageService, sessionService, appSetting, productService)
        {
            _reportSettingService = reportSettingService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var productAccess = ProductService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.CasinoTurnover,
                true);
            var setting = _reportSettingService.GetSetting(PermissionKeys.ReportCasinoTurnover);

            var viewModel = new CasinoTurnoverViewModel
            {
                FromDate = DateTime.Today,
                ToDate = DateTime.Today,
                CurrencyList = SessionService.UserSession.CurrencyList,
                BaseCurrencies = SystemConstants.NewBaseCurrencyList,
                ProductOptions = ToProductOptions(productAccess.ProductList),
                Status = GetStatusList(),
                MinDate = setting.MinDate,
                MaxDate = setting.MaxDate
            };

            return View("~/Views/Desktop/Report/CasinoTurnover/Main.cshtml", viewModel);
        }

        private static IList<CheckedItem> GetStatusList()
        {
            return new List<CheckedItem>
            {
                new CheckedItem { ID = StatusTypes.Won, Name = ViewResources.Won, Checked = true },
                new CheckedItem { ID = StatusTypes.Lose, Name = ViewResources.Lose, Checked = true },
                new CheckedItem { ID = StatusTypes.Draw, Name = ViewResources.Draw, Checked = false }
            };
        }
    }
}