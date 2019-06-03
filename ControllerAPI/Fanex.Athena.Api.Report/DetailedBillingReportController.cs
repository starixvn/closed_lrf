namespace Fanex.Athena.Api.Report
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Base;
    using Base.Attributes;
    using Constant.DataDomain;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ResultModel;
    using Model.Report.ViewModel;
    using Resources;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;

    [ApiFunctionAuthorization(PermissionKeys.ReportDetailedBilling)]
    public class DetailedBillingReportController : BaseApiController
    {
        private readonly IDetailedBillingDataAccess _dataAccess;

        private readonly IAppSettings _appSetting;

        public DetailedBillingReportController(
            ISessionService sessionService,
            IProductService productService,
            ILanguageService langService,
            IDetailedBillingDataAccess dataAccess,
            IAppSettings appSetting)
            : base(sessionService, productService, langService)
        {
            _dataAccess = dataAccess;
            _appSetting = appSetting;
        }

        [HttpPost]
        public async Task<dynamic> GetData(DetailedBillingMetaModel metaModel)
        {
            if (!IsValidRequest(metaModel))
            {
                return new
                {
                    Data = Enumerable.Empty<DetailedBilling>()
                };
            }

            metaModel.Environment = _appSetting.Environment;
            metaModel.LicenseeId = SessionService.LicenseeSession.LicenseeId;

            var result = await _dataAccess.GetData(metaModel, SessionService.UserSession.CurrencyList);

            return new
            {
                Data = result.Data,
                Exchange = result.Exchange,
                Summary = BuildSummaryData(result)
            };
        }

        private static bool IsValidRequest(DetailedBillingMetaModel metaModel)
        {
            return metaModel.FromDate <= metaModel.ToDate;
        }

        private static string GetInvoiceTypeName(int typeId, IEnumerable<SummaryDetailedBilling> data)
        {
            if (typeId == InvoiceItemType.Discount)
            {
                return string.Format(ViewResources.LessDiscountForProduct, string.Join(",", data.Select(i => i.Product)));
            }

            if (typeId == InvoiceItemType.DeductAMF)
            {
                return ViewResources.DeductAMF;
            }

            if (typeId == InvoiceItemType.DeductAGP)
            {
                return ViewResources.DeductAGP;
            }

            return string.Empty;
        }

        private IList<SummaryDetailedBillingViewModel> BuildSummaryData(DetailedBillingResultModel result)
        {
            var summary = new List<SummaryDetailedBillingViewModel>();

            summary.Add(new SummaryDetailedBillingViewModel { Description = ViewResources.SubTotal, Amount = result.SubTotal });

            summary.AddRange(
                result.Summary.GroupBy(x => x.InvoiceItemTypeId).Select(g => new SummaryDetailedBillingViewModel
                {
                    Description = GetInvoiceTypeName(g.Key, g.AsEnumerable()),
                    Amount = g.Sum(i => i.Amount)
                }));

            summary.Add(new SummaryDetailedBillingViewModel { Description = ViewResources.Total, Amount = result.Total });

            return summary;
        }
    }
}