namespace Fanex.Athena.Controllers.Report.Result
{
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Report.DTO.Result;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;
    using Web.ActionFilter;

    [FunctionAuthorization(PermissionKeys.ReportResults)]
    public class ResultKenoReportController : ReportBaseController
    {
        private readonly ICoreLogger _logger;

        private readonly IBetListApiClient _betListApiClient;

        public ResultKenoReportController(
            ILanguageService languageService,
            ISessionService sessionService,
            IAppSettings appSetting,
            IProductService productService,
            ICoreLogger logger,
            IBetListApiClient betListApiClient)
            : base(languageService, sessionService, appSetting, productService)
        {
            _logger = logger;
            _betListApiClient = betListApiClient;
        }

        [HttpGet]
        [AjaxRequest]
        public async Task<ActionResult> Index(int vendorProductId)
        {
            var userSession = SessionService.UserSession;
            var model = new
            {
                vendorProductId,
                UserId = userSession.UserId.ToString()
            };
            var kenoUrl = await _betListApiClient.PostAsyncString(
                "/ResultKenoReport/GetKenoResultUrl",
                model,
                userSession.Language).ConfigureAwait(false);

            return Json(
                new
                {
                    Url = kenoUrl,
                    UserId = userSession.UserId
                },
            JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AjaxRequest]
        [CustomValidateAntiForgery]
        public async Task<string> KeepSession(string userId, int vendorProductId)
        {
            var userSession = SessionService.UserSession;
            if (string.IsNullOrEmpty(userId) || !userSession.UserId.ToString().Equals(userId))
            {
                await _logger.ErrorAsync("Keno Result page just submited invalid userId").ConfigureAwait(false);

                return Url.Action("AccessDenied", "Utility", null, Request.Url.Scheme);
            }

            var model = new
            {
                VendorProductId = vendorProductId,
                UserId = userId
            };

            var result = await _betListApiClient.PostAsync<KenoExtendedToken>(
                "/ResultKenoReport/KeepSession",
                model,
                userSession.Language).ConfigureAwait(false);

            if (result.ErrorCode > 0)
            {
                await _logger.ErrorAsync("Keno Session: " + result.ErrorMsg).ConfigureAwait(false);
                return Url.Action("AccessDenied", "Utility", null, Request.Url.Scheme);
            }

            return string.Empty;
        }
    }
}