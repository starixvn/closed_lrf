namespace Fanex.Athena.Controllers.TotalBets.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Base.UnitTests;
    using Excel.Base.Entities;
    using Excel.Report;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using Report;
    using Service.Core.Common.Interfaces;
    using Service.Report.Interfaces;
    using Web.ResultExtension;

    [TestFixture]
    public class TurnoverReportControllerTest : CultureBaseControllerHelperTest
    {
        private const int CurrencyId = 999;

        private const string AgentListXml = "<abc>";

        private ITurnoverService _turnoverService;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            _turnoverService = Substitute.For<ITurnoverService>();

            base.FixtureSetUp();

            SetUpDefaultFakeData();

            SessionService.GenerateAgentListXml(CurrencyId).Returns(AgentListXml);
        }

        [TearDown]
        public void TearDown()
        {
            _turnoverService.ClearReceivedCalls();
        }

        [Test]
        public void Index_WhenGet_ReturnCorrectViewResult()
        {
            using (var controller = CreateController("SB,BA"))
            {
                // Action
                var viewResult = controller.Index() as ViewResult;
                var viewModel = viewResult.Model as TurnoverViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/Report/Turnover/Main.cshtml"));
                    Assert.That(viewModel.Param.LicenseeId, Is.EqualTo(SessionService.LicenseeSession.LicenseeId));
                    Assert.That(viewModel.Param.UserId, Is.EqualTo(SessionService.UserSession.UserId));
                    Assert.That(viewModel.Param.ProductOptions.Any(x => x.Code == Product.BA), Is.False);
                    Assert.That(viewModel.CurrencyList, Is.EqualTo(SessionService.UserSession.CurrencyList));
                });
            }
        }

        [TestCase(true, " External ID ", null)]
        [TestCase(true, "abcd", "abcd")]
        [TestCase(true, "   ", null)]
        [TestCase(false, "  External ID or System ID ", null)]
        [TestCase(false, "External ID", "External ID")]
        [TestCase(false, "   ", null)]
        public async Task Excel_WhenCall_AssignCorrectUsername(bool isFakeLicensee, string inputUserName, string expectedUserName)
        {
            using (var controller = CreateController())
            {
                // Arrange
                MockCreatingExcel(controller);
                var licenseeId = SessionService.LicenseeSession.LicenseeId;
                AppSettings.FakeLicenseeList.Returns(new[] { isFakeLicensee ? licenseeId : -1 });
                var metaModel = new TurnoverMetaModel
                {
                    Username = inputUserName
                };

                // Action
                await controller.Excel(metaModel);

                // Assert
                Assert.That(metaModel.Username, Is.EqualTo(expectedUserName));
            }
        }

        [Test]
        public async Task Excel_WhenCall_ReturnCorrectResult()
        {
            using (var controller = CreateController("BA"))
            {
                // Arrange
                const string CurrencyName = "SSU";
                MockCreatingExcel(controller);
                var metaModel = new TurnoverMetaModel
                {
                    BaseCurrency = "UUS",
                    CurrencyName = CurrencyName,
                    CurrencyId = CurrencyId
                };
                var expectedData = new List<TurnoverDTO>
                    {
                        new TurnoverDTO()
                    };
                var expectedTotalData = new TurnoverDTO();
                _turnoverService.GetDataList(metaModel).Returns(Task.FromResult<IList<TurnoverDTO>>(expectedData));
                _turnoverService.SumTotalData(expectedData).Returns(expectedTotalData);

                // Action
                var result = await controller.Excel(metaModel);

                // Assert
                Assert.Multiple(() =>
                {
                    controller.Received(1).CreateExcel(
                        Arg.Any<string>(),
                        Arg.Is<TurnoverViewModel>(x =>
                            x.DataList == expectedData &&
                            x.TotalData == expectedTotalData),
                        Arg.Is<ShowingOption>(x => x.BAVisible),
                        false);
                    Assert.That(result, Is.InstanceOf<ExcelResult>());
                });
            }
        }

        [Test]
        public void Excel_InvalidProductCode_ThowArgumentException()
        {
            using (var controller = CreateController("SB"))
            {
                // Arrange
                MockCreatingExcel(controller);
                var metaModel = new TurnoverMetaModel
                {
                    BaseCurrency = "UUS",
                    CurrencyId = CurrencyId,
                    ProductOptions = new List<ProductOption>
                    {
                        new ProductOption { Code = "SB", Status = true },
                        new ProductOption { Code = "Invalid", Status = true }
                    }
                };
                var expectedData = new List<TurnoverDTO>
                    {
                        new TurnoverDTO()
                    };
                var expectedTotalData = new TurnoverDTO();
                _turnoverService.GetDataList(metaModel).Returns(Task.FromResult<IList<TurnoverDTO>>(expectedData));
                _turnoverService.SumTotalData(expectedData).Returns(expectedTotalData);

                var expectedProduct = new List<ProductOption>
                {
                    new ProductOption { Code = "SB", Status = true }
                };

                // Action
                AsyncTestDelegate testDelegate = async () => await controller.Excel(metaModel);

                // Assert
                Assert.ThrowsAsync<ArgumentException>(testDelegate);
            }
        }

        private static void MockCreatingExcel(TurnoverReportController controller)
        {
            var excel = Substitute.ForPartsOf<TurnoverExcel>();
            excel.When(x => x.Export()).DoNotCallBase();
            controller.CreateExcel(string.Empty, null, null, false).ReturnsForAnyArgs(excel);
        }

        private TurnoverReportController CreateController(string productCodeList = null)
        {
            var productList = string.IsNullOrEmpty(productCodeList) ?
                new List<Product>() :
                productCodeList.Split(',').Select(x => new Product
                {
                    ProductCode = x
                });
            var productService = Substitute.For<IProductService>();
            productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.Turnover,
                true).Returns(new ProductAccess(productList.ToList()));
            var controller = Substitute.ForPartsOf<TurnoverReportController>(
                LangService,
                SessionService,
                AppSettings,
                productService,
                _turnoverService);
            controller.WhenForAnyArgs(x => x.CreateExcel(string.Empty, null, null, false)).DoNotCallBase();
            return controller;
        }
    }
}