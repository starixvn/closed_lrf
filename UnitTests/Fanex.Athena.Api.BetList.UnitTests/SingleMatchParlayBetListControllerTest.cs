namespace Fanex.Athena.Api.BetList.UnitTests
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using Model.BetList.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    public class SingleMatchParlayBetListControllerTest : ApiBetListBaseControllerHelperTest
    {
        private const string ApiPath = "/SingleMatchParlayBetList/Detail";
        
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
                var status = FakeHelper.Create<string>();

                var expect = new HttpResponseMessage();
                StubBetListApiPostAsync(Arg.Any<SingleMatchParlayDetailMetaModel>(), ApiPath, expect);

                // Action
                var actual = await controller.Detail(transId, custId, status);

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(expect, Is.EqualTo(actual));
                    BetListApiClient.Received().PostAsync(ApiPath, Arg.Is<SingleMatchParlayDetailMetaModel>(x => x.CustId == custId && x.TransId == transId && x.Status == status));
                });
            }
        }

        private SingleMatchParlayBetListController CreateController()
        {
            return new SingleMatchParlayBetListController(
                SessionService,
                ProductService,
                LangService,
                AuthorizationService,
                BetListApiClient,
                BalanceUpDataAccess);
        }
    }
}