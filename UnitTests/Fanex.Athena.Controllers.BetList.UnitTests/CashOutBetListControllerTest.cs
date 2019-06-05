namespace Fanex.Athena.Controllers.BetList.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Model.BetList.DTO;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using NSubstitute;
    using NUnit.Framework;

    internal class CashOutBetListControllerTest : BetListBaseControllerHelperTest
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
                // Arrange
                var metaModel = new CashOutBetListDetailMetaModel();

                StubGetBetListData(new CashOutBetListDetailViewModel
                {
                    OriginalTicketText = new TicketText(),
                    CashOutTicketList = new List<CashOutTicket>()
                });

                // Action
                var result = await controller.Detail(metaModel) as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/CashOutDetail/Main.cshtml"));
            }
        }

        [Test]
        public async Task Detail_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrang
                var metaModel = new CashOutBetListDetailMetaModel();

                StubGetBetListData(new CashOutBetListDetailViewModel
                {
                    OriginalTicketText = new TicketText(),
                    CashOutTicketList = new List<CashOutTicket>(),
                    IsCashOut = true,
                    IsHighlightOriginalTicket = true
                });

                // Action
                var result = await controller.Detail(metaModel) as ViewResult;
                var model = (CashOutBetListDetailViewModel)result.Model;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(model.IsCashOut, Is.True);
                    Assert.That(model.IsHighlightOriginalTicket, Is.True);
                    Assert.That(model.CashOutTicketList, Is.Empty);
                });
            }
        }

        private void StubGetBetListData(CashOutBetListDetailViewModel cashOutBetListDetail)
        {
            BetListApiClient.PostAsync<CashOutBetListDetailViewModel>(
                "/CashOutBetList/Detail",
                Arg.Any<object>(),
                SessionService.UserSession.Language).Returns(Task.FromResult(cashOutBetListDetail));
        }

        private CashOutBetListController CreateController()
        {
            return Substitute.ForPartsOf<CashOutBetListController>(
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