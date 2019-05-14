namespace Fanex.Athena.Api.ExternalService
{
    using System;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using Base.Attributes;
    using Extension.Utility;
    using Fanex.Athena.Api.Base;
    using Model.Report.MetaModel;
    using Service.Core.Configuration.Interfaces;
    using Service.Report.Interfaces;

    public class NotificationApiController : ExternalApiBaseController
    {
        private const int DefaultPageSize = 10;

        private readonly IMoveBetService _moveBetService;
        private readonly ILicenseeSettingService _licenseeSettingService;

        private readonly INotificationService _notificationService;
        private readonly IAppSettings _appSettings;

        public NotificationApiController(
            IMoveBetService moveBetService,
            INotificationService notificationService,
            IAppSettings appSettings,
            ILicenseeSettingService licenseeSettingService)
        {
            _moveBetService = moveBetService;
            _notificationService = notificationService;
            _appSettings = appSettings;
            _licenseeSettingService = licenseeSettingService;
        }


        [HttpGet]
        public async Task<string> Index()
        {
            var isEnabledMoveBetNotification = _appSettings.IsEnabledMoveBetNotification && !_licenseeSettingService.IsFakeLicensee(SiteName);

            if (!isEnabledMoveBetNotification)
            {
                return string.Empty;
            }

            var langCode = Util.MapIetfLanguageCodes.GetValueOrDefault(Language, string.Empty);

            return await _moveBetService.GetMoveBetNotificationAsync(langCode).ConfigureAwait(false);
        }

        [HttpGet]
        public dynamic GetNotificationMessages([FromUri]NotificationMetaModel metaModel)
        {
            var maximumMonthDistance = NotificationMetaModel.MaximumMonthRange - 1;

            var today = DateTime.Today;
            metaModel.IsOnlyUnread = true;
            metaModel.FromDate = new DateTime(today.Year, today.Month, 1).AddMonths(-maximumMonthDistance);
            metaModel.ToDate = today.AddDays(1).AddMilliseconds(-1);
            metaModel.PageSize = DefaultPageSize;
            metaModel.PageIndex = 1;
            metaModel.UserName = UserName;
            metaModel.LicenseeName = SiteName;

            return _notificationService.GetNotificationMessages(metaModel);
        }

        [HttpPost]
        public dynamic MarkNotificationAsRead(NotificationMarkAsReadMetaModel metaModel)
        {
            metaModel.UserName = UserName;
            metaModel.LicenseeName = SiteName;

            var result = _notificationService.MarkNotificationAsRead(metaModel);

            return new
            {
                Code = result.Code,
                Message = result.Message,
                IsSuccessful = result.IsSuccessful
            };
        }
    }
}