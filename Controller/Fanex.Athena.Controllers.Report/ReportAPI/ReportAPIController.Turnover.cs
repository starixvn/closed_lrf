// -----------------------------------------------------------------------
// <copyright file="ReportAPIController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.Controllers.Report
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Fanex.Athena.Model.Report.MetaModel;
    using Fanex.Athena.Web.ActionFilter;
    using Model.Core.DataDomain;
    using Model.Core.MetaModel.Product;
    using Resources;

    public partial class ReportAPIController : NonCultureBaseController
    {
        [HttpPost]
        [FunctionAuthorization(PermissionKeys.ReportTurnover)]
        [CustomValidateAntiForgery]
        public async Task<ActionResult> Turnover(TurnoverMetaModel metaModel)
        {
            CheckInvalidProducts(metaModel.ProductOptions);

            var placeholderUsername = _appSettings.FakeLicenseeList.Contains(SessionService.LicenseeSession.LicenseeId) ?
                ViewResources.ExternalId :
                ViewResources.ExternalIdOrSystemId;
            metaModel.AgentListXml = SessionService.GenerateAgentListXml(metaModel.CurrencyId, metaModel.IsExcludeTest);

            metaModel.Username = string.IsNullOrWhiteSpace(metaModel.Username) ||
                metaModel.Username.Trim() == placeholderUsername ? null : metaModel.Username;
            var dataList = await _turnoverService.GetDataList(metaModel).ConfigureAwait(false);

            return Json(new
            {
                TotalData = _turnoverService.SumTotalData(dataList),
                Data = dataList
            });
        }

        private void CheckInvalidProducts(IList<ProductOption> productOption)
        {
            if (!productOption.Any())
            {
                return;
            }

            var validProductAccess = _productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.Turnover,
                true).ProductList;

            var invalidProduct = productOption.Where(x => !validProductAccess.Any(y => y.ProductCode == x.Code))
                .Select(y => y.Code ?? string.Empty).ToList();

            if (invalidProduct.Any())
            {
                throw new ArgumentException($"Invalid product: {string.Join(",", invalidProduct)}");
            }
        }
    }
}