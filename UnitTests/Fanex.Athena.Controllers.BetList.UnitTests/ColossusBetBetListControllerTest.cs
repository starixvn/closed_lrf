namespace Fanex.Athena.Controllers.BetList.UnitTests
{
    using System;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    public class ColossusBetBetListControllerTest : BetListBaseControllerHelperTest
    {
        [SetUp]
        public void SetUp()
        {
            SetUpDefaultFakeData();
        }

        [Test]
        public async Task Detail_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Arrang
                var metaModel = new ColossusBetDetailMetaModel();

                StubGetData(new ColossusBetDetailViewModel());

                // Action
                var result = await controller.Detail(metaModel) as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/ColossusBetDetail/Main.cshtml"));
            }
        }

        [Test]
        public async Task Detail_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrang
                var exception = new Exception();
                var metaModel = new ColossusBetDetailMetaModel();

                var expected = FakeHelper.Create<ColossusBetDetailViewModel>();
                StubGetData(expected);

                // Action
                var result = await controller.Detail(metaModel) as ViewResult;
                var viewModel = (ColossusBetDetailViewModel)result.Model;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewModel.IframeUrl, Is.EqualTo(expected.IframeUrl));
                    Assert.That(metaModel.UserId, Is.EqualTo(DefaultUserSession.UserId));
                });
            }
        }

        private void StubGetData(ColossusBetDetailViewModel data)
        {
            BetListApiClient.PostAsync<ColossusBetDetailViewModel>(
                "/ColossusBetBetList/Detail",
                Arg.Any<object>(),
                SessionService.UserSession.Language).Returns(Task.FromResult(data));
        }

        private ColossusBetBetListController CreateController()
        {
            return Substitute.ForPartsOf<ColossusBetBetListController>(
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