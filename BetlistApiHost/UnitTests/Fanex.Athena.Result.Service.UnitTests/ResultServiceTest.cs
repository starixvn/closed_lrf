namespace Fanex.Athena.Result.Service.UnitTests
{
    using System;
    using DataAccess;
    using Fanex.Result.Core.Racing.DTO;
    using Fanex.Result.Core.Sportsbook.DTO;
    using Model.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    public class ResultServiceTest
    {
        private IResultDataAccess _dataAccess;
        private IResultNumberGameDataAccess _numberGameDataAccess;
        private ResultService _service;

        [SetUp]
        public void SetUp()
        {
            _dataAccess = Substitute.For<IResultDataAccess>();
            _numberGameDataAccess = Substitute.For<IResultNumberGameDataAccess>();
            _service = new ResultService(_dataAccess, _numberGameDataAccess);
        }

        [TearDown]
        public void TearDown()
        {
            _dataAccess = null;
            _service = null;
        }

        [Test]
        public void GetOutRight_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultMetaModel();

            // Action
            _service.GetOutRight(metaModel);

            // Assert
            _dataAccess.Received(1).GetOutRight(metaModel);
        }

        [Test]
        public void GetSports_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const int LicenseeId = 1;
            var date = new DateTime(2018, 1, 1);

            // Action
            _service.GetSports(date, LicenseeId);

            // Assert
            _dataAccess.Received(1).GetSports(date, LicenseeId);
        }

        [Test]
        public void GetLeagues_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const int LicenseeId = 1;
            var date = new DateTime(2018, 1, 1);

            // Action
            _service.GetLeagues(date, LicenseeId);

            // Assert
            _dataAccess.Received(1).GetLeagues(date, LicenseeId);
        }

        [Test]
        public void GetMatches_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultMetaModel();

            // Action
            _service.GetMatches(metaModel);

            // Assert
            _dataAccess.Received(1).GetMatches<Sportsbook>(metaModel);
        }

        [Test]
        public void GetNumberGameMatches_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultMetaModel();

            // Action
            _service.GetNumberGameMatches(metaModel);

            // Assert
            _numberGameDataAccess.Received(1).GetNumberGameMatches(metaModel);
        }

        [Test]
        public void GetHappy5Matches_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultMetaModel();

            // Action
            _service.GetHappy5Matches(metaModel);

            // Assert
            _numberGameDataAccess.Received(1).GetHappy5Matches(metaModel);
        }

        [Test]
        public void GetVirtualSportMatches_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultMetaModel();

            // Action
            _service.GetVirtualSportMatches(metaModel);

            // Assert
            _dataAccess.Received(1).GetVirtualSportMatches(metaModel);
        }

        [Test]
        public void GetSportsbookGameDetail_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const int MatchId = 1;

            // Action
            _service.GetSportsbookGameDetail(MatchId);

            // Assert
            _dataAccess.Received(1).GetSportsbookGameDetail(MatchId);
        }

        [Test]
        public void GetPopUpMatch_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultPopupMetaModel
            {
                MatchId = 1,
                Bettype = 3,
                BetId = 4,
                Handicap1 = 3,
                Handicap2 = 5,
                RaceNo = 1
            };

            // Action
            _service.GetPopUpMatch(metaModel);

            // Assert
            _dataAccess.Received(1).GetPopUpMatches<Sportsbook>(Arg.Is<ResultPopupMetaModel>(x => x == metaModel && !x.RaceNo.HasValue));
        }

        [Test]
        public void GetPopUpRacingMatch_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var metaModel = new ResultPopupMetaModel
            {
                MatchId = 1,
                RaceNo = 2,
                Bettype = 3,
                BetId = 4
            };

            // Action
            _service.GetPopUpVirtualSportMatch(metaModel);

            // Assert
            _dataAccess.Received(1).GetPopUpMatches<Racing>(metaModel);
        }

        [Test]
        public void GetPopUpParlayMatch_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const long RefNo = 4;

            // Action
            _service.GetPopUpParlayMatch(RefNo);

            // Assert
            _dataAccess.Received(1).GetPopUpParalayMatch(RefNo);
        }

        [Test]
        public void GetPopUpNumberGameMatchs_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const int MatchId = 1;

            // Action
            _service.GetPopUpNumberGameMatchs(MatchId);

            // Assert
            _numberGameDataAccess.Received(1).GetPopUpNumberGameMatch(MatchId);
        }

        [Test]
        public void GetPopUpHappy5Matches_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            const int MatchId = 1;

            // Action
            _service.GetPopUpHappy5Matches(MatchId);

            // Assert
            _numberGameDataAccess.Received(1).GetPopUpHappy5Match(MatchId);
        }

        [Test]
        public void GetPopUpSingleMatchParlay_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var matchId = FakeHelper.Create<int>();
            var marketId = FakeHelper.Create<string>();

            // Action
            _service.GetPopUpSingleMatchParlay(matchId, marketId);

            // Assert
            _dataAccess.Received(1).GetPopUpSingleMatchParlay(matchId, marketId);
        }
    }
}