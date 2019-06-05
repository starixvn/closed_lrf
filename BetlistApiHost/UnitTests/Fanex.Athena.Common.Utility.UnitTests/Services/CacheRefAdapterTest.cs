using Fanex.Athena.Common.Utility.Services;
using Fanex.Athena.Common.Utility.Services.Interfaces;
using Fanex.RemotingRef;
using NSubstitute;
using NUnit.Framework;

namespace Fanex.Athena.Common.Utility.UnitTests.Services
{
    public class CacheRefAdapterTest
    {
        private const string ExpectedSportName = "TestSport";
        private const string ExpectedLeagueName = "TestLeagueName";
        private ICacheRefAdapter _cacheRefAdapter;
        private IRemotingRefService _remotingRefService;

        [SetUp]
        public void Setup()
        {
            _remotingRefService = Substitute.For<IRemotingRefService>();
            _remotingRefService.GetSportName(
                Arg.Any<string>(),
                Arg.Any<string>(),
                string.Empty)
            .Returns(ExpectedSportName);

            _remotingRefService.GetLeagueName(
                Arg.Any<string>(),
                Arg.Any<string>(),
                string.Empty)
            .Returns(ExpectedLeagueName);

            _remotingRefService.GetCombinationTypeCombo(
                Arg.Any<string>(),
                Arg.Any<string>(),
                Arg.Any<int>(),
                Arg.Any<int>(),
                Arg.Any<string>())
            .Returns(new[] { "call1", "call2" });
            _cacheRefAdapter = new CacheRefAdapter(_remotingRefService);
        }

        [TearDown]
        public void TearDown()
        {
            _cacheRefAdapter = null;
            _remotingRefService = null;
        }

        [TestCase(null)]
        [TestCase(0)]
        [TestCase("")]
        public void GetSportName_WithInvalidSport_ReturnEmpty(object sportId)
        {
            // Arrange

            // Action
            var result = _cacheRefAdapter.GetSportName(sportId, "en-US");

            // Assert
            Assert.True(string.IsNullOrEmpty(result));
        }

        [Test]
        public void GetSportName_ValidSportId_ReturnSportName()
        {
            // Arrange
            const int SportId = 1;
            
            // Action
            var result = _cacheRefAdapter.GetSportName(SportId, "en-US");

            // Assert
            Assert.AreEqual(ExpectedSportName, result);
        }

        [Test]
        public void GetLeagueName_ValidLeagueId_ReturnLegueName()
        {
            // Arrange
            const int LeagueId = 1;

            // Action
            var result = _cacheRefAdapter.GetLeagueName(LeagueId);

            // Assert
            Assert.AreEqual(ExpectedLeagueName, result);
        }

        [TestCase(null)]
        [TestCase(0)]
        [TestCase("")]
        public void GetLeagueName_InValidLeagueId_ReturnEmpty(object leagueId)
        {
            // Arrange

            // Action
            var result = _cacheRefAdapter.GetLeagueName(leagueId);

            // Assert
            Assert.True(string.IsNullOrEmpty(result));
        }

        [Test]
        public void GetCombinationTypeCombo_WhenCall_ReturnCombinationTypeCombo()
        {
            // Arrange
            const string BetTeam = "betteam";
            const string BetCheck = "betCheck";
            const decimal Handicap1 = 1;
            const decimal Handicap2 = 2;

            // Action
            var result = _cacheRefAdapter.GetCombinationTypeCombo(BetTeam, BetCheck, Handicap1, Handicap2);

            // Assert
            Assert.True(result.Length == 2);
            Assert.True(result[0] == "call1");
            Assert.True(result[1] == "call2");
        }
    }
}