namespace Fanex.Athena.Controllers.Report.Result
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using DataAccess.Core.Configuration.Interfaces;
    using Fanex.Athena.Extension.Utility;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Web.ActionFilter;
    using Model.Report.MetaModel;
    using Model.Report.MetaModel.Result;
    using Model.Report.ViewModel.Result;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;

    public class ResultReportController : ReportBaseController
    {
        private const string ResultPageGetNormalSportsName = "ResultPage_GetNormalSports";

        private readonly IBalanceUpDataAccess _balanceUpDataAccess;

        private readonly IBetListApiClient _betListApiClient;

        #region Result-Page

        public ResultReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            IBalanceUpDataAccess balanceUpDataAccess,
            IBetListApiClient betListApiClient)
            : base(languageService, sessionService, appSetting, productService)
        {
            _balanceUpDataAccess = balanceUpDataAccess;
            _betListApiClient = betListApiClient;
        }

        [FunctionAuthorization(Model.Core.DataDomain.PermissionKeys.ReportResults)]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new ResultReportViewModel
            {
                Data = string.Empty,
                Param = new ResultMetaModel
                {
                    FromDate = DateTime.Now,
                    IsOutRight = false,
                    IsExportExcel = false,
                    ToDate = DateTime.Now,
                    BalanceUpDay = _balanceUpDataAccess.GetBalanceUp().BalanceUpDay
                }
            };
            var productAccess = ProductService.GetProductAccess(SessionService.LicenseeSession.LicenseeId, SessionService.UserSession.Language);
            ViewBag.IsAllowedRNG = productAccess.IsAllowCS;
            ViewBag.IsAllowedKeno = productAccess.IsAllowKN;
            ViewBag.IsAllowedLottery = productAccess.IsAllow(Product.LT);
            return View("~/Views/Desktop/Report/Result/Main.cshtml", model);
        }

        [FunctionAuthorization(Model.Core.DataDomain.PermissionKeys.ReportResults)]
        [HttpPost]
        [AjaxRequest]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Index(ResultMetaModel metaModel)
        {
            if (ModelState.IsValid)
            {
                var data = await _betListApiClient.PostAsyncString(
                    "/ResultReport/Index",
                    metaModel,
                    SessionService.UserSession.Language).ConfigureAwait(false);

                return this.Content(data, "text/html");
            }

            return this.Content(string.Empty, "text/html");
        }

        [FunctionAuthorization(Model.Core.DataDomain.PermissionKeys.ReportResults)]
        [HttpGet]
        public async Task<ActionResult> ResultExcel(ResultMetaModel metaModel)
        {
            if (!ModelState.IsValid)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Invalid model state!");
            }

            const string FileName = "LRF-Result.xls";
            metaModel.LicenseeId = SessionService.LicenseeSession.LicenseeId;

            var stream = await _betListApiClient.PostAsyncStream(
                "/ResultReport/ResultExcel",
                metaModel,
                SessionService.UserSession.Language).ConfigureAwait(false);

            return File(stream, "application/vnd.ms-excel", FileName);
        }

        [FunctionAuthorization(Model.Core.DataDomain.PermissionKeys.ReportResults)]
        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> GetSports(GetSportResultMetaModel metaModel)
        {
            if (ModelState.IsValid)
            {
                metaModel.LicenseeId = SessionService.LicenseeSession.LicenseeId;
                var language = SessionService.UserSession.Language;
                var productAccess = ProductService.GetProductAccess(
                   metaModel.LicenseeId,
                   language,
                   ResultPageGetNormalSportsName);
                metaModel.ProductCodeList = string.Join(",", productAccess.ProductList.Select(x => x.ProductCode));
                var result = await _betListApiClient.PostAsyncString(
                    "/ResultReport/GetSports",
                    metaModel,
                    language).ConfigureAwait(false);

                return this.Content(result, "application/json");
            }

            return Json(string.Empty);
        }

        #endregion Result-Page

        #region PopUpPage

        [HttpGet]
        public async Task<ActionResult> ResultPopup(ResultPopupMetalModel metaModel)
        {
            if (ModelState.IsValid)
            {
                var result = await _betListApiClient.PostAsyncString(
                    "/ResultReport/ResultPopup",
                    metaModel,
                    SessionService.UserSession.Language).ConfigureAwait(false);

                ViewBag.Data = result;
                return View("~/Views/Desktop/Report/Result/Popup/Main.cshtml");
            }

            return Redirect("~/Utility/Error?err=400");
        }

        [HttpPost]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> ShowRngCasinoSingleWalletResult(string refNo)
        {
            var result = await _betListApiClient.PostAsyncString(
                "/ResultReport/ShowRngCasinoSingleWalletResult",
                new { refNo },
                SessionService.UserSession.Language).ConfigureAwait(false);

            return this.Content(result, "application/json");
        }

        [HttpGet]
        public async Task<string> VoidbridgeResult(string custId, string gamePlayId)
        {
            var language = SessionService.UserSession.Language;
            var model = new
            {
                custId,
                gamePlayId,
                languageCode = language
            };
            return await _betListApiClient.PostAsyncString(
                "/VoidbridgeResultPopup/Index",
                model,
                language).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<ActionResult> AllBetResult(string transDesc, string betCheck, string betType)
        {
            var language = SessionService.UserSession.Language;
            var model = new
            {
                transDesc,
                betCheck,
                betType,
                languageCode = language
            };
            var data = await _betListApiClient.PostAsyncString("/AllBetResultPopup/Index", model, language).ConfigureAwait(false);
            ViewBag.Data = data.Replace("{rootUrl}", HttpRuntime.AppDomainAppVirtualPath.TrimEnd('/'));
            return View("~/Views/Desktop/Report/Result/Popup/AllBet.cshtml");
        }

        [HttpGet]
        public async Task<string> GlobalGamingResult(string custId, string gameId)
        {
            var model = new
            {
                custId,
                gameId
            };
            return await _betListApiClient.PostAsyncString(
                "/GlobalGamingResultPopup/Index",
                model,
                SessionService.UserSession.Language).ConfigureAwait(false);
        }

        /// <summary>
        /// Generate tennis detailed result.
        /// </summary>
        /// <param name="matchId">The match ID.</param>
        /// /// <param name="sportType">The sport type.</param>
        /// <returns>The html result.</returns>
        [HttpGet]
        public async Task<ActionResult> ResultDetail(int matchId, int sportType)
        {
            var language = SessionService.UserSession.Language;
            var model = new
            {
                matchId,
                sportType,
                languageCode = language
            };
            var result = await _betListApiClient.PostAsyncString("/ResultReport/ResultDetail", model, language).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(result))
            {
                ViewBag.Data = result;

                return View("~/Views/Desktop/Report/Result/Popup/Main.cshtml");
            }

            return this.Redirect("~/Utility/Error?err=400");
        }

        #endregion PopUpPage
    }
}