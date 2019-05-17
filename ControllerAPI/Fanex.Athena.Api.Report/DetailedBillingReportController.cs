namespace Fanex.Athena.Api.Report
{
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base.Attributes;
    using DataAccess.Report.Interfaces;
    using Model.Core.DataDomain;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportDetailedBilling)]
    public class DetailedBillingReportController : ApiReportBaseController
    {
        private readonly IDetailedBillingDataAccess _dataAccess;

        public DetailedBillingReportController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService langService,
            IDetailedBillingDataAccess dataAccess)
            : base(sessionService, productService, langService)
        {
            _dataAccess = dataAccess;
        }

        [HttpPost]
        public dynamic GetData(DetailedBillingMetaModel metaModel)
        {
            return _dataAccess.GetData(metaModel);
        }
    }
}