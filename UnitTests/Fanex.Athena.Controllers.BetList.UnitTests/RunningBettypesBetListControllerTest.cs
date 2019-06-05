namespace Fanex.Athena.Controllers.BetList.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Constant.DataDomain;
    using Model.BetList.MetaModel;
    using Model.BetList.ViewModel;
    using Model.Core.DTO.Common;
    using NSubstitute;
    using NUnit.Framework;
    using Resources;

    public class RunningBettypesBetListControllerTest : BetListBaseControllerHelperTest
    {
        private const string AgentListXml = "<xml/>";

        private string _mixParlayBetType = $"{(int)BetType.CombinationMixParlay},{(int)BetType.SingleMatchParlay}";

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>())
                .Returns(new ProductAccess(new List<Product> { new Product { ProductCode = Product.AB } }));

            SetUpDefaultFakeData();

            StubGetValueAppSettings("BaseUsdLicensees", "usd");
        }

        [Test]
        public async Task MixParlay_WhenCall_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    MultipleBettype = _mixParlayBetType
                };

                // Action
                var result = await controller.MixParlay(metaModel) as ViewResult;

                // Assert
                AssertViewResult(Menu.Menu_12, "TotalBetsMixParlay", metaModel, result);
            }
        }

        [Test]
        public async Task DoubleChange_WhenCall_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    MultipleBettype = "24,151,186,410,431"
                };

                // Action
                var result = await controller.DoubleChange(metaModel) as ViewResult;

                // Assert
                AssertViewResult(ViewResources.DoubleChance, "TotalBetsDoubleChance", metaModel, result);
            }
        }

        [Test]
        public async Task BONTeamToScore_WhenCall_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    MultipleBettype = "26,145,146,170,188,427,433"
                };

                // Action
                var result = await controller.BONTeamToScore(metaModel) as ViewResult;

                // Assert
                AssertViewResult(ViewResources.BONTeamToScore, "TotalBetsBON", metaModel, result);
            }
        }

        [Test]
        public async Task MixParlay_ExportExcel_InvalidCurrency_ReturnEmptyResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    IsExportExcel = true,
                    CurrencyId = -1000,
                    MultipleBettype = _mixParlayBetType
                };

                controller.When(x => x.EmptyExcel()).DoNotCallBase();

                // Action
                await controller.MixParlay(metaModel);

                // Assert
                controller.Received().EmptyExcel();
            }
        }

        [TestCase("USD", null, "USD")]
        [TestCase("USD", "eur", "EUR")]
        public async Task MixParlay_ExportExcel_PassCorrectParam(string currency, string baseCurrency, string expectedCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    IsExportExcel = true,
                    CurrencyId = 0,
                    CurrencyName = currency,
                    BaseCurrency = baseCurrency,
                    MultipleBettype = _mixParlayBetType
                };

                CacheRefAdapter.GetBettype(((int)BetType.CombinationMixParlay).ToString()).Returns("MixParlay");

                var currencyTitle = string.Format(ViewResources.Viewin, expectedCurrency);
                var expectedTitle = "MixParlay - " + currencyTitle;

                SetUpForExportingExcel(metaModel, controller);

                // Action
                await controller.MixParlay(metaModel);

                // Assert
                await AssertExcelParameters(expectedTitle, "Lrf_BetList_SelRunningByBettypeList", controller);
            }
        }

        [TestCase("USD", null, "USD")]
        [TestCase("USD", "eur", "EUR")]
        public async Task DoubleChange_ExportExcel_PassCorrectParam(string currency, string baseCurrency, string expectedCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    IsExportExcel = true,
                    CurrencyId = 0,
                    CurrencyName = currency,
                    BaseCurrency = baseCurrency,
                    MultipleBettype = "24,151,186,410,431"
                };

                CacheRefAdapter.GetBettype("24").Returns("DoubleChange");

                var currencyTitle = string.Format(ViewResources.Viewin, expectedCurrency);
                var expectedTitle = "DoubleChange - " + currencyTitle;

                SetUpForExportingExcel(metaModel, controller);

                // Action
                await controller.DoubleChange(metaModel);

                // Assert
                await AssertExcelParameters(expectedTitle, "Lrf_BetList_SelRunningByBettypeList", controller);
            }
        }

        [TestCase("USD", null, "USD")]
        [TestCase("USD", "eur", "EUR")]
        public async Task BONTeamToScore_ExportExcel_PassCorrectParam(string currency, string baseCurrency, string expectedCurrency)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new BetListExcelMetaModel
                {
                    IsExportExcel = true,
                    CurrencyId = 0,
                    CurrencyName = currency,
                    BaseCurrency = baseCurrency,
                    MultipleBettype = "26,145,146,170,188,427,433"
                };

                CacheRefAdapter.GetBettype("26").Returns("BONTeamToScore");

                var currencyTitle = string.Format(ViewResources.Viewin, expectedCurrency);
                var expectedTitle = "BONTeamToScore - " + currencyTitle;

                SetUpForExportingExcel(metaModel, controller);

                // Action
                await controller.BONTeamToScore(metaModel);

                // Assert
                await AssertExcelParameters(expectedTitle, "Lrf_BetList_SelRunningByBettypeList", controller);
            }
        }

        private void SetUpForExportingExcel(BetListMetaModel metaModel, RunningBettypesBetListController controller)
        {
            SessionService.GenerateAgentListXml(metaModel.CurrencyId, false).Returns(AgentListXml);

            controller.When(async x => await x.ProcessExportExcel(
                Arg.Any<BetListExcelMetaModel>(),
                Arg.Any<string>(),
                Arg.Any<string>())).DoNotCallBase();
        }

        private async Task AssertExcelParameters(string expectedTitle, string uspKey, RunningBettypesBetListController controller)
        {
            await controller.Received().ProcessExportExcel(
                Arg.Is<BetListExcelMetaModel>(x => x.ShowingOption.CustomerCommVisible == DefaultLicenseeSession.IsAllowedCustomerComm
                    && x.Title == expectedTitle
                    && x.UspKey == uspKey
                    && string.Join(",", x.HiddenColumns) == "7,8,9"
                    && x.LicenseeId == DefaultLicenseeSession.LicenseeId
                    && x.IsShowSumStake
                    && x.AgentListXml == AgentListXml),
                "RunningBetList",
                null);
        }

        private void AssertViewResult(string reportTitle, string userGuide, BetListMetaModel metaModel, ViewResult viewResult)
        {
            var viewModel = (BetListBaseViewModel)viewResult.Model;

            Assert.Multiple(() =>
            {
                Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/BetList/RunningBetListMultipleBettypes/Main.cshtml"));
                Assert.That(viewModel.ShowEmptyContent, Is.True);
                Assert.That(viewModel.Param.BetType, Is.EqualTo(metaModel.BetType));
                Assert.That(viewModel.Param.MultipleBettype, Is.EqualTo(metaModel.MultipleBettype));
                Assert.That(viewResult.ViewBag.ReportTitle, Is.EqualTo(reportTitle));
                Assert.That(viewResult.ViewBag.UserGuideName, Is.EqualTo(userGuide));
                AssertDefaultBetListViewModel(viewModel.Param, metaModel);
            });
        }

        private RunningBettypesBetListController CreateController()
        {
            return Substitute.ForPartsOf<RunningBettypesBetListController>(
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