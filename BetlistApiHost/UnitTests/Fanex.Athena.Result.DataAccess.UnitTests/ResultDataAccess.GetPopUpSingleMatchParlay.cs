namespace Fanex.Athena.Result.DataAccess.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Fanex.Athena.UnitTest.Common.NUnitExtensions;
    using Fanex.Result.Core.Sportsbook.DTO;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    public partial class ResultDataAccessTest
    {
        private const string GetPopUpSingleMatchParlaySp = "Lrf_TicketResult_BetBuilder";

        [Test]
        public async Task GetPopUpSingleMatchParlay_WhenCall_ParameterPassedCorrectly()
        {
            // Arrange
            var matchId = FakeHelper.Create<int>();
            var marketId = FakeHelper.Create<string>();

            DataAccess.GetObjectDb(Arg.Is(GetPopUpSingleMatchParlaySp)).Returns(ObjectDb);
            Reader.Read().Returns(false);

            // Action
            await DataAccess.GetPopUpSingleMatchParlay(matchId, marketId).ConfigureAwait(false);

            // Assert
            Assert.Multiple(() =>
            {
                ObjectDb.Received(1).SetParameterValue("matchId", matchId);
                ObjectDb.Received(1).SetParameterValue("marketId", marketId);
            });
        }

        [Test]
        public async Task GetPopUpSingleMatchParlay_WhenCall_ReturnCorrectMainData()
        {
            // Arrange
            var matchId = FakeHelper.Create<int>();
            var marketId = FakeHelper.Create<string>();

            DataAccess.GetObjectDb(Arg.Is(GetPopUpSingleMatchParlaySp)).Returns(ObjectDb);

            Reader.Read().Returns(true, false);
            Reader.NextResult().Returns(false);
            Reader.FieldCount.Returns(3);
            Reader.GetName(0).Returns("lcolor");
            Reader.GetName(1).Returns("LiveAwayScore");
            Reader.GetName(2).Returns("LiveHomeScore");

            var dataMapping = GetReaderDataMappingForSportsbookType();
            MapReaderData(dataMapping);

            var sportsbookData = GetExpectedSportsbookData();
            sportsbookData.GameDetails.Clear();
            sportsbookData.BetID = null;
            sportsbookData.Bettype = 0;

            // Action
            var result = await DataAccess.GetPopUpSingleMatchParlay(matchId, marketId).ConfigureAwait(false);

            // Assert
            Assert.That(result, Tobe.SameProperties(sportsbookData));
        }

        [Test]
        public async Task GetPopUpSingleMatchParlay_WhenCall_ReturnCorrectBetBuilderDetailsData()
        {
            // Arrange
            var matchId = FakeHelper.Create<int>();
            var marketId = FakeHelper.Create<string>();

            DataAccess.GetObjectDb(Arg.Is(GetPopUpSingleMatchParlaySp)).Returns(ObjectDb);

            Reader.Read().Returns(true, true, false);
            Reader.NextResult().Returns(true);
            Reader.FieldCount.Returns(0);

            var expectedDetail = new Dictionary<string, object>
            {
                { "SelectionType", FakeHelper.Create<int>() }, { "Result", FakeHelper.Create<string>() }
            };
            MergeReaderDataMapping(expectedDetail, GetReaderDataMappingForSportsbookType());
            
            MapReaderData(expectedDetail);

            // Action
            var result = await DataAccess.GetPopUpSingleMatchParlay(matchId, marketId).ConfigureAwait(false);
            var detailResult = result.BetBuilderDetails[0];

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(detailResult.SelectionType, Is.EqualTo(expectedDetail["SelectionType"]));
                Assert.That(detailResult.Result, Is.EqualTo(expectedDetail["Result"]));
            });
        }
    }
}