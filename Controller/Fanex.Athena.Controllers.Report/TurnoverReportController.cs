// -----------------------------------------------------------------------
// <copyright file="ReportController.Turnover.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Controllers.Report
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Extension.Utility;
    using Fanex.Athena.Excel.Base.Entities;
    using Fanex.Athena.Excel.Report;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Fanex.Athena.Web.ActionFilter;
    using Fanex.Athena.Web.ResultExtension;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility;
    using Service.Report.Interfaces;

    [FunctionAuthorization(PermissionKeys.ReportTurnover)]
    public class TurnoverReportController : ReportBaseController
    {
        private readonly ITurnoverService _turnoverService;

        public TurnoverReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            ITurnoverService turnoverService)
            : base(languageService, sessionService, appSetting, productService)
        {
            _turnoverService = turnoverService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            var metaModel = new TurnoverMetaModel
            {
                LicenseeId = licenseeSession.LicenseeId,
                UserId = userSession.UserId,
            };

            SetConvetedUSDCurrencyName(metaModel);
            SetConvetedUSDCurrencyId(metaModel);

            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId,
                userSession.Language,
                FunctionNames.Turnover,
                true);
            metaModel.ProductOptions = ToProductOptions(productAccess.ProductList.Where(a => !a.ProductCode.Equals(Product.BA)));

            var model = new TurnoverViewModel
            {
                Param = metaModel,
                ProductAccess = productAccess,
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm,
                CurrencyList = GetCurrenciesForTurnoverReport(licenseeSession.LicenseeId),
                IsAllowedCasinoTransfer = AppSettings.LicenseeAllowCasinoTransfer.Contains(licenseeSession.LicenseeId),
                IsFakeLicensee = IsFakeLicensee(licenseeSession.LicenseeId)
            };

            return View("~/Views/Desktop/Report/Turnover/Main.cshtml", model);
        }

        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Excel(TurnoverMetaModel metaModel)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;

            var placeholderUsername = IsFakeLicensee(licenseeSession.LicenseeId) ? ViewResources.ExternalId : ViewResources.ExternalIdOrSystemId;
            metaModel.Username = string.IsNullOrWhiteSpace(metaModel.Username) ||
                metaModel.Username.Trim() == placeholderUsername ? null : metaModel.Username;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.IsExcludeTest);

            var dataList = await _turnoverService.GetDataList(metaModel);

            var model = new TurnoverViewModel
            {
                DataList = dataList,
                TotalData = _turnoverService.SumTotalData(dataList),
                Param = metaModel,
                ProductAccess = ProductService.GetProductAccess(
                    licenseeSession.LicenseeId,
                    userSession.Language,
                    FunctionNames.Turnover,
                    true),
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm,
                CurrencyList = GetCurrenciesForTurnoverReport(licenseeSession.LicenseeId),
                IsAllowedCasinoTransfer = licenseeSession.LicenseeId == 1
            };

            return ExportExcel(model);
        }

        private ActionResult ExportExcel(TurnoverViewModel viewModel)
        {
            const string FileName = "Turnover";

            var templatePath = HostingEnvironment.MapPath("~/App_Data/Template/Reports/Turnover.xls");

            var licenseeId = SessionService.LicenseeSession.LicenseeId;

            var productAccess = ProductService.GetProductAccess(
                licenseeId,
                SessionService.UserSession.Language,
                FunctionNames.Turnover,
                true);

            var showingOption = new ShowingOption
            {
                CustomerCommVisible = this.SessionService.LicenseeSession.IsAllowedCustomerComm,
                BAVisible = productAccess.IsAllowBA
            };

            var isShowCasinoTransfer = AppSettings.LicenseeAllowCasinoTransfer.Contains(licenseeId);
            var excel = CreateExcel(templatePath, viewModel, showingOption, isShowCasinoTransfer);

            excel.Export();

            return new ExcelResult(excel.Workbook, FileName);
        }

        protected internal virtual TurnoverExcel CreateExcel(
            string templatePath,
            TurnoverViewModel viewModel,
            ShowingOption showingOption,
            bool isShowCasinoTransfer)
        {
            return new TurnoverExcel(templatePath, showingOption, viewModel) { IsShowCasinoTransfer = isShowCasinoTransfer };
        }

        private IDictionary<int, string> GetCurrenciesForTurnoverReport(int licenseeId)
        {
            var currencyList = SessionService.UserSession.CurrencyList;
            KeanOceanBusinessHelper.AddHKDCurrencyForTurnOverReport(currencyList, licenseeId);
            return currencyList;
        }
    }
}