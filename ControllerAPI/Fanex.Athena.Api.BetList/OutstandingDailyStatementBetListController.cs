// --------------------------------------------------------------------------
// <copyright file="OutstandingDailyStatementBetListController.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.Api.BetList
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base;
    using Base.Attributes;
    using Fanex.Athena.Service.StatelessCore.Interfaces;
    using Model.BetList.DTO;
    using Model.BetList.MetaModel;
    using Model.Core.DataDomain;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Core.Utility.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.CustomerInfoCustomerList)]
    public class OutstandingDailyStatementBetListController : BaseApiController
    {
        private readonly IBetListApiClient _betListApiClient;

        private readonly IAuthorizationService _authorizationService;

        public OutstandingDailyStatementBetListController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService languageService,
            IBetListApiClient betListApiClient,
            IAuthorizationService authorizationService)
        : base(sessionService, productService, languageService)
        {
            _betListApiClient = betListApiClient;
            _authorizationService = authorizationService;
        }

        [HttpPost]
        public async Task<dynamic> Index(BetListMetaModel metaModel)
        {
            var licenseeSession = SessionService.LicenseeSession;
            var userSession = SessionService.UserSession;
            metaModel.UserId = userSession.UserId;
            metaModel.LicenseeId = licenseeSession.LicenseeId;
            metaModel.ToDate = metaModel.ToDate.Date.AddDays(1).AddMinutes(-1);
            metaModel.HasPlayerCom = licenseeSession.IsAllowedCustomerComm;
            if (_authorizationService.HasPermissionOnData(metaModel.LicenseeId, metaModel.CustId, metaModel.TransId))
            {
                return await _betListApiClient.PostAsync(
                    "/OutstandingDailyStatementBetList/GetData",
                    metaModel,
                    userSession.Language).ConfigureAwait(false);
            }

            return new List<DailyStatement>();
        }
    }
}