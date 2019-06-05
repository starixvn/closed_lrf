namespace Fanex.Athena.Controllers.BetList.UnitTests
{
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    internal class SystemParlayBetListControllerTest : BetListBaseControllerHelperTest
    {
        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            SetUpDefaultFakeData();
        }

        [Test]
        public async Task Detail_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Arrang
                var metaModel = new SystemParlayDetailMetaModel();

                BetListApiClient.PostAsyncString(
                    "/SystemParlayBetList/Detail",
                    metaModel,
                    SessionService.UserSession.Language).Returns(Task.FromResult(string.Empty));

                // Action
                var result = await controller.Detail(metaModel) as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/SystemParlayDetail/Main.cshtml"));
            }
        }

        [Test]
        public async Task Detail_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrang
                var metaModel = new SystemParlayDetailMetaModel();

                var systemParlayText = FakeHelper.Create<string>();
                BetListApiClient.PostAsyncString(
                    "/SystemParlayBetList/Detail",
                    metaModel,
                    SessionService.UserSession.Language).Returns(Task.FromResult(systemParlayText));

                // Action
                var result = (await controller.Detail(metaModel)) as ViewResult;
                var model = (SystemParlayDetailViewModel)result.Model;

                // Assert
                Assert.That(model.DetailText, Is.EqualTo(systemParlayText));
            }
        }

        private SystemParlayBetListController CreateController()
        {
            return Substitute.ForPartsOf<SystemParlayBetListController>(
                LangService,
                SessionService,
                AppSettings,
                ProductService,
                BalanceUpDataAccess,
                CacheRefAdapter,
                BetListApiClient);
        }
    }
}