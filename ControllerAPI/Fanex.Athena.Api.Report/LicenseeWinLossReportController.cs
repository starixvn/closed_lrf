// --------------------------------------------------------------------------
// <copyright file="LicenseeWinLossReportController.cs" company="">
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
    using Excel.Report.Models;
    using Fanex.Athena.Excel.Report;
    using Fanex.Athena.Extension.Helper;
    using Fanex.Athena.Extension.Utility;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Model.Report.DTO;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Model.Core.DataDomain;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportLicenseeWinLoss)]
    public class LicenseeWinLossReportController : ApiReportBaseController
    {
        private readonly IReportSettingService _reportSettingService;

        private readonly ILicenseeWinLossDataAccess _licenseeWinLossDataAccess;

        public LicenseeWinLossReportController(
            ISessionService sessionService,
            IProductService productService,
            IReportSettingService reportSettingService,
            ILanguageService langService,
            ILicenseeWinLossDataAccess licenseeWinLossDataAccess)
            : base(sessionService, productService, langService)
        {
            _reportSettingService = reportSettingService;
            _licenseeWinLossDataAccess = licenseeWinLossDataAccess;
        }

        [HttpPost]
        public Task<dynamic> Index(
            LicenseeWinLossMetaModel metaModel,
            DateTime? fdate,
            DateTime? tdate,
            int level = 0,
            int currencyId = 0,
            int custId = 0,
            string currencyName = null)
        {
            return ProcessRequest(metaModel, fdate, tdate, level, currencyId, custId, currencyName);
        }

        [HttpPost]
        public Task<dynamic> Index([FromBody] LicenseeWinLossMetaModel metaModel)
        {
            return ProcessRequest(metaModel, null, null);
        }

        private static dynamic GetEmptyResult(IEnumerable<ProductOption> productOptions)
        {
            return new
            {
                Data = new List<LicenseeWinLossGridViewModel>(),
                Total = new List<LicenseeWinLossGridViewModel>(),
                SummaryTotal = new Dictionary<string, LicenseeWinLossGridViewModel>(),
                ProductOptions = productOptions.ToJson(),
                PromotionPrize = 0
            };
        }

        private static void SortData(SortableList<LicenseeWinLoss> dataList, string sortBy, string sortOrder = "asc")
        {
            if (string.IsNullOrEmpty(sortBy))
            {
                return;
            }

            var propertyName = sortBy;

            // Sort for grouping columns, get the real column name
            if (sortBy.EndsWith("Single", StringComparison.OrdinalIgnoreCase))
            {
                propertyName = sortBy.Remove(sortBy.LastIndexOf("Single", StringComparison.OrdinalIgnoreCase));
            }

            var property = typeof(LicenseeWinLoss).GetProperty(propertyName);

            if (property == null)
            {
                string productCode;

                if (propertyName.Contains(nameof(LicenseeWinLoss.LicenseeWL)))
                {
                    const string LicenseeWLColumn = nameof(LicenseeWinLoss.LicenseeWL);

                    productCode = propertyName.Substring(LicenseeWLColumn.Length);
                    propertyName = LicenseeWLColumn;
                }
                else
                {
                    const string TurnOverColumn = nameof(LicenseeWinLoss.TurnOver);

                    productCode = propertyName.Substring(TurnOverColumn.Length);
                    propertyName = TurnOverColumn;
                }

                dataList.SortByDictionary(productCode, propertyName, sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase), nameof(LicenseeWinLoss.Index), true);
            }
            else
            {
                dataList.Sort(propertyName, sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase), nameof(LicenseeWinLoss.Index), true);
            }
        }

        private static LicenseeWinLossGridViewModel MapToGridView(LicenseeWinLoss item)
        {
            var licenseeWinLossGrid = new LicenseeWinLossGridViewModel
            {
                Index = item.Index,
                AmtDueToBA = item.AmtDueToBA,
                AmtDueToBetTrade = item.AmtDueToBetTrade,
                CashOutCommission = item.CashOutCommission,
                BACommission = item.BACommission,
                BetTradeCommission = item.BetTradeCommission,
                CurrencyId = item.CurrencyId,
                SystemId = item.SystemId,
                CurrencyName = item.CurrencyName,
                CustomerComm = item.CustomerComm,
                CustomerWinLoss = item.CustomerWinLoss,
                TotalTransaction = item.TotalTransaction,
                CustomerId = item.CustomerId,
                Date = item.Date,
                ExternalId = item.ExternalId,
                BuyBackAmountSB = item.BuyBackAmountSB,
                BuyBackAmountBA = item.BuyBackAmountBA,
                TotalBuyBackAmount = item.TotalBuyBackAmount,
                ActualStake = item.ActualStake
            };
            SetLicenseeWinLossProductData(licenseeWinLossGrid, item.LicenseeWL);
            SetTurnOverProductData(licenseeWinLossGrid, item.TurnOver);

            return licenseeWinLossGrid;
        }

        private static void SetLicenseeWinLossProductData(LicenseeWinLossGridViewModel licenseeWinLoss, IDictionary<string, decimal> licenseeWLProducts)
        {
            licenseeWinLoss.LicenseeWLBA = licenseeWLProducts.GetValueOrDefault(Product.BA, 0);
            licenseeWinLoss.LicenseeWLSB = licenseeWLProducts.GetValueOrDefault(Product.SB, 0);
            licenseeWinLoss.LicenseeWLNG = licenseeWLProducts.GetValueOrDefault(Product.NG, 0);
            licenseeWinLoss.LicenseeWLVS = licenseeWLProducts.GetValueOrDefault(Product.VS, 0);
            licenseeWinLoss.LicenseeWLCS = licenseeWLProducts.GetValueOrDefault(Product.CS, 0);
            licenseeWinLoss.LicenseeWLKN = licenseeWLProducts.GetValueOrDefault(Product.KN, 0);
            licenseeWinLoss.LicenseeWLBT = licenseeWLProducts.GetValueOrDefault(Product.BT, 0);
            licenseeWinLoss.LicenseeWLAGC = licenseeWLProducts.GetValueOrDefault(Product.AGC, 0);
            licenseeWinLoss.LicenseeWLVB = licenseeWLProducts.GetValueOrDefault(Product.VB, 0);
            licenseeWinLoss.LicenseeWLAB = licenseeWLProducts.GetValueOrDefault(Product.AB, 0);
            licenseeWinLoss.LicenseeWLFW = licenseeWLProducts.GetValueOrDefault(Product.FW, 0);
            licenseeWinLoss.LicenseeWLCO = licenseeWLProducts.GetValueOrDefault(Product.CO, 0);
            licenseeWinLoss.LicenseeWLVS2 = licenseeWLProducts.GetValueOrDefault(Product.VS2, 0);
            licenseeWinLoss.LicenseeWLLT = licenseeWLProducts.GetValueOrDefault(Product.LT, 0);
            licenseeWinLoss.LicenseeWLPP = licenseeWLProducts.GetValueOrDefault(Product.PP, 0);
        }

        private static void SetTurnOverProductData(LicenseeWinLossGridViewModel licenseeWinLoss, IDictionary<string, decimal> turnOverProducts)
        {
            licenseeWinLoss.TurnOverBA = turnOverProducts.GetValueOrDefault(Product.BA, 0);
            licenseeWinLoss.TurnOverSB = turnOverProducts.GetValueOrDefault(Product.SB, 0);
            licenseeWinLoss.TurnOverNG = turnOverProducts.GetValueOrDefault(Product.NG, 0);
            licenseeWinLoss.TurnOverVS = turnOverProducts.GetValueOrDefault(Product.VS, 0);
            licenseeWinLoss.TurnOverCS = turnOverProducts.GetValueOrDefault(Product.CS, 0);
            licenseeWinLoss.TurnOverKN = turnOverProducts.GetValueOrDefault(Product.KN, 0);
            licenseeWinLoss.TurnOverBT = turnOverProducts.GetValueOrDefault(Product.BT, 0);
            licenseeWinLoss.TurnOverAGC = turnOverProducts.GetValueOrDefault(Product.AGC, 0);
            licenseeWinLoss.TurnOverVB = turnOverProducts.GetValueOrDefault(Product.VB, 0);
            licenseeWinLoss.TurnOverAB = turnOverProducts.GetValueOrDefault(Product.AB, 0);
            licenseeWinLoss.TurnOverFW = turnOverProducts.GetValueOrDefault(Product.FW, 0);
            licenseeWinLoss.TurnOverVS2 = turnOverProducts.GetValueOrDefault(Product.VS2, 0);
            licenseeWinLoss.TurnOverLT = turnOverProducts.GetValueOrDefault(Product.LT, 0);
            licenseeWinLoss.TurnOverPP = turnOverProducts.GetValueOrDefault(Product.PP, 0);
        }

        private static bool IsProductVisible(IEnumerable<ProductOption> productOptions, ProductAccess productAccess, string productCode)
        {
            return productOptions.Any(x => x.Status && x.Code == productCode) && productAccess.IsAllow(productCode);
        }

        private HttpResponseMessage ExportExcel(
            LicenseeWinLossMetaModel metaModel,
            SortableReportResultModel<LicenseeWinLoss> data)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            const string FileName = "LicenseeWinLoss.xls";
            var templatePath = HostingEnvironment.MapPath(@"~/App_Data/Template/Reports/LicenseeWinLoss.xls");
            var productAccess = ProductService.GetProductAccess(licenseeSession.LicenseeId, userSession.Language);

            if (metaModel.DrillDownLevel > 0)
            {
                metaModel.FromDate = metaModel.DrillDownFromDate;
                metaModel.ToDate = metaModel.DrillDownToDate;
                metaModel.CurrencyId = metaModel.CurrencyId > 0 ? metaModel.DrillDownCurrencyId : metaModel.CurrencyId;
                metaModel.CurrencyName = metaModel.DrillDownCurrencyName;
            }

            if (data.DataList.Any())
            {
                SortData(data.DataList, metaModel.SortBy, metaModel.SortOrder);
            }

            var excelModel = new LicenseeWinLossExcelModel
            {
                DataList = data.DataList,
                MetaModel = metaModel,
                SummaryTotal = data.SummaryTotal,
                TotalData = data.TotalDataList,
                SBVisible = IsProductVisible(metaModel.ProductOptions, productAccess, Product.SB),
                BTVisible = IsProductVisible(metaModel.ProductOptions, productAccess, Product.BT),
                COVisible = IsProductVisible(metaModel.ProductOptions, productAccess, Product.CO),
                BAVisible = IsProductVisible(metaModel.ProductOptions, productAccess, Product.BA),
                CustomerCommVisible = licenseeSession.IsAllowedCustomerComm
            };

            var excel = CreateExcel(templatePath, excelModel);

            excel.Export();

            return ExcelStream(excel.Workbook, FileName);
        }

        protected internal virtual LicenseeWinLossExcel CreateExcel(string templatePath, LicenseeWinLossExcelModel excelModel)
        {
            return new LicenseeWinLossExcel(templatePath, excelModel);
        }

        private async Task<SortableReportResultModel<LicenseeWinLoss>> GetData(LicenseeWinLossMetaModel metaModel)
        {
            if (metaModel.IsValid)
            {
                var userCurrencyList = SessionService.UserSession.CurrencyList;
                SortableReportResultModel<LicenseeWinLoss> result = null;
                if (metaModel.DrillDownLevel == 0)
                {
                    result = await _licenseeWinLossDataAccess.GetSummaryWinloss(metaModel, userCurrencyList).ConfigureAwait(false);
                }
                else if (metaModel.LicenseeId != LicenseeIdentity.OneTwoBet || metaModel.DrillDownLevel == (int)ReportLevel.Customer)
                {
                    result = await _licenseeWinLossDataAccess.GetCustomerWinlossDetail(metaModel, userCurrencyList).ConfigureAwait(false);
                }
                else
                {
                    result = await _licenseeWinLossDataAccess.GetAgentWinlossDetail(metaModel, userCurrencyList).ConfigureAwait(false);
                }

                return result;
            }

            return new SortableReportResultModel<LicenseeWinLoss>
            {
                TotalDataList = new List<LicenseeWinLoss>(),
                SummaryTotal = new Dictionary<string, LicenseeWinLoss>(),
                DataList = new SortableList<LicenseeWinLoss>()
            };
        }

        private async Task<dynamic> ProcessRequest(
            LicenseeWinLossMetaModel metaModel,
            DateTime? fdate,
            DateTime? tdate,
            int level = 0,
            int currencyId = 0,
            int custId = 0,
            string currencyName = null)
        {
            metaModel.DrillDownLevel = level;
            metaModel.DrillDownFromDate = fdate.HasValue ? fdate.Value : metaModel.DrillDownFromDate;
            metaModel.DrillDownToDate = tdate.HasValue ? tdate.Value : metaModel.DrillDownToDate;

            if (IsValidParams(metaModel) && IsValidRequest(metaModel.CurrencyId, currencyId))
            {
                metaModel.LicenseeId = SessionService.LicenseeSession.LicenseeId;
                metaModel.DrillDownCurrencyId = currencyId;
                metaModel.DrillDownCurrencyName = currencyName;
                metaModel.DrillDownCustomerId = custId;
                metaModel.AgentListXml = SessionService.GenerateAgentListXml(level == 0 ? metaModel.CurrencyId : currencyId, metaModel.IsExcludedTestData);

                var result = await GetData(metaModel);

                if (metaModel.IsExportExcel)
                {
                    return ExportExcel(metaModel, result);
                }

                if (result.DataList.Any())
                {
                    var summaryTotalView = result.SummaryTotal.ToDictionary(d => d.Key, d => MapToGridView(d.Value));
                    return new
                    {
                        Data = result.DataList.Select(MapToGridView).ToList(),
                        Total = result.TotalDataList.Select(MapToGridView).ToList(),
                        SummaryTotal = summaryTotalView,
                        ProductOptions = metaModel.ProductOptions.ToJson(),
                        PromotionPrize = result.AdditionalInfo
                    };
                }
            }

            return GetEmptyResult(metaModel.ProductOptions);
        }

        protected internal virtual bool IsValidParams(LicenseeWinLossMetaModel metaModel)
        {
            var setting = _reportSettingService.GetSetting(PermissionKeys.ReportLicenseeWinLoss);
            if (setting == null)
            {
                return true;
            }

            var fromDate = metaModel.DrillDownLevel == 0 ? metaModel.FromDate : metaModel.DrillDownFromDate;
            var toDate = metaModel.DrillDownLevel == 0 ? metaModel.ToDate : metaModel.DrillDownToDate;
            return DateTimeHelper.IsBetween(fromDate, setting.MinDate, setting.MaxDate) &&
                DateTimeHelper.IsBetween(toDate, setting.MinDate, setting.MaxDate);
        }
    }
}