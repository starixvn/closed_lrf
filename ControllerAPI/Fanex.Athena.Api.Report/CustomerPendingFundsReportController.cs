namespace Fanex.Athena.Api.Report
{
    using System.Collections.Generic;
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

    [ApiFunctionAuthorization(PermissionKeys.ReportCustomerPendingFunds)]
    public class CustomerPendingFundsReportController : ApiReportBaseController
    {
        private const int PageSizeExcel = int.MaxValue - 1000;

        private readonly IAppSettings _appSettings;

        private readonly ICustPendingFundsDataAccess _custPendingFundsDataAccess;

        public CustomerPendingFundsReportController(
            IAppSettings appSettings,
            ICustPendingFundsDataAccess custPendingFundsDataAccess,
            ISessionService sessionService,
            IProductService productService,
            ILanguageService langService)
            : base(sessionService, productService, langService)
        {
            _appSettings = appSettings;
            _custPendingFundsDataAccess = custPendingFundsDataAccess;
        }

        [HttpPost]
        public async Task<dynamic> Index(CustomerPendingFundsMetaModel metaModel)
        {
            var data = await GetData(metaModel).ConfigureAwait(false);

            return new
            {
                Data = data.DataList,
                Total = data.TotalData,
                TotalRows = data.TotalRows
            };
        }

        [HttpPost]
        public async Task<HttpResponseMessage> ExportExcel(CustomerPendingFundsMetaModel metaModel)
        {
            const string FileName = "CustomerPendingFunds.xls";
            const string TemplatePath = @"~/App_Data/Template/CustomerReports/CustomerPendingFunds.xls";

            var templatePath = HostingEnvironment.MapPath(TemplatePath);

            var convertingOption = new ConvertingOption
            {
                IsConvert = metaModel.IsConvert,
                BaseCurrency = metaModel.BaseCurrency,
                CurrencyName = metaModel.CurrencyName
            };

            metaModel.PageIndex = 1;
            metaModel.PageSize = PageSizeExcel;
            var data = await GetData(metaModel);
            var excelModel = new CustomerPendingFundsExcelModel
            {
                ConvertingOption = convertingOption,
                DataList = data.DataList,
                TotalData = data.TotalData,
                SystemIdVisible = !_appSettings.FakeLicenseeList.Contains(SessionService.LicenseeSession.LicenseeId)
            };
            var custPendingFundsExcel = CreateExcel(templatePath, excelModel);
            custPendingFundsExcel.Export();

            return ExcelStream(custPendingFundsExcel.Workbook, FileName);
        }

        protected internal virtual CustomerPendingFundsExcel CreateExcel(string templatePath, CustomerPendingFundsExcelModel excelModel)
        {
            return new CustomerPendingFundsExcel(templatePath, excelModel);
        }

        private async Task<ReportResultModel<CustPendingFunds>> GetData(CustomerPendingFundsMetaModel metaModel)
        {
            CheckValidProducts(FunctionNames.CustomerPendingFunds, metaModel);

            if (!metaModel.IsValid || !IsValidRequest(metaModel.CurrencyId))
            {
                return new ReportResultModel<CustPendingFunds>
                {
                    DataList = new List<CustPendingFunds>(),
                    TotalData = new CustPendingFunds()
                };
            }

            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            return await _custPendingFundsDataAccess.GetDataList(metaModel).ConfigureAwait(false);
        }
    }
}