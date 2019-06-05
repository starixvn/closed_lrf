namespace Fanex.Athena.Api.BetList
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Model.BetList.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Session.Model;
    using UnitTest.Common.Helpers;
    using UnitTests;

    public class MatchWinLossBetListControllerTest : ApiBetListBaseControllerHelperTest
    {
        private const int Page = 1;

        private const int Rows = 50;

        private const string MatchBetTypeUspKey = "Lrf_BetList_MatchWL_Bettype";

        private const string OutrightUspKey = "Lrf_BetList_MatchWL_Outright";

        private const string MixParlayUspKey = "Lrf_BetList_MatchWL_Parlay";

        private const string ApiPath = "/BetList/GetBetList";

        private const string PageApiPath = "/BetList/GetBetListPaging";

        [SetUp]
        public void SetUp()
        {
            MockSessionData();

            AuthorizationService.HasPermissionOnData(SessionLicenseeId, Arg.Any<int>(), Arg.Any<long>()).Returns(true);
        }

        [Test]
        public async Task MatchBetType_InvalidCurrency_ReturnNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = SetUpForGetBetListResult(1, new Dictionary<int, string>());

                // Action
                var result = await controller.MatchBetType(Page, Rows, metaModel);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [Test]
        public async Task Outright_InvalidCurrency_ReturnNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = SetUpForGetBetListResult(1, new Dictionary<int, string>());

                // Action
                var result = await controller.Outright(metaModel);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [Test]
        public async Task MixParlay_InvalidCurrency_ReturnNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string>() });

                // Action
                var result = await controller.MixParlay(0, 0, 1, string.Empty, 0, DateTime.Today, DateTime.Today, string.Empty);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        public async Task MatchBetType_ValidCurrency_CallBetListApiWithCorrectParameters(int currencyId)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var page = FakeHelper.Create<int>();
                var row = FakeHelper.Create<int>();

                var metaModel = SetUpForGetBetListResult(currencyId, new Dictionary<int, string> { { currencyId, "Currency" } });

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(metaModel, PageApiPath, expect);

                // Action
                var actual = await controller.MatchBetType(page, row, metaModel);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    Assert.That(metaModel.UspKey, Is.EqualTo(MatchBetTypeUspKey));
                    BetListApiClient.Received().PostAsync(
                        PageApiPath,
                        Arg.Is<BetListMetaModel>(x => x.PageIndex == page && x.PageSize == row),
                        SessionLanguage);
                });
            }
        }

        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Outright_ValidCurrency_CallBetListApiWithCorrectParameters(int currencyId)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = SetUpForGetBetListResult(currencyId, new Dictionary<int, string> { { currencyId, "Currency" } });

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(metaModel, ApiPath, expect);

                // Action
                var actual = await controller.Outright(metaModel);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    Assert.That(metaModel.UspKey, Is.EqualTo(OutrightUspKey));
                    BetListApiClient.Received().PostAsync(
                        ApiPath,
                        Arg.Is<BetListMetaModel>(x => x.IsServerPaging),
                        SessionLanguage);
                });
            }
        }

        [TestCase(0, "", "")]
        [TestCase(1, null, "")]
        [TestCase(2, "usd", "usd")]
        public async Task MixParlay_ValidCurrency_CallBetListApiWithCorrectParameters(int currencyId, string baseCurrency, string expectedBaseCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var page = FakeHelper.Create<int>();
                var rows = FakeHelper.Create<int>();
                var betType = FakeHelper.Create<int>();
                var fromDate = FakeHelper.Create<DateTime>();
                var toDate = FakeHelper.Create<DateTime>();
                var productCodeList = FakeHelper.Create<string>();
                var sortBy = FakeHelper.Create<string>();
                var sortOrder = FakeHelper.Create<string>();

                StubUserSessionData(new UserSession { Language = "en-US", CurrencyList = new Dictionary<int, string> { { currencyId, "Currency" } } });

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(Arg.Any<BetListMetaModel>(), PageApiPath, expect);

                // Action
                var actual = await controller.MixParlay(page, rows, currencyId, baseCurrency, betType, fromDate, toDate, productCodeList, sortBy, sortOrder);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    BetListApiClient.Received().PostAsync(
                        PageApiPath,
                        Arg.Is<BetListMetaModel>(x => x.UspKey == MixParlayUspKey && x.BaseCurrency == expectedBaseCurrency),
                        SessionService.UserSession.Language);
                });
            }
        }

        private BetListMetaModel SetUpForGetBetListResult(int currencyId, Dictionary<int, string> sessionCurrencyList)
        {
            var metaModel = new BetListMetaModel { CurrencyId = currencyId };

            StubUserSessionData(new UserSession { Language = SessionLanguage, CurrencyList = sessionCurrencyList });

            return metaModel;
        }

        private MatchWinLossBetListController CreateController()
        {
            return new MatchWinLossBetListController(
                SessionService,
                ProductService,
                LangService,
                AuthorizationService,
                BetListApiClient,
                BalanceUpDataAccess);
        }
    }
}