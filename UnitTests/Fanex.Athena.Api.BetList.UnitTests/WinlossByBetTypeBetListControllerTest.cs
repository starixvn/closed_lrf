namespace Fanex.Athena.Api.BetList.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Model.BetList.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Session.Model;

    public class WinlossByBetTypeBetListControllerTest : ApiBetListBaseControllerHelperTest
    {
        private const string UspKey = "Lrf_BetList_SelWinLossByBetType";

        private const string ApiPath = "/BetList/GetBetListPaging";

        [SetUp]
        public void SetUp()
        {
            MockSessionData();

            AuthorizationService.HasPermissionOnData(SessionLicenseeId, Arg.Any<int>(), Arg.Any<long>()).Returns(true);
        }

        [Test]
        public async Task Detail_InvalidCurrency_ReturnNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                const int CurrencyId = 1;

                StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string>() });

                // Action
                var result = await controller.Index(1, 50, CurrencyId, string.Empty, string.Empty, DateTime.Today, DateTime.Today, 1);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [TestCase(0, "usd", "usd")]
        [TestCase(1, null, "")]
        [TestCase(2, "", "")]
        public async Task Detail_WhenCall_CallBetListApiWithCorrectParameters(int currencyId, string baseCurrency, string expectedBaseCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                const int Page = 2;
                const int Rows = 50;
                const string CurrencyName = "USD";
                var fromDate = new DateTime(2018, 1, 1);
                var toDate = new DateTime(2018, 1, 2);
                const int BetType = 1;
                const string SortBy = "Index";
                const string SortOrder = "asc";

                StubUserSessionData(new UserSession { Language = SessionLanguage, CurrencyList = new Dictionary<int, string> { { currencyId, "Currency" } } });

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(Arg.Any<BetListMetaModel>(), ApiPath, expect);

                // Action
                var actual = await controller.Index(Page, Rows, currencyId, CurrencyName, baseCurrency, fromDate, toDate, BetType, SortBy, SortOrder);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    BetListApiClient.Received().PostAsync(
                        ApiPath,
                        Arg.Is<BetListMetaModel>(x => x.UspKey == UspKey
                            && x.PageIndex == Page
                            && x.PageSize == Rows
                            && x.BetType == BetType
                            && x.FromDate == fromDate
                            && x.ToDate == toDate
                            && x.CurrencyName == CurrencyName
                            && x.BaseCurrency == expectedBaseCurrency
                            && x.SortBy == SortBy
                            && x.SortOrder == SortOrder),
                        SessionLanguage);
                });
            }
        }

        private WinlossByBetTypeBetListController CreateController()
        {
            return new WinlossByBetTypeBetListController(
                SessionService,
                ProductService,
                LangService,
                AuthorizationService,
                BetListApiClient,
                BalanceUpDataAccess);
        }
    }
}