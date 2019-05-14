namespace Fanex.Athena.Result.Controller
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Common.Model.DTO;
    using Common.Utility.Services.Interfaces;
    using Fanex.Result.Core.Base;
    using Fanex.Result.Core.Sportsbook.DTO;
    using Model.MetaModel;
    using Resources;
    using Service.Interfaces;

    public class ResultReportController : BaseResultController
    {
        private const string ResultExcelTemplateAddress = "~/App_Data/Fanex.Result/";

        private const int ParlayBetType = 9;
        private const int SystemParlayBetType = 29;

        private static readonly IEnumerable<SportType> ShowingMatchCodeSportTypes = new[]
        {
            SportType.GoldDeluxe,
            SportType.HorseRacing,
            SportType.Greyhound,
            SportType.Harness,
            SportType.VirtualHorseRacing,
            SportType.VirtualGreyhounds,
            SportType.VirtualSpeedway,
            SportType.VirtualMotorRacing,
            SportType.VirtualCycling
        };

        private readonly IResultService _resultService;

        private readonly IRNGCasinoSingleWalletService _rngCasinoSingleWalletService;

        private readonly ICacheRefAdapter _cacheRefAdapter;

        private string _htmlResult;
        private MemoryStream _excelStream;

        #region Result-Page

        public ResultReportController(
            IResultService resultService,
            IRNGCasinoSingleWalletService rngCasinoSingleWalletService,
            ICacheRefAdapter cacheRefAdapter)
        {
            _resultService = resultService;
            _rngCasinoSingleWalletService = rngCasinoSingleWalletService;
            _cacheRefAdapter = cacheRefAdapter;
        }

        [HttpPost]
        public async Task<string> Index(ResultMetaModel metalModel)
        {
            metalModel.IsExportExcel = false;
            await this.GetData(metalModel).ConfigureAwait(false);
            return _htmlResult;
        }

        [HttpPost]
        public async Task ResultExcel(ResultMetaModel metalModel)
        {
            var response = ControllerContext.HttpContext.Response;

            if (ModelState.IsValid)
            {
                metalModel.IsExportExcel = true;
                metalModel.SportId = metalModel.SportId == 0 ?
                    await GetSportId(metalModel.FromDate, metalModel.LicenseeId).ConfigureAwait(false) :
                    metalModel.SportId;

                if (metalModel.SportId > 0)
                {
                    await GetData(metalModel).ConfigureAwait(false);
                }

                if (_excelStream == null)
                {
                    _excelStream = ExportNoneData(metalModel);
                }

                _excelStream.WriteTo(response.OutputStream);
            }
            else
            {
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.StatusDescription = ViewResources.InvalidParams;
            }

            response.Flush();
        }

        [HttpPost]
        public async Task<ActionResult> GetSports(GetSportResultMetaModel metalModel)
        {
            if (metalModel.IsOutRight)
            {
                return await GetOutRightSports(metalModel).ConfigureAwait(false);
            }

            return metalModel.SportId == 0 ?
                await GetNormalSports(metalModel).ConfigureAwait(false) :
                Json(new { Leagues = await _resultService.GetLeagues(metalModel.FromDate, metalModel.SportId).ConfigureAwait(false) });
        }

        #endregion Result-Page

        #region PopUpPage

        [HttpPost]
        public async Task<string> ResultPopup(ResultPopupMetaModel metalModel)
        {
            await GetPopUpData(metalModel).ConfigureAwait(false);
            return _htmlResult;
        }

        [HttpPost]
        public ActionResult ShowRngCasinoSingleWalletResult(string refNo)
        {
            var resultInfo = _rngCasinoSingleWalletService.GetResultInfo(refNo);

            return Json(resultInfo);
        }

        /// <summary>
        /// Generate tennis detailed result.
        /// </summary>
        /// <param name="matchId">The match ID.</param>
        /// /// <param name="sportType">The sport type.</param>
        /// <returns>The html result.</returns>
        [HttpPost]
        public async Task<string> ResultDetail(int matchId, int sportType, string languageCode)
        {
            var detailedData = await _resultService.GetSportsbookGameDetail(matchId).ConfigureAwait(false);
            if (detailedData != null && detailedData.MatchId > 0)
            {
                return _resultService.HtmlGameDetailParser(
                detailedData,
                new ResultSetting
                {
                    SportType = (SportType)sportType,
                    LanguageCode = languageCode
                });
            }

            return string.Empty;
        }

        #endregion PopUpPage

        #region Utilities

        private static string GenerateOutRightCacheKey(ResultMetaModel metalModel)
        {
            const string PatternKey = "{0}{1}Result.OutRight.Data_{2}";
            return string.Format(PatternKey, metalModel.FromDate, metalModel.ToDate, metalModel.UserId);
        }

        #region popup-page

        private static bool IsPalayBetType(int betType)
        {
            return betType == ParlayBetType
                || betType == SystemParlayBetType
                || betType == (int)Common.Constant.BetType.VirtualSports2MixParlay;
        }

        private static IEnumerable<Sport> RemoveNotAllowedSports(IEnumerable<Sport> sports, IEnumerable<string> productCodes)
        {
            var limitedSports = sports;
            if (!productCodes.Contains(Common.Constant.ProductCodes.NG))
            {
                limitedSports = limitedSports.Where(i => i.SportId != (int)SportType.NumberGame && i.SportId != (int)SportType.Happy5);
            }

            if (!productCodes.Contains(Common.Constant.ProductCodes.VS))
            {
                limitedSports = limitedSports.Where(i => i.SportId != (int)SportType.VirtualSports);
            }

            return limitedSports;
        }

        private static bool IsVirtualSport(SportType type)
        {
            var isVirtualRacing = type == SportType.VirtualMotorRacing || type == SportType.VirtualHorseRacing;

            return isVirtualRacing
                || type == SportType.VirtualGreyhounds
                || type == SportType.VirtualCycling
                || type == SportType.VirtualSpeedway;
        }

        /// <summary>
        /// Get data for pop-up page.
        /// </summary>
        /// <param name="metalModel">The metal model.</param>
        private async Task GetPopUpData(ResultPopupMetaModel metalModel)
        {
            var sportType = (SportType)metalModel.SportType;
            var setting = new ResultSetting
            {
                SportType = sportType,
                IsOutright = metalModel.IsOutRight.HasValue && metalModel.IsOutRight.Value > 0,
                IsParlayPopUp = IsPalayBetType(metalModel.Bettype),
                IsPopUp = true,
                LanguageCode = LanguageCode,
                EnableCheckScoreCalculated = true
            };

            if (setting.IsParlayPopUp)
            {
                if (metalModel.RefNo != null)
                {
                    var parlayData = await _resultService.GetPopUpParlayMatch(metalModel.RefNo.Value).ConfigureAwait(false);
                    _htmlResult = _resultService.HtmlParser(parlayData, setting);
                }
            }
            else if (metalModel.Bettype == (int)Common.Constant.BetType.SingleMatchParlay)
            {
                var singleMatchParlayData = await _resultService.GetPopUpSingleMatchParlay(metalModel.MatchId, metalModel.BetId?.ToString()).ConfigureAwait(false);
                if (singleMatchParlayData != null)
                {
                    setting.IsPopupOpenFromBetList = true;
                    _htmlResult = _resultService.HtmlParser(new List<Sportsbook> { singleMatchParlayData }, setting);
                }
            }
            else
            {
                await GetNormalPopUpData(metalModel, sportType, setting).ConfigureAwait(false);
            }
        }

        private async Task GetVirtualSportPopUpData(ResultPopupMetaModel metalModel, ResultSetting setting)
        {
            if (metalModel.RaceNo != null)
            {
                var dataRc = await _resultService.GetPopUpVirtualSportMatch(metalModel).ConfigureAwait(false);
                if (dataRc != null)
                {
                    this._htmlResult = _resultService.HtmlParser(dataRc, setting);
                }
            }
        }

        private async Task GetNumberGamePopUpData(ResultPopupMetaModel metalModel, ResultSetting setting)
        {
            var dataNg = await _resultService.GetPopUpNumberGameMatchs(metalModel.MatchId).ConfigureAwait(false);
            if (dataNg != null)
            {
                _htmlResult = _resultService.HtmlParser(dataNg, setting);
            }
        }

        private async Task GetHappy5PopUpData(ResultPopupMetaModel metalModel, ResultSetting setting)
        {
            var dataHappy5 = await _resultService.GetPopUpHappy5Matches(metalModel.MatchId).ConfigureAwait(false);
            if (dataHappy5 != null)
            {
                _htmlResult = _resultService.HtmlParser(dataHappy5, setting);
            }
        }

        private async Task GetOtherNormalPopUpData(ResultPopupMetaModel metalModel, ResultSetting setting)
        {
            var data = await _resultService.GetPopUpMatch(metalModel).ConfigureAwait(false);
            if (data != null)
            {
                _htmlResult = _resultService.HtmlParser(data, setting);
            }
        }

        private async Task GetNormalPopUpData(ResultPopupMetaModel metalModel, SportType sportType, ResultSetting setting)
        {
            if (IsVirtualSport(sportType))
            {
                await GetVirtualSportPopUpData(metalModel, setting).ConfigureAwait(false);
                return;
            }

            if (sportType == SportType.NumberGame)
            {
                await GetNumberGamePopUpData(metalModel, setting).ConfigureAwait(false);
                return;
            }

            if (sportType == SportType.Happy5)
            {
                await GetHappy5PopUpData(metalModel, setting).ConfigureAwait(false);
                return;
            }

            await GetOtherNormalPopUpData(metalModel, setting).ConfigureAwait(false);
        }

        #endregion popup-page

        #region spots list

        private async Task<JsonResult> GetNormalSports(GetSportResultMetaModel metalModel)
        {
            var sports = await _resultService.GetSports(metalModel.FromDate, metalModel.LicenseeId).ConfigureAwait(false);
            if (sports.Any())
            {
                var productCodes = metalModel.ProductCodeList.Split(',');

                var isAllowAllProducts = productCodes.Contains(Common.Constant.ProductCodes.NG) && productCodes.Contains(Common.Constant.ProductCodes.VS);

                var limitedSports = isAllowAllProducts ? sports : RemoveNotAllowedSports(sports, productCodes);

                if (limitedSports.Any())
                {
                    var leagues = await _resultService.GetLeagues(metalModel.FromDate, limitedSports.First().SportId).ConfigureAwait(false);
                    return Json(new { Sports = limitedSports, Leagues = leagues });
                }
            }

            return Json(string.Empty);
        }

        private async Task<JsonResult> GetOutRightSports(ResultMetaModel metalModel)
        {
            var cacheKey = GenerateOutRightCacheKey(metalModel);
            var outRightData = (IList<Outright>)HttpRuntime.Cache.Get(cacheKey) ?? await _resultService.GetOutRight(metalModel).ConfigureAwait(false);
            if (outRightData != null && outRightData.Count > 0)
            {
                var sports = outRightData.Where(i => i.SportType == metalModel.SportId || metalModel.SportId == 0)
                        .Select(i => i.SportType).Distinct()
                        .Select(i => new Sport
                        {
                            SportId = i,
                            SportName = _cacheRefAdapter.GetSportName(i)
                        }).ToList();

                if (sports.Count > 0)
                {
                    var selectedSport = metalModel.SportId > 0 ? metalModel.SportId : sports[0].SportId;
                    var leagues = outRightData.Where(i => i.SportType == selectedSport)
                            .Select(i => i.LeagueId).Distinct()
                            .Select(i => new League
                            {
                                LeagueId = i,
                                LeagueName = _cacheRefAdapter.GetLeagueName(i)
                            }).ToList();

                    return Json(new { Sports = sports, Leagues = leagues });
                }
            }

            return Json(string.Empty);
        }

        #endregion spots list

        #region main-page
        private async Task<int> GetSportId(DateTime fromDate, int licenseeId)
        {
            var sports = await _resultService.GetSports(fromDate, licenseeId).ConfigureAwait(false);
            return sports.Any() ? sports[0].SportId : 0;
        }

        private async Task GetOutRightData(ResultMetaModel metalModel)
        {
            var setting = GetOutRightResultSetting(metalModel.LanguageCode);
            var cacheKey = GenerateOutRightCacheKey(metalModel);
            var outRightData = (IList<Outright>)HttpRuntime.Cache.Get(cacheKey) ?? await _resultService.GetOutRight(metalModel).ConfigureAwait(false);
            if (outRightData != null)
            {
                var data =
                    outRightData.Where(i => i.SportType == metalModel.SportId && (metalModel.LeagueId == 0 || metalModel.LeagueId == i.LeagueId)).ToList();

                if (data.Count > 0)
                {
                    if (metalModel.IsExportExcel)
                    {
                        this._excelStream = _resultService.ExcelParser(data, setting);
                    }
                    else
                    {
                        this._htmlResult = _resultService.HtmlParser(data, setting);
                    }
                }
            }
        }

        private async Task GetNormalData(ResultMetaModel metalModel)
        {
            var setting = GetNormalResultSetting(metalModel);
            switch (setting.SportType)
            {
                case SportType.VirtualHorseRacing:
                case SportType.VirtualGreyhounds:
                case SportType.VirtualMotorRacing:
                case SportType.VirtualCycling:
                case SportType.VirtualSpeedway:
                    var dataRc = await _resultService.GetVirtualSportMatches(metalModel).ConfigureAwait(false);
                    ParseResult(dataRc, setting, metalModel.IsExportExcel);
                    break;

                case SportType.NumberGame:
                    var dataNg = await _resultService.GetNumberGameMatches(metalModel).ConfigureAwait(false);
                    ParseResult(dataNg, setting, metalModel.IsExportExcel);
                    break;

                case SportType.Happy5:
                    var dataHappy5 = await _resultService.GetHappy5Matches(metalModel).ConfigureAwait(false);
                    ParseResult(dataHappy5, setting, metalModel.IsExportExcel);
                    break;

                default:
                    var data = await _resultService.GetMatches(metalModel).ConfigureAwait(false);
                    ParseResult(data, setting, metalModel.IsExportExcel);
                    break;
            }
        }

        private void ParseResult<T>(IList<T> data, ResultSetting setting, bool isExportExcel)
        {
            if (data != null)
            {
                if (isExportExcel)
                {
                    _excelStream = _resultService.ExcelParser(data, setting);
                }
                else
                {
                    _htmlResult = _resultService.HtmlParser(data, setting);
                }
            }
        }

        private MemoryStream ExportNoneData(ResultMetaModel metalModel)
        {
            if (metalModel.IsOutRight)
            {
                var setting = GetOutRightResultSetting(metalModel.LanguageCode);
                return _resultService.ExcelParser(new List<Outright>(), setting);
            }
            else
            {
                metalModel.SportId = (int)SportType.Soccer;
                var setting = GetNormalResultSetting(metalModel);
                return _resultService.ExcelParser(new List<Sportsbook>(), setting);
            }
        }

        private ResultSetting GetOutRightResultSetting(string languageCode)
        {
            return new ResultSetting
            {
                IsOutright = true,
                ExcelTitle = ViewResources.Result,
                ExcelTemplatePath = HostingEnvironment.MapPath(ResultExcelTemplateAddress),
                LanguageCode = languageCode,
                VisibleMatchCodeIDColumn = true
            };
        }

        private ResultSetting GetNormalResultSetting(ResultMetaModel metalModel)
        {
            var sportType = (SportType)metalModel.SportId;
            return new ResultSetting
            {
                SportType = sportType,
                ExcelTitle = ViewResources.Result,
                ExcelTemplatePath = HostingEnvironment.MapPath(ResultExcelTemplateAddress),
                LanguageCode = LanguageCode,
                VisibleDetailedLink = true,
                VisibleFreeHeader = true,
                EnableCheckScoreCalculated = sportType == SportType.Soccer,
                VisibleMatchCodeIDColumn = ShowingMatchCodeSportTypes.Contains(sportType)
            };
        }

        /// <summary>
        /// Get data from service layer.
        /// </summary>
        /// <param name="metalModel">The metal model.</param>
        private async Task GetData(ResultMetaModel metalModel)
        {
            if (metalModel.IsOutRight)
            {
                await this.GetOutRightData(metalModel).ConfigureAwait(false);
            }
            else
            {
                await this.GetNormalData(metalModel).ConfigureAwait(false);
            }
        }

        #endregion main-page

        #endregion Utilities
    }
}