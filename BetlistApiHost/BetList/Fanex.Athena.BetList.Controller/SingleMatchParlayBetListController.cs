namespace Fanex.Athena.BetList.Controller
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Common.Utility.Services.Interfaces;
    using Fanex.Athena.BetList.Service.Extensions;
    using Fanex.BetList.Core.Builder;
    using Model.MetaModel;
    using Service.Helpers;
    using Service.Interfaces;

    public class SingleMatchParlayBetListController : BaseController
    {
        private readonly ICacheRefAdapter _cacheRefAdapter;

        private readonly IBetListService _betListService;

        private readonly IBetListHTMLBuilder _betlistHtmlBuilder;

        public SingleMatchParlayBetListController(
            ICacheRefAdapter cacheRefAdapter,
            IBetListService betListService,
            IBetListHTMLBuilder betlistHtmlBuilder)
        {
            _cacheRefAdapter = cacheRefAdapter;
            _betListService = betListService;
            _betlistHtmlBuilder = betlistHtmlBuilder;
        }

        [HttpPost]
        public async Task<JsonResult> Detail(SingleMatchParlayDetailMetaModel metaModel)
        {
            var detail = await _betListService.GetSingleMatchParlayDetail(metaModel);

            if (!detail.Any())
            {
                return null;
            }

            var result = new List<string>();
            const string TextRenderTemplate = "<div class='single-match-parlay-selection'><span class='selection'>{0}</span>{1}</div>";
            const string StatusTextTemplate = " - <span class='status'>{0}</span>";

            var selectType = _cacheRefAdapter.GetBetBuilderSelectionNames(detail.Select(x => x.SelectionType).ToArray());

            for (var i = 0; i < selectType.Length; i++)
            {
                var selectionStatus = detail.ElementAtOrDefault(i)?.Result;
                var statusText = string.Empty;
                if (!BetListHelper.IsRunning(metaModel.Status) && !BetListHelper.IsVoid(metaModel.Status) && !string.IsNullOrEmpty(selectionStatus))
                {
                    statusText = string.Format(StatusTextTemplate, _betlistHtmlBuilder.BuildSingleMatchParlaySelectionStatus(selectionStatus));
                }

                result.Add(string.Format(TextRenderTemplate, selectType[i], statusText));
            }

            return Json(result);
        }
    }
}