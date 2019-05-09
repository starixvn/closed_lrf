// --------------------------------------------------------------------------
// <copyright file="PlatformWinLossReportController.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.Api.Report
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Hosting;
    using System.Web.Http;
    using Base.Attributes;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Fanex.Athena.Excel.Base.Entities;
    using Fanex.Athena.Excel.Report;
    using Fanex.Athena.Extension.Helper;
    using Fanex.Athena.Model.Report.DTO;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportPlatformWinLoss)]
    public class PlatformWinLossReportController : ApiReportBaseController
    {
        private readonly IPlatformWinLossDataAccess _platformWinLossDataAccess;

        public PlatformWinLossReportController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService langService,
            IPlatformWinLossDataAccess platformWinLossDataAccess)
            : base(sessionService, productService, langService)
        {
            _platformWinLossDataAccess = platformWinLossDataAccess;
        }

        [HttpPost]
        public Task<dynamic> Index(PlatformWinLossMetaModel metaModel)
        {
            return ProcessRequest(metaModel);
        }

        protected internal virtual PlatformWinLossSummaryExcel CreateExcelSummary(
            string templatePath,
            PlatformWinLossMetaModel metaModel,
            IEnumerable<PlatformWinLossSummary> dataList,
            PlatformWinLossSummary total)
        {
            return new PlatformWinLossSummaryExcel(templatePath, metaModel, dataList, total);
        }

        protected internal virtual PlatformWinLossMemberExcel CreateExcelMember(
            string templatePath,
            PlatformWinLossViewModel excelModel,
            ShowingOption showingOption)
        {
            return new PlatformWinLossMemberExcel(templatePath, excelModel, showingOption);
        }

        private static ShowingOption CreateShowingOption(IEnumerable<ProductOption> productOptions, bool isAllowedCustomerComm)
        {
            return new ShowingOption
            {
                BAVisible = productOptions.Any(p => p.Code == Product.BA && p.Status),
                NGVisible = productOptions.Any(p => p.Code == Product.NG && p.Status),
                SBVisible = productOptions.Any(p => p.Code == Product.SB && p.Status),
                VSVisible = productOptions.Any(p => p.Code == Product.VS && p.Status),
                CSVisible = productOptions.Any(p => p.Code == Product.CS && p.Status),
                KNVisible = productOptions.Any(p => p.Code == Product.KN && p.Status),
                CustomerCommVisible = isAllowedCustomerComm
            };
        }

        private static void SortMemberData(SortableList<PlatformWinLossMember> dataList, string sortBy, string sortOrder = "asc")
        {
            if (!string.IsNullOrEmpty(sortBy) &&
                !string.IsNullOrEmpty(sortOrder) &&
                typeof(PlatformWinLossMember).GetProperty(sortBy) != null)
            {
                dataList.Sort(sortBy, sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase), nameof(PlatformWinLossMember.Index), true);
            }
        }

        private HttpResponseMessage ExportExcelSummary(
            PlatformWinLossMetaModel metaModel,
            IEnumerable<PlatformWinLossSummary> dataList,
            PlatformWinLossSummary total)
        {
            const string FileName = "PlatformWinLossSummary.xls";
            var templatePath = HostingEnvironment.MapPath(@"~/App_Data/Template/Reports/PlatformWinLossSummary.xls");

            var excel = CreateExcelSummary(templatePath, metaModel, dataList, total);
            excel.Export();

            return ExcelStream(excel.Workbook, FileName);
        }

        private HttpResponseMessage ExportExcelMember(
            PlatformWinLossMetaModel metaModel,
            SortableList<PlatformWinLossMember> dataList,
            PlatformWinLossMember totalData)
        {
            const string FileName = "PlatformWinLossMember.xls";
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            var templatePath = HostingEnvironment.MapPath(@"~/App_Data/Template/Reports/PlatformWinLossMember.xls");

            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId,
                userSession.Language,
                FunctionNames.PlatformWinloss);

            if (dataList.Any())
            {
                SortMemberData(dataList, metaModel.SortBy, metaModel.SortOrder);
            }

            var excelModel = new PlatformWinLossViewModel
            {
                MainResult = dataList,
                TotalResult = totalData,
                Param = metaModel,
                CurrencyList = userSession.CurrencyList,
                ProductAccess = productAccess,
                Colspan = 7 + (productAccess.IsAllowBA ? 2 : 0),
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };

            var showingOption = CreateShowingOption(metaModel.ProductOptions, licenseeSession.IsAllowedCustomerComm);

            var platformWinLossExcel = CreateExcelMember(templatePath, excelModel, showingOption);
            platformWinLossExcel.Export();

            return ExcelStream(platformWinLossExcel.Workbook, FileName);
        }

        private async Task<dynamic> ProcessRequest(PlatformWinLossMetaModel metaModel)
        {
            CheckValidProducts(FunctionNames.PlatformWinloss, metaModel);

            if (!IsValidRequest(metaModel.CurrencyId))
            {
                return BadRequest(ViewResources.InvalidParams);
            }

            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.IsExcludedTestData);

            if (metaModel.Level == 0)
            {
                var result = metaModel.IsValid ?
                    await _platformWinLossDataAccess.GetSummaryData(metaModel) :
                    new ReportResultModel<PlatformWinLossSummary>
                    {
                        DataList = new List<PlatformWinLossSummary>(),
                        TotalData = new PlatformWinLossSummary()
                    };
                return metaModel.IsExportExcel ?
                    ExportExcelSummary(metaModel, result.DataList, result.TotalData) :
                   (dynamic)new
                   {
                       Data = result.DataList,
                       Total = result.TotalData,
                       ProductOptions = metaModel.ProductOptions.ToJson()
                   };
            }
            else
            {
                var result = metaModel.IsValid ?
                    await _platformWinLossDataAccess.GetMemberData(metaModel, SessionService.UserSession.CurrencyList) :
                    new SortableReportResultModel<PlatformWinLossMember>
                    {
                        DataList = new SortableList<PlatformWinLossMember>(),
                        TotalData = new PlatformWinLossMember()
                    };

                return metaModel.IsExportExcel
                    ? ExportExcelMember(metaModel, result.DataList, result.TotalData)
                    : (dynamic)new
                    {
                        Data = result.DataList,
                        Total = result.TotalData,
                        ProductOptions = metaModel.ProductOptions.ToJson()
                    };
            }
        }
    }
}