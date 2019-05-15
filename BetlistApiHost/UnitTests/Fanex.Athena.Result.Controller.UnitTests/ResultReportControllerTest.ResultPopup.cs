namespace Fanex.Athena.Result.Controller.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Common.Constant;
    using Fanex.Result.Core.Base;
    using Fanex.Result.Core.NumberGame.DTO;
    using Fanex.Result.Core.Racing.DTO;
    using Fanex.Result.Core.Sportsbook.DTO;
    using Model.MetaModel;
    using NSubstitute;
    using NUnit.Framework;

    [TestFixture]
    public partial class ResultReportControllerTest
    {
        [Test]
        public async Task ResultPopup_ValidModelState_ResultIsCorrect()
        {
            using (var controller = CreateController())
            {
                // Arrange
                _resultService.HtmlParser(Arg.Any<IList<Sportsbook>>(), null).ReturnsForAnyArgs(HtmlResult);

                // Action
                var result = await controller.ResultPopup(new ResultPopupMetaModel()).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.EqualTo(HtmlResult));
            }
        }

        [TestCase(1, true, (int)BetType.VirtualSports2MixParlay, true)]
        [TestCase(0, false, 123, false)]
        [TestCase(null, false, BetType.MixParlay, true)]
        public async Task ResultPopup_ValidModelState_CreateCorrectResultSetting(
            int inputOutRight,
            bool expectedIsOutRight,
            int bettype,
            bool expectedIsParlayPopup)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ResultPopupMetaModel
                {
                    SportType = (int)Fanex.Result.Core.Base.SportType.AGCasino,
                    IsOutRight = inputOutRight,
                    Bettype = bettype
                };

                // Action
                var result = await controller.ResultPopup(new ResultPopupMetaModel()).ConfigureAwait(false);

                // Assert
                _resultService.HtmlParser(
                        Arg.Any<IList<Sportsbook>>(),
                        Arg.Is<ResultSetting>(x =>
                            x.SportType == (Fanex.Result.Core.Base.SportType)metaModel.SportType &&
                            x.IsOutright == expectedIsOutRight &&
                            x.IsParlayPopUp == expectedIsParlayPopup &&
                            x.IsPopUp &&
                            x.LanguageCode == LanguageCode &&
                            x.EnableCheckScoreCalculated));
            }
        }

        [TestCase(1, HtmlResult)]
        [TestCase(0, HtmlResult)]
        [TestCase(null, null)]
        public async Task ResultPopup_IsParlayPopup_ResultIsCorrect(long? refNo, string expectedHtmlResult)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ResultPopupMetaModel
                {
                    Bettype = (int)BetType.VirtualSports2MixParlay,
                    RefNo = refNo
                };
                var dataList = new List<Parlay> { new Parlay() };
                _resultService.GetPopUpParlayMatch(metaModel.RefNo.HasValue ? metaModel.RefNo.Value : 0).Returns(dataList);
                _resultService.HtmlParser(dataList, Arg.Any<ResultSetting>()).Returns(HtmlResult);

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.EqualTo(expectedHtmlResult));
            }
        }

        [TestCase(Fanex.Result.Core.Base.SportType.VirtualHorseRacing)]
        [TestCase(Fanex.Result.Core.Base.SportType.VirtualMotorRacing)]
        [TestCase(Fanex.Result.Core.Base.SportType.VirtualGreyhounds)]
        [TestCase(Fanex.Result.Core.Base.SportType.VirtualSpeedway)]
        [TestCase(Fanex.Result.Core.Base.SportType.VirtualCycling)]
        public async Task ResultPopup_VirtualSport_ResultIsCorrect(Fanex.Result.Core.Base.SportType sportType)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = CreateResultPopupMetaModel(sportType);
                var dataList = new List<Racing> { new Racing() };
                _resultService.GetPopUpVirtualSportMatch(metaModel).Returns(dataList);
                _resultService.HtmlParser(dataList, Arg.Any<ResultSetting>()).Returns(HtmlResult);

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.EqualTo(HtmlResult));
            }
        }

        [Test]
        public async Task ResultPopup_NumberGameSport_ResultIsCorrect()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = CreateResultPopupMetaModel(Fanex.Result.Core.Base.SportType.NumberGame);
                var dataList = new List<NumberGame> { new NumberGame() };
                _resultService.GetPopUpNumberGameMatchs(metaModel.MatchId).Returns(dataList);
                _resultService.HtmlParser(dataList, Arg.Any<ResultSetting>()).Returns(HtmlResult);

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.EqualTo(HtmlResult));
            }
        }

        [Test]
        public async Task ResultPopup_SportBookSports_ResultIsCorrect()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = CreateResultPopupMetaModel(Fanex.Result.Core.Base.SportType.Soccer);
                var dataList = new List<Sportsbook> { new Sportsbook() };
                _resultService.GetPopUpMatch(metaModel).Returns(dataList);
                _resultService.HtmlParser(dataList, Arg.Any<ResultSetting>()).Returns(HtmlResult);

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.EqualTo(HtmlResult));
            }
        }

        [Test]
        public async Task ResultPopup_SingleMatchParlay_NoData_ResultNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = CreateResultPopupMetaModel(Fanex.Result.Core.Base.SportType.Soccer);
                metaModel.Bettype = (int)BetType.SingleMatchParlay;

                Sportsbook data = null;
                _resultService.GetPopUpSingleMatchParlay(metaModel.MatchId, metaModel.BetId?.ToString()).Returns(Task.FromResult(data));

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [Test]
        public async Task ResultPopup_SingleMatchParlay_ResultIsCorrect()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = CreateResultPopupMetaModel(Fanex.Result.Core.Base.SportType.Soccer);
                metaModel.Bettype = (int)BetType.SingleMatchParlay;

                var data = new Sportsbook();
                _resultService.GetPopUpSingleMatchParlay(metaModel.MatchId, metaModel.BetId?.ToString()).Returns(Task.FromResult(data));
                _resultService.HtmlParser(Arg.Is<List<Sportsbook>>(x => x[0] == data), Arg.Any<ResultSetting>()).Returns(HtmlResult);

                // Action
                var result = await controller.ResultPopup(metaModel).ConfigureAwait(false);

                // Assert
                Assert.Multiple(() =>
                {
                    _resultService.Received(1).HtmlParser(Arg.Any<List<Sportsbook>>(), Arg.Is<ResultSetting>(x => x.IsPopupOpenFromBetList == true));
                    Assert.That(result, Is.EqualTo(HtmlResult));
                });
            }
        }

        private static ResultPopupMetaModel CreateResultPopupMetaModel(Fanex.Result.Core.Base.SportType sportType)
        {
            return new ResultPopupMetaModel
            {
                MatchId = 1,
                RaceNo = 2,
                Bettype = 3,
                BetId = 4,
                SportType = (int)sportType
            };
        }
    }
}