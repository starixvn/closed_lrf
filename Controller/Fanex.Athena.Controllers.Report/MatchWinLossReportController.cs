namespace Fanex.Athena.Controllers.Report
{
    using System.Collections.Generic;
    using System.Data;
    using System.Globalization;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Constant.DataDomain;
    using Constant.Helper;
    using DataAccess.Core.Configuration.Interfaces;
    using Excel.Base.Helpers;
    using Extension.Utility;
    using Fanex.Athena.Excel.Base.Entities;
    using Fanex.Athena.Excel.Report;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Model.Core.Helper;
    using Fanex.Athena.Model.Report.DTO;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Fanex.Athena.Web.ActionFilter;
    using Fanex.Athena.Web.ResultExtension;
    using Fanex.Common;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Report.Interfaces;
    using VendorAdapter.Interfaces;

    [FunctionAuthorization(PermissionKeys.ReportMatchWinLoss)]
    public class MatchWinLossReportController : ReportBaseController
    {
        private const string NewProductIdColumnName = "newproductid";

        private const string MatchNameColumn = "matchname";

        private static readonly IList<int> VirtualHrBettypes = new List<int> { 1231, 1232, 1233, 1237, 1238 };
        private readonly IBalanceUpDataAccess _balanceUpDataAccess;
        private readonly ICacheRefAdapter _cacheRefAdapter;
        private readonly IMatchWinLossService _matchWinLossService;

#pragma warning disable S107 // Methods should not have too many parameters

        public MatchWinLossReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess,
            ICacheRefAdapter cacheRefAdapter,
            IMatchWinLossService matchWinLossService)
#pragma warning restore S107 // Methods should not have too many parameters
            : base(languageService, sessionService, appSetting, productService)
        {
            _balanceUpDataAccess = balanceUpDataAccess;
            _cacheRefAdapter = cacheRefAdapter;
            _matchWinLossService = matchWinLossService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            var metaModel = new MatchWinLossMetaModel
            {
                BalanceUpDay = _balanceUpDataAccess.GetBalanceUp().BalanceUpDay.ToShortDateString(),
                LicenseeId = licenseeSession.LicenseeId
            };

            SetConvetedUSDCurrencyName(metaModel);

            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId,
                userSession.Language,
                FunctionNames.MatchWinLoss,
                true);
            metaModel.ProductOptions = ToProductOptions(productAccess.ProductList);

            var model = new MatchWinLossViewModel
            {
                ShowEmptyContent = true,
                Param = metaModel,
                CurrencyList = userSession.CurrencyList,
                ProductAccess = productAccess,
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };

            return View("~/Views/Desktop/Report/MatchWinLoss/Main.cshtml", model);
        }

        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Index(MatchWinLossMetaModel metaModel)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            var currencies = userSession.CurrencyList;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            if (metaModel.IsExportExcel)
            {
                if (metaModel.CurrencyId == BaseCurrencyType.All || currencies.ContainsKey(metaModel.CurrencyId))
                {
                    return await Excel(metaModel).ConfigureAwait(false);
                }

                return File(ExcelHelper.ExportEmptyFile(), "application/vnd.ms-excel", "Empty.xls");
            }

            var reportData = await _matchWinLossService.GetDataList(metaModel);
            var reportDataOutrightParlay = new List<MatchWinLoss>();

            if (metaModel.ProductOptions.Any(i => i.Status && (i.Code == Product.BA || i.Code == Product.SB || i.Code == Product.VS2)))
            {
                reportDataOutrightParlay = (await _matchWinLossService.GetOutrightParlayList(metaModel)).ToList();
            }

            var total = GetTotal(reportData);
            var grandTotal = GetGrandTotal(reportDataOutrightParlay, total);
            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId, 
                userSession.Language, 
                FunctionNames.MatchWinLoss,
                true);
            var model = new MatchWinLossViewModel
            {
                Param = metaModel,
                MainResult = reportData,
                LeagueList = CreateLeagueList(reportData),
                SpecialBetTypeResult = reportDataOutrightParlay,
                CurrencyList = currencies,
                ProductAccess = productAccess,
                ColumnCount = GetColumnCount(productAccess, licenseeSession.IsAllowedCustomerComm),
                Total = total,
                GrandTotal = grandTotal,
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };
            return View("~/Views/Desktop/Report/MatchWinLoss/Main.cshtml", model);
        }

        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Detail(MatchWinLossMetaModel metaModel)
        {
            var licenseeSession = SessionService.LicenseeSession;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            var reportData = await _matchWinLossService.GetDetailDataList(metaModel);
            var model = new MatchWinLossViewModel
            {
                MainResult = reportData,
                ProductAccess = ProductService.GetProductAccess(
                    licenseeSession.LicenseeId, 
                    SessionService.UserSession.Language, 
                    FunctionNames.MatchWinLoss,
                    true),
                IsAllowedCustomerCommission = licenseeSession.IsAllowedCustomerComm
            };

            return View("~/Views/Desktop/Report/MatchWinLoss/Content.data.Detail.cshtml", model);
        }

        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Excel(MatchWinLossMetaModel metaModel)
        {
            const int PageSize = 63000;
            const string FileName = nameof(MatchWinLoss);

            var licenseeSession = SessionService.LicenseeSession;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId);
            var templatePath = HostingEnvironment.MapPath(@"~/App_Data/Template/Reports/MatchWinLoss.xls");
            var productAccess = ProductService.GetProductAccess(
                licenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.MatchWinLoss,
                true);
            var showingOption = new ShowingOption
            {
                BAVisible = productAccess.IsAllowBA,
                NGVisible = productAccess.IsAllowNG,
                SBVisible = productAccess.IsAllowSB,
                VSVisible = productAccess.IsAllowVS,
                KNVisible = productAccess.IsAllowKN,
                CustomerCommVisible = licenseeSession.IsAllowedCustomerComm
            };
            var convertingOption = new ConvertingOption
            {
                IsConvert = metaModel.IsConvert,
                BaseCurrency = metaModel.BaseCurrency,
                CurrencyName = metaModel.CurrencyName
            };

            metaModel.PageSize = PageSize;
            var reportData = await _matchWinLossService.GetDetailDataSet(metaModel).ConfigureAwait(false);
            var mainTable = reportData.Tables[0];
            mainTable = AddColumnsForSorting(mainTable);
            mainTable.DefaultView.Sort = $"{NewProductIdColumnName} asc, leaguename asc, matchname ASC";
            mainTable = mainTable.DefaultView.ToTable();
            var excel = CreateExcel(templatePath, metaModel, showingOption, convertingOption, mainTable, reportData.Tables[1]);

            excel.Export();

            return new ExcelResult(excel.Workbook, FileName);
        }

        protected internal virtual MatchWinLossExcel CreateExcel(
            string templatePath,
            MatchWinLossMetaModel metaModel,
            ShowingOption showingOption,
            ConvertingOption convertingOption,
            DataTable mainTable,
            DataTable totalData)
        {
            return new MatchWinLossExcel(templatePath, convertingOption, showingOption, mainTable, totalData, metaModel);
        }

        private static IDictionary<int, string> CreateLeagueList(IList<MatchWinLoss> reportData)
        {
            if (reportData == null || reportData.Count == 0)
            {
                return new Dictionary<int, string>();
            }

            return reportData.GroupBy(i => i.LeagueId).ToDictionary(i => i.Key, i => i.FirstOrDefault().LeagueName);
        }

        private static MatchWinLoss GetTotal(IList<MatchWinLoss> dataList)
        {
            var totalMatchWinLoss = new MatchWinLoss
            {
                Turnover = dataList.Sum(item => item.Turnover),
                TotalTransaction = dataList.Sum(item => item.TotalTransaction),
                CustomerWL = dataList.Sum(item => item.CustomerWL),
                CustomerComm = dataList.Sum(item => item.CustomerComm),
                LicenseeWL = dataList.Sum(item => item.LicenseeWL),
                BACommission = dataList.Sum(item => item.BACommission),
                AmtDueToBA = dataList.Sum(item => item.AmtDueToBA)
            };

            return totalMatchWinLoss;
        }

        private static MatchWinLoss GetGrandTotal(IList<MatchWinLoss> dataListOutright, MatchWinLoss total)
        {
            return new MatchWinLoss
            {
                Turnover = dataListOutright.Sum(item => item.Turnover) + total.Turnover,
                TotalTransaction = dataListOutright.Sum(item => item.TotalTransaction) + total.TotalTransaction,
                CustomerWL = dataListOutright.Sum(item => item.CustomerWL) + total.CustomerWL,
                CustomerComm = dataListOutright.Sum(item => item.CustomerComm) + total.CustomerComm,
                LicenseeWL = dataListOutright.Sum(item => item.LicenseeWL) + total.LicenseeWL,
                BACommission = dataListOutright.Sum(item => item.BACommission) + total.BACommission,
                AmtDueToBA = dataListOutright.Sum(item => item.AmtDueToBA) + total.AmtDueToBA
            };
        }

        private static int GetColumnCount(ProductAccess productAccess, bool isAllowedCustomerComm)
        {
            const int AdditionColumns = 2;
            var columnCount = 6;

            if (productAccess.IsAllowBA)
            {
                columnCount += AdditionColumns;
            }

            if (isAllowedCustomerComm)
            {
                columnCount += AdditionColumns;
            }

            return columnCount;
        }

        private DataTable AddColumnsForSorting(DataTable mainTable)
        {
            mainTable.Columns.Add(NewProductIdColumnName, typeof(int));
            mainTable.Columns.Add(MatchNameColumn, typeof(string));
            mainTable.Columns.Add("leaguename", typeof(string));

            foreach (DataRow row in mainTable.Rows)
            {
                var betType = Converter.ToInt(row["bettype"]);
                row[NewProductIdColumnName] = ProductHelper.GetProductId(betType);

                AssignMatchName(row, betType);

                AssignLeagueName(row);
            }

            return mainTable;
        }

        protected internal virtual void AssignMatchName(DataRow row, int betType)
        {
            if ((int)row[NewProductIdColumnName] == ProductTypes.NumberGame)
            {
                var prefix = BetTypeHelper.IsNumberGameHappy5(betType) ? ViewResources.No + "." : ViewResources.NumberGameNo;
                row[MatchNameColumn] = string.Format("{0} {1}", prefix, row["matchcode"]);
            }
            else
            {
                if (VirtualHrBettypes.Contains(betType))
                {
                    var culture = new CultureInfo("en-US");
                    const string TimeFormatter = "{0:MM/dd/yyyy hh:mm:ss tt}";
                    var kickOffTime = Converter.ToDateTime(row["KickoffTime"]);
                    row[MatchNameColumn] = string.Format(culture, TimeFormatter, kickOffTime);
                }
                else
                {
                    var homeName = _cacheRefAdapter.GetTeamName(row["homeid"]) +
                                   (Converter.ToBool(row["isneutral"])
                                        ? " " + ViewResources.IsNeutral
                                        : string.Empty);
                    var awayName = _cacheRefAdapter.GetTeamName(row["awayid"]);
                    row[MatchNameColumn] = homeName + "-vs-" + awayName;
                }
            }
        }

        protected internal virtual void AssignLeagueName(DataRow row)
        {
            row["leaguename"] = (int)row[NewProductIdColumnName] == ProductTypes.NumberGame ?
                        ViewResources.ProductNG :
                        _cacheRefAdapter.GetLeagueName(row["leagueid"]);
        }
    }
}