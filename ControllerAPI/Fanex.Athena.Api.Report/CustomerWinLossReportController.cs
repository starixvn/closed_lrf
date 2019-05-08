namespace Fanex.Athena.Api.Report
{
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Hosting;
    using System.Web.Http;
    using DataAccess.Report.Interfaces;
    using Excel.Base.Entities;
    using Excel.Report;
    using Excel.Report.Models;
    using Extension.Utility;
    using Fanex.Athena.Api.Base.Attributes;
    using Fanex.Athena.Model.Core.DataDomain;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportCustomerWinLoss)]
    public class CustomerWinLossReportController : ApiReportBaseController
    {
        private readonly IAppSettings _appSettings;

        private readonly ICustWinlossDataAccess _custWinlossDataAccess;

        public CustomerWinLossReportController(
            IAppSettings appSettings,
            ICustWinlossDataAccess custWinlossDataAccess,
            ISessionService sessionService,
            IProductService productService,
            ILanguageService langService)
            : base(sessionService, productService, langService)
        {
            _appSettings = appSettings;
            _custWinlossDataAccess = custWinlossDataAccess;
        }

        [HttpPost]
        public async Task<dynamic> Index(CustomerWinLossMetaModel metaModel)
        {
            return metaModel.IsExportExcel ? 
                await ExportExcel(metaModel).ConfigureAwait(false) : 
                await ProcessRequest(metaModel).ConfigureAwait(false);
        }

        protected internal virtual CustomerWinLossExcel CreateExcel(string templatePath, CustomerWinLossExcelModel excelModel)
        {
            return new CustomerWinLossExcel(templatePath, excelModel);
        }

        private async Task<dynamic> ProcessRequest(CustomerWinLossMetaModel metaModel)
        {
            var result = await GetData(metaModel).ConfigureAwait(false);

            return new
            {
                Data = result.DataList,
                Total = result.TotalData,
                TotalRows = result.TotalRows,
                PromotionPrize = result.AdditionalInfo
            };
        }

        private async Task<HttpResponseMessage> ExportExcel(CustomerWinLossMetaModel metaModel)
        {
            const string FileName = "CustomerWinLoss.xls";
            const string TemplatePath = @"~/App_Data/Template/CustomerReports/CustomerWinLoss.xls";

            var templatePath = HostingEnvironment.MapPath(TemplatePath);

            var licenseeSession = SessionService.LicenseeSession;
            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId, 
                SessionService.UserSession.Language, 
                FunctionNames.CustomerBalance,
                true);

            var convertingOption = new ConvertingOption
            {
                IsConvert = metaModel.IsConvert,
                BaseCurrency = metaModel.BaseCurrency,
                CurrencyName = metaModel.CurrencyName
            };

            var result = await GetData(metaModel).ConfigureAwait(false);
            var excelModel = new CustomerWinLossExcelModel
            {
                ConvertingOption = convertingOption,
                DataList = result.DataList,
                MetaModel = metaModel,
                TotalData = result.TotalData,
                BAVisible = productAccess.IsAllowBA,
                CustomerCommVisible = licenseeSession.IsAllowedCustomerComm,
                SystemIdVisible = !_appSettings.FakeLicenseeList.Contains(licenseeSession.LicenseeId)
            };

            var excel = CreateExcel(templatePath, excelModel);
            excel.Export();

            return ExcelStream(excel.Workbook, FileName);
        }

        private async Task<ReportResultModel<CustomerWinLoss>> GetData(CustomerWinLossMetaModel metaModel)
        {
            if (!metaModel.IsValid || !IsValidRequest(metaModel.CurrencyId))
            {
                return new ReportResultModel<CustomerWinLoss>
                {
                    TotalData = new CustomerWinLoss(),
                    DataList = new SortableList<CustomerWinLoss>()
                };
            }

            CheckValidProducts(FunctionNames.CustomerWinLoss, metaModel);

            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.IsExcludedTestData);
            return await _custWinlossDataAccess.GetDataList(metaModel).ConfigureAwait(false);
        }
    }
}