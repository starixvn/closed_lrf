namespace Fanex.Athena.Api.BetList.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using Model.BetList.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Utility.Interfaces;
    using Service.StatelessCore.Interfaces;
    using Session.Model;

    public class ExchangeWinLossBetListControllerTest : BaseApiControllerHelperTest
    {
        private const string MainApiPath = "/ExchangeWinLossBetList/GetData";

        private const string DetailApiPath = "/ExchangeWinLossBetList/Detail";

        private IBetListApiClient _betListApiClient;

        private IAuthorizationService _authorizationService;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _betListApiClient = Substitute.For<IBetListApiClient>();
            _authorizationService = Substitute.For<IAuthorizationService>();

            MockSessionData();
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _betListApiClient = null;
            _authorizationService = null;
        }

        [Test]
        public async Task Index_InValidDateRange_ReturnNullData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListMetaModel
                {
                    FromDate = new DateTime(2018, 1, 2),
                    ToDate = new DateTime(2018, 1, 1)
                };

                // Action
                var result = await controller.Index(metaModel);

                // Assert
                Assert.That(result.MainData, Is.Null);
            }
        }

        [Test]
        public async Task Index_InValidCurrency_ReturnNullData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListMetaModel
                {
                    FromDate = new DateTime(2018, 1, 1),
                    ToDate = new DateTime(2018, 1, 2),
                    CurrencyId = 1
                };

                StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string>() });

                // Action
                var result = await controller.Index(metaModel);

                // Assert
                Assert.That(result.MainData, Is.Null);
            }
        }

        [Test]
        public async Task Index_NoPermission_ReturnNullData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListMetaModel
                {
                    FromDate = new DateTime(2018, 1, 1),
                    ToDate = new DateTime(2018, 1, 2),
                    CurrencyId = 0,
                    CustId = 1
                };

                _authorizationService.HasPermissionOnData(SessionLicenseeId, metaModel.CurrencyId, 0).Returns(false);

                // Action
                var result = await controller.Index(metaModel);

                // Assert
                Assert.That(result.MainData, Is.Null);
            }
        }

        [Test]
        public async Task Index_NoCustId_ReturnNullData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListMetaModel
                {
                    FromDate = new DateTime(2018, 1, 1),
                    ToDate = new DateTime(2018, 1, 2),
                    CurrencyId = 0,
                    CustId = 0
                };

                // Action
                var result = await controller.Index(metaModel);

                // Assert
                Assert.That(result.MainData, Is.Null);
            }
        }

        [TestCase(0, null, "")]
        [TestCase(1, "usd", "USD")]
        [TestCase(2, "usD", "USD")]
        public async Task Index_ValidRequest_CallBetListApiWithCorrectParameters(int currencyId, string inputBaseCurrency, string expectedBaseCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListMetaModel
                {
                    FromDate = new DateTime(2018, 1, 1),
                    ToDate = new DateTime(2018, 1, 2),
                    CurrencyId = currencyId,
                    CustId = 100,
                    BaseCurrency = inputBaseCurrency
                };

                StubUserSessionData(new UserSession
                {
                    Language = SessionLanguage,
                    CurrencyList = new Dictionary<int, string> { { currencyId, "Currency" } }
                });

                _authorizationService.HasPermissionOnData(SessionLicenseeId, metaModel.CustId, 0).Returns(true);

                var expect = new HttpResponseMessage();
                _betListApiClient.PostAsync(MainApiPath, metaModel, SessionLanguage).Returns(Task.FromResult(expect));

                // Action
                var actual = await controller.Index(metaModel);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    _betListApiClient.Received().PostAsync(
                        MainApiPath,
                        Arg.Is<ExchangeBetListMetaModel>(x => x == metaModel && x.BaseCurrency == expectedBaseCurrency),
                        SessionLanguage);
                });
            }
        }

        [Test]
        public async Task Detail_InValidCurrency_ReturnEmptyData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListDetailMetaModel
                {
                    CurrencyId = 1,
                    BetId = 1,
                    CustId = 1,
                };

                StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string>() });

                // Action
                var result = await controller.Detail(metaModel);

                // Assert
                Assert.That(result, Is.Empty);
            }
        }

        [Test]
        public async Task Detail_NoPermission_ReturnEmptyData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListDetailMetaModel
                {
                    CurrencyId = 0,
                    CustId = 1,
                    BetId = 1,
                };

                _authorizationService.HasPermissionOnData(SessionLicenseeId, metaModel.CurrencyId, 0).Returns(false);

                // Action
                var result = await controller.Detail(metaModel);

                // Assert
                Assert.That(result, Is.Empty);
            }
        }

        [Test]
        public async Task Detail_NoBetId_ReturnEmptyData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListDetailMetaModel
                {
                    CurrencyId = 0,
                    CustId = 1,
                    BetId = 0
                };

                // Action
                var result = await controller.Detail(metaModel);

                // Assert
                Assert.That(result, Is.Empty);
            }
        }

        [Test]
        public async Task Detail_NoCustId_ReturnEmptyData()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListDetailMetaModel
                {
                    CurrencyId = 0,
                    CustId = 0,
                    BetId = 1
                };

                // Action
                var result = await controller.Detail(metaModel);

                // Assert
                Assert.That(result, Is.Empty);
            }
        }

        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        public async Task Detail_ValidRequest_CallBetListApiWithCorrectParameters(int currencyId)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new ExchangeBetListDetailMetaModel
                {
                    BetId = 1,
                    CurrencyId = currencyId,
                    CustId = 200
                };

                StubUserSessionData(new UserSession
                {
                    Language = SessionLanguage,
                    CurrencyList = new Dictionary<int, string> { { currencyId, "Currency" } }
                });

                _authorizationService.HasPermissionOnData(SessionLicenseeId, metaModel.CustId, 0).Returns(true);

                var expect = new HttpResponseMessage();
                _betListApiClient.PostAsync(DetailApiPath, metaModel, SessionLanguage).Returns(Task.FromResult(expect));

                // Action
                var actual = await controller.Detail(metaModel);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    _betListApiClient.Received().PostAsync(DetailApiPath, metaModel, SessionLanguage);
                });
            }
        }

        private ExchangeWinLossBetListController CreateController()
        {
            return new ExchangeWinLossBetListController(SessionService, ProductService, LangService, _betListApiClient, _authorizationService);
        }
    }
}