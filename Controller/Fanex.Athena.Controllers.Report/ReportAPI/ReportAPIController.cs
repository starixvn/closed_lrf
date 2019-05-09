// -----------------------------------------------------------------------
// <copyright file="ReportAPIController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Controllers.Report
{
    using Extension.Utility;
    using Fanex.Athena.Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Service.Report.Interfaces;

    public partial class ReportAPIController : NonCultureBaseController
    {
        private readonly IBetTypeService _betTypeService;

        private readonly IAppSettings _appSettings;

        private readonly ICustomerTurnoverService _customerTurnoverService;

        private readonly ITurnoverService _turnoverService;

        private readonly IProductService _productService;

        public ReportAPIController(
            ISessionService sessionService,
            IAppSettings appSettings,
            IBetTypeService betTypeService,
            ICustomerTurnoverService customerTurnoverService,
            ITurnoverService turnoverService,
            IProductService productService)
            : base(sessionService)
        {
            _betTypeService = betTypeService;
            _appSettings = appSettings;
            _customerTurnoverService = customerTurnoverService;
            _turnoverService = turnoverService;
            _productService = productService;
        }
    }
}