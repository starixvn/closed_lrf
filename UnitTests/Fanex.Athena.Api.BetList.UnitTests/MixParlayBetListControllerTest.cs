namespace Fanex.Athena.Api.BetList.UnitTests
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using Model.BetList.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    public class MixParlayBetListControllerTest : ApiBetListBaseControllerHelperTest
    {
        private const string MixParlayApiPath = "/MixParlayBetList/Detail";

        private const string NewMixParlayApiPath = "/MixParlayBetList/NewParlayDetail";

        [SetUp]
        public void SetUp()
        {
            MockSessionData();

            AuthorizationService.HasPermissionOnData(SessionLicenseeId, Arg.Any<int>(), Arg.Any<long>()).Returns(true);
        }

        [Test]
        public async Task Detail_WhenCall_CallBetListApiWithCorrectParameters()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var transId = FakeHelper.Create<long>();
                var custId = FakeHelper.Create<int>();

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(Arg.Any<MixParlayDetailMetaModel>(), MixParlayApiPath, expect);

                // Action
                var actual = await controller.Detail(transId, custId);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    BetListApiClient.Received().PostAsync(
                        MixParlayApiPath,
                        Arg.Is<MixParlayDetailMetaModel>(x => x.CustId == custId && x.TransId == transId),
                        SessionLanguage);
                });
            }
        }

        [Test]
        public async Task NewParlayDetail_WhenCall_CallBetListApiWithCorrectParameters()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var transId = FakeHelper.Create<long>();
                var betTeam = FakeHelper.Create<string>();
                var betCheck = FakeHelper.Create<string>();
                var handicap1 = FakeHelper.Create<decimal>();
                var handicap2 = FakeHelper.Create<decimal>();
                var custId = FakeHelper.Create<int>();

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(Arg.Any<NewParlayDetailMetaModel>(), NewMixParlayApiPath, expect);

                // Action
                var actual = await controller.NewParlayDetail(transId, betTeam, betCheck, handicap1, handicap2, custId);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    BetListApiClient.Received().PostAsync(
                        NewMixParlayApiPath,
                        Arg.Is<NewParlayDetailMetaModel>(x => x.TransId == transId
                                                            && x.BetTeam == betTeam
                                                            && x.BetCheck == betCheck
                                                            && x.Handicap1 == handicap1
                                                            && x.Handicap2 == handicap2
                                                            && x.CustId == custId),
                                                            SessionLanguage);
                });
            }
        }

        private MixParlayBetListController CreateController()
        {
            return new MixParlayBetListController(
                SessionService,
                ProductService,
                LangService,
                AuthorizationService,
                BetListApiClient,
                BalanceUpDataAccess);
        }
    }
}