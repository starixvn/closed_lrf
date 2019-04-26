namespace Fanex.Athena.Controllers.BetList
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using System.Web.SessionState;
    using DataAccess.Core.Configuration.Interfaces;
    using Excel.Base.Helpers;
    using Extension.Utility;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Service.Core.Common.Interfaces;
    using Model.BetList.MetaModel;
    using Model.Core.DTO.Configuration;
    using ONEbook.UM.Filters;
    using Resources;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility;
    using Service.Core.Utility.Interfaces;
    using VendorAdapter.Interfaces;

    [SessionState(SessionStateBehavior.ReadOnly)]
    [CheckUMFilter]
    public class BetListBaseController : ContentBaseController
    {
        protected const int PageSizeExcel = 63000;

        protected const int ExternalIdColumn = 1;
        protected const int SystemIdColumn = 2;
        protected const int WinLostColumn = 7;
        protected const int BetEffectiveColumn = 8;
        protected const int LicenseeWLColumn = 9;

        protected static readonly int[] HiddenColumnIndexes = new[] { WinLostColumn, BetEffectiveColumn, LicenseeWLColumn };

        private readonly IBalanceUpDataAccess _balanceUpDataAccess;

        private readonly ICacheRefAdapter _cacheRefAdapter;

        private readonly IProductService _productService;

        private readonly IBetListApiClient _betListApiClient;

#pragma warning disable S107 // Methods should not have too many parameters

        public BetListBaseController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess,
            ICacheRefAdapter cacheRefAdapter,
            IBetListApiClient betListApiClient)
#pragma warning restore S107 // Methods should not have too many parameters
        : base(languageService, sessionService, appSetting)
        {
            _productService = productService;
            _balanceUpDataAccess = balanceUpDataAccess;
            _cacheRefAdapter = cacheRefAdapter;
            _betListApiClient = betListApiClient;
        }

        protected IDictionary<int, string> UserCurrencyList => SessionService.UserSession.CurrencyList;

        protected IProductService ProductService
        {
            get { return _productService; }
        }

        protected ICacheRefAdapter CacheRefAdapter
        {
            get { return _cacheRefAdapter; }
        }

        protected IBetListApiClient BetListApiClient
        {
            get { return _betListApiClient; }
        }

        protected static string GetViewInCurrency(BetListMetaModel metaModel)
        {
            return string.Format(
                ViewResources.Viewin,
                metaModel.IsConvert ? metaModel.BaseCurrency.ToUpperInvariant() : metaModel.CurrencyName);
        }

        protected static string GetViewInCurrency(int curencyId, string defaultCurrencyName)
        {
            string viewinCurrency;
            switch (curencyId)
            {
                case BaseCurrencyType.All:
                    viewinCurrency = ViewResources.AllCurrencies;
                    break;

                case BaseCurrencyType.Eur:
                    viewinCurrency = string.Format(ViewResources.Viewin, FormatKey.Eur);
                    break;

                case BaseCurrencyType.Usd:
                    viewinCurrency = string.Format(ViewResources.Viewin, FormatKey.Usd);
                    break;

                case BaseCurrencyType.Gbp:
                    viewinCurrency = string.Format(ViewResources.Viewin, FormatKey.Gbp);
                    break;

                default:
                    viewinCurrency = string.Format(ViewResources.Viewin, defaultCurrencyName);
                    break;
            }

            return viewinCurrency;
        }

        protected static string GetCustomerBetListTitle(BetListMetaModel metaModel, string currencyTitle)
        {
            return ViewResources.Customer + " " + ViewResources.BetList + string.Format(
                 " - {0} --> {1} - {2}{3} - {4}",
                 metaModel.FromDate.ToString(FormatKey.ShortDateFormat),
                 metaModel.ToDate.ToString(FormatKey.ShortDateFormat),
                 metaModel.ExternalId,
                 metaModel.IsFakeLicensee ? string.Empty : $"({metaModel.SystemId})",
                 currencyTitle);
        }

        protected static string GetBetListDetailTitle(string productCode, DateTime date)
        {
            return $"{productCode} - {ViewResources.DetailedBetlist} - {date.ToString("MM/dd/yyyy")}";
        }

        protected BalanceUp GetBalanceUp()
        {
            return _balanceUpDataAccess.GetBalanceUp();
        }

        /// <summary>
        /// Set the Licensee Id, Balance Up Date.
        /// Remove the UTC part of DateTime value.
        /// </summary>
        /// <param name="metaModel">The metal model.</param>
        /// <returns>The bet list metal model.</returns>
        protected BetListMetaModel CreateDefaultMetaModel(BetListMetaModel metaModel = null)
        {
            var licenseeId = SessionService.LicenseeSession.LicenseeId;

            var defaultMetaModel = metaModel ?? new BetListMetaModel();
            defaultMetaModel.LicenseeId = licenseeId;
            defaultMetaModel.UserId = SessionService.UserSession.UserId;
            defaultMetaModel.HasPlayerCom = SessionService.LicenseeSession.IsAllowedCustomerComm;
            defaultMetaModel.FromDate = DateTime.SpecifyKind(defaultMetaModel.FromDate.Date, DateTimeKind.Unspecified);
            defaultMetaModel.ToDate = DateTime.SpecifyKind(defaultMetaModel.ToDate.Date, DateTimeKind.Unspecified);
            defaultMetaModel.Date = DateTime.SpecifyKind(defaultMetaModel.Date.Date, DateTimeKind.Unspecified);
            defaultMetaModel.IsFakeLicensee = IsFakeLicensee(licenseeId);
            defaultMetaModel.CurrencyList = UserCurrencyList;
            defaultMetaModel.AgentListXml = SessionService.GenerateAgentListXml(defaultMetaModel.CurrencyId);

            var balanceUp = GetBalanceUp();
            defaultMetaModel.BalanceUpDay = DateTime.SpecifyKind(balanceUp.BalanceUpDay.Date, DateTimeKind.Unspecified);
            defaultMetaModel.MoveBetsDay = DateTime.SpecifyKind(balanceUp.MoveBetsDay.Date, DateTimeKind.Unspecified);

            return defaultMetaModel;
        }

        protected bool IsValidCurrency(int currencyId)
        {
            return currencyId == BaseCurrencyType.All ||
                KeanOceanBusinessHelper.VerifyKeanOceanCurrencyRequest(
                    SessionService.UserSession.CurrencyList, SessionService.LicenseeSession.LicenseeId, currencyId);
        }

        protected internal virtual FileContentResult EmptyExcel()
        {
            return File(ExcelHelper.ExportEmptyFile(), "application/vnd.ms-excel", "Empty.xls");
        }

        protected virtual Task<ActionResult> ExportExcel(BetListExcelMetaModel metaModel)
        {
            return Task.FromResult<ActionResult>(null);
        }

        protected virtual bool IsValidExportExcel(BetListMetaModel model)
        {
            return IsValidCurrency(model.CurrencyId);
        }

        protected internal virtual async Task<ActionResult> ProcessExportExcel(
            BetListExcelMetaModel metaModel,
            string fileName,
            string apiPath = null)
        {
            var stream = await _betListApiClient.PostAsyncStream(apiPath ?? "/BetList/ExportExcel", metaModel, SessionService.UserSession.Language).ConfigureAwait(false);
            return File(stream, "application/vnd.ms-excel", fileName + ".xls");
        }

        protected async Task<ActionResult> ProcessDefaultRequest(BetListExcelMetaModel model, string viewPath, string uspKey)
        {
            if (!model.IsExportExcel)
            {
                return View(viewPath, model);
            }

            if (IsValidExportExcel(model))
            {
                model.UspKey = uspKey;
                return await ExportExcel(model).ConfigureAwait(false);
            }

            return EmptyExcel();
        }
    }
}