namespace Fanex.Athena.BetList.Service.UnitTests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Constant;
    using Common.DataAccess.Interfaces;
    using Common.Model.DTO;
    using Common.Utility.Collections;
    using Common.Utility.Services.Interfaces;
    using DataAccess.Interfaces;
    using Fanex.BetList.Core.Builder;
    using Fanex.BetList.Core.Entities;
    using Interfaces;
    using Model.DTO;
    using Model.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service;
    using Service.Helpers;
    using UnitTest.Common.Helpers;
    using UnitTest.Common.NUnitExtensions;

    [TestFixture]
    public class BetListServiceTest
    {
        private readonly IDictionary<int, string> _currencyList = new Dictionary<int, string> { { 20, "UUS" } };

        private IBetListDataAccess _betlistDataAccess;

        private IBetListService _betListService;

        private ITicketHelper _ticketHelper;

        private IBetListHTMLBuilder _betlistHtmlBuilder;

        private ICacheRefAdapter _cacheRefAdapter;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            var balanceUpDataAccess = Substitute.For<IBalanceUpDataAccess>();
            _betlistDataAccess = Substitute.For<IBetListDataAccess>();
            _ticketHelper = Substitute.For<ITicketHelper>();
            _betlistHtmlBuilder = Substitute.For<IBetListHTMLBuilder>();
            _cacheRefAdapter = Substitute.For<ICacheRefAdapter>();

            _betListService = new BetListService(balanceUpDataAccess, _betlistDataAccess, _ticketHelper, _betlistHtmlBuilder, _cacheRefAdapter);

            balanceUpDataAccess.GetBalanceUp().Returns(new BalanceUp());
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            _betlistDataAccess = null;
            _betListService = null;
            _betlistHtmlBuilder = null;
            _cacheRefAdapter = null;
            _ticketHelper = null;
        }

        [TearDown]
        public void TearDown()
        {
            _ticketHelper.ClientDetailSystemParlayFunction = string.Empty;
        }

        [Test]
        public async Task GetMixParlayDetailTicket_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var expectedResult = new TicketResult();
            var metaModel = new MixParlayDetailMetaModel();
            _betlistDataAccess.GetMixParlayDetailTicket(metaModel).Returns(expectedResult);

            // Action
            var result = await _betListService.GetMixParlayDetailTicket(metaModel).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public async Task GetSystemParlayDetail_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var expectedResult = new SystemParlayData { Outstanding = 999 };
            var metaModel = new SystemParlayDetailMetaModel();
            _betlistDataAccess.GetSystemParlayDetail(metaModel).Returns(expectedResult);

            // Action
            var result = await _betListService.GetSystemParlayDetail(metaModel).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public async Task GetSingleMatchParlayDetail_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var expectedResult = FakeHelper.CreateMany<SingleMatchParlayDetail>(2);
            var metaModel = new SingleMatchParlayDetailMetaModel();
            _betlistDataAccess.GetSingleMatchParlayDetail(metaModel).Returns(Task.FromResult<IList<SingleMatchParlayDetail>>(expectedResult.ToList()));

            // Action
            var result = await _betListService.GetSingleMatchParlayDetail(metaModel).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public async Task GetBetListData_WhenCall_ReturnDataFromDataAccess()
        {
            // Arrange
            var expectedResult = new TicketResult
            {
                TotalRows = 1234
            };
            var spname = FakeHelper.Create<string>();
            var metaModel = new BetListMetaModel();
            _betlistDataAccess.GetBetListData(metaModel).Returns(expectedResult);

            // Action
            var result = await _betListService.GetBetListData(metaModel).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public void GetLeagueName_WhenCall_ReturnDataFromCacheRefAdapter()
        {
            // Arrange
            var leagueId = FakeHelper.Create<int>();

            // Action
            _betListService.GetLeagueName(leagueId);

            // Assert
            _cacheRefAdapter.Received().GetLeagueName(leagueId);
        }

        [Test]
        public void BuildTicketTextList_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = 0,
                SportTypeId = (int)SportType.Soccer,
                Status = "running",
                BetEffective = 0
            };
            var ticketResult = new TicketResult
            {
                MainTicketList = new SortableList<LrfTicket> { ticket }
            };
            var metaModel = FakeHelper.Create<BetListMetaModel>();

            var expectedTicketText = new TicketText
            {
                Index = 0,
                ExternalId = ticket.ExternalId,
                SystemId = ticket.UserName,
                TransTime = FakeHelper.Create<string>(),
                Status = FakeHelper.Create<string>(),
                Choice = FakeHelper.Create<string>(),
                Odds = FakeHelper.Create<string>(),
                Stake = FakeHelper.Create<string>(),
                LicenseeWL = "-",
                WinLoss = "-",
                BetEffective = "<div class='underdog'>0.00</div>"
            };
            _betlistHtmlBuilder.BuildTrans(ticket).Returns(expectedTicketText.TransTime);
            _betlistHtmlBuilder.BuildStatus(ticket, _ticketHelper, ticketResult.TicketDataList, false).Returns(expectedTicketText.Status);
            _betlistHtmlBuilder.BuildChoice(ticket, _ticketHelper, ticketResult.TicketDataList, false).Returns(expectedTicketText.Choice);
            _betlistHtmlBuilder.BuildOdds(ticket, ticketResult.TicketDataList, Arg.Any<GetCachePropertyById>()).Returns(expectedTicketText.Odds);
            _betlistHtmlBuilder.BuildStake(ticket).Returns(expectedTicketText.Stake);

            // Action
            var result = _betListService.BuildTicketTextList(ticketResult, metaModel, 0);
            var firstItem = result[0];

            // Assert
            Assert.That(firstItem, Tobe.SameProperties(expectedTicketText));
        }

        [Test]
        public void BuildTicketTextList_CombinationMixParlayTicket_AddCombMPDetailLink()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)BetType.CombinationMixParlay,
                SportTypeId = (int)SportType.Soccer,
                Status = "running",
                BetTeam = "1"
            };
            var ticketResult = new TicketResult
            {
                MainTicketList = new SortableList<LrfTicket> { ticket }
            };
            var metaModel = FakeHelper.Create<BetListMetaModel>();

            _ticketHelper.GetCombinationMPOfferName(ticket.BetTeam).Returns(FakeHelper.Create<string>());

            var expected = BetListHelper.GenerateClientDetailSystemParlayFunction(_ticketHelper, metaModel.BaseCurrency, ticket, metaModel.CustId);

            // Action
            _betListService.BuildTicketTextList(ticketResult, metaModel);

            // Assert
            Assert.That(_ticketHelper.ClientDetailSystemParlayFunction, Is.EqualTo(expected));
        }

        [Test]
        public void BuildTicketTextList_CombinationMixParlayTicket_MetaModelIsNull_DoNotAddCombMPDetailLink()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)BetType.CombinationMixParlay,
                SportTypeId = (int)SportType.Soccer,
                Status = "running",
                BetTeam = "1",
                CustId = 1
            };
            var ticketResult = new TicketResult
            {
                MainTicketList = new SortableList<LrfTicket> { ticket }
            };

            // Action
            _betListService.BuildTicketTextList(ticketResult);

            // Assert
            Assert.That(_ticketHelper.ClientDetailSystemParlayFunction, Is.Empty);
        }
    }
}