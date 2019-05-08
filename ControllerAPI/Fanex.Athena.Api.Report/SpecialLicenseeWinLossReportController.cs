namespace Fanex.Athena.Api.Report
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base.Attributes;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Fanex.Athena.Extension.Helper;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Model.Report.ViewModel;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using Model.Report.DTO;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportLicenseeWinLoss)]
    public class SpecialLicenseeWinLossReportController : ApiReportBaseController
    {
        private readonly IReportSettingService _reportSettingService;

        private readonly ISpecialLicenseeWinLossDataAccess _licenseeWinLossDataAccess;

        private readonly IDictionary<int, string> _siteNameList = new Dictionary<int, string>
        {
            { LicenseeIdentity.IvoryBet, "ivorysport" },
            { LicenseeIdentity.Opal88, "opal88" }
        };

        public SpecialLicenseeWinLossReportController(
            ISessionService sessionService,
            IProductService productService,
            IReportSettingService reportSettingService,
            ILanguageService langService,
            ISpecialLicenseeWinLossDataAccess licenseeWinLossDataAccess)
            : base(sessionService, productService, langService)
        {
            _reportSettingService = reportSettingService;
            _licenseeWinLossDataAccess = licenseeWinLossDataAccess;
        }

        [HttpPost]
        public Task<dynamic> Index(SpecialLicenseeWinLossMetaModel metaModel)
        {
            return ProcessRequest(metaModel);
        }

        private static SpecialLicenseeWinLossGridViewModel MapToGridView(LicenseeWinLoss item)
        {
            var licenseeWinLossGrid = new SpecialLicenseeWinLossGridViewModel
            {
                CurrencyId = item.CurrencyId,
                CurrencyName = item.CurrencyName,
                CustomerWinLoss = item.CustomerWinLoss,
                TotalTransaction = item.TotalTransaction,
                Date = item.Date
            };
            SetLicenseeWinLossProductData(licenseeWinLossGrid, item.LicenseeWL);
            SetTurnOverProductData(licenseeWinLossGrid, item.TurnOver);

            return licenseeWinLossGrid;
        }

        private static void SetLicenseeWinLossProductData(SpecialLicenseeWinLossGridViewModel licenseeWinLoss, IDictionary<string, decimal> licenseeWLProducts)
        {
            licenseeWinLoss.LicenseeWLSB = licenseeWLProducts.GetValueOrDefault(Product.SB, 0);
            licenseeWinLoss.LicenseeWLNG = licenseeWLProducts.GetValueOrDefault(Product.NG, 0);
        }

        private static void SetTurnOverProductData(SpecialLicenseeWinLossGridViewModel licenseeWinLoss, IDictionary<string, decimal> turnOverProducts)
        {
            licenseeWinLoss.TurnOverSB = turnOverProducts.GetValueOrDefault(Product.SB, 0);
            licenseeWinLoss.TurnOverNG = turnOverProducts.GetValueOrDefault(Product.NG, 0);
        }

        private static bool IsValidDateRange(SpecialLicenseeWinLossMetaModel metaModel, ReportSetting setting)
        {
            return setting != null && metaModel.FromDate <= metaModel.ToDate &&
                DateTimeHelper.IsBetween(metaModel.FromDate, setting.MinDate, setting.MaxDate) &&
                DateTimeHelper.IsBetween(metaModel.ToDate, setting.MinDate, setting.MaxDate);
        }

        private async Task<dynamic> ProcessRequest(SpecialLicenseeWinLossMetaModel metaModel)
        {
            var setting = _reportSettingService.GetSetting(PermissionKeys.ReportLicenseeWinLoss);

            if (IsValidParams(metaModel, setting))
            {
                metaModel.BaseCurrencies = string.IsNullOrWhiteSpace(setting.BaseCurrencies)
                    ? SystemConstants.BaseCurrencyList.ToArray()
                    : setting.BaseCurrencies.Split(',').Intersect(SystemConstants.BaseCurrencyList).ToArray();
                metaModel.SiteName = _siteNameList[SessionService.LicenseeSession.LicenseeId];
                metaModel.CurrencyListXml = GenerateCurrencyListXml(metaModel);

                var result = await _licenseeWinLossDataAccess.GetData(metaModel, SessionService.UserSession.CurrencyList);

                if (result.DataList.Any())
                {
                    var summaryTotalView = result.SummaryTotal.ToDictionary(d => d.Key, d => MapToGridView(d.Value));
                    return new
                    {
                        Data = result.DataList.Select(MapToGridView).ToList(),
                        Total = result.TotalDataList.Select(MapToGridView).ToList(),
                        SummaryTotal = summaryTotalView
                    };
                }
            }

            return new
            {
                Data = new List<SpecialLicenseeWinLossGridViewModel>(),
                Total = new List<SpecialLicenseeWinLossGridViewModel>(),
                SummaryTotal = new Dictionary<string, SpecialLicenseeWinLossGridViewModel>()
            };
        }

        private string GenerateCurrencyListXml(SpecialLicenseeWinLossMetaModel metaModel)
        {
            var currencyList = SessionService.UserSession.CurrencyList
               .Where(i => i.Key == metaModel.CurrencyId || metaModel.CurrencyId <= 0)
               .Select(i => $"<CR Id=\"{i.Key}\" Code=\"{i.Value}\" />").ToArray();

            return $"<ROOT>{string.Join("", currencyList)}</ROOT>";
        }

        protected internal virtual bool IsValidParams(SpecialLicenseeWinLossMetaModel metaModel, ReportSetting setting)
        {
            return IsValidDateRange(metaModel, setting) &&
                IsValidProduct(metaModel) && 
                IsValidCurrency(metaModel);
        }

        private bool IsValidCurrency(SpecialLicenseeWinLossMetaModel metaModel)
        {
            return metaModel.CurrencyId <= 0
                || SessionService.UserSession.CurrencyList.ContainsKey(metaModel.CurrencyId);
        }

        private bool IsValidProduct(SpecialLicenseeWinLossMetaModel metaModel)
        {
            if (metaModel.ProductCodeList == null)
            {
                return false;
            }

            var productAccess = this.ProductService.GetProductAccess(
               SessionService.LicenseeSession.LicenseeId,
               SessionService.UserSession.Language,
               FunctionNames.LicenseeWinLoss,
               true);
            var productList = productAccess.ProductList.Select(x => x.ProductCode);

            return productList.Intersect(metaModel.ProductCodeList).Count() == metaModel.ProductCodeList.Count();
        }
    }
}