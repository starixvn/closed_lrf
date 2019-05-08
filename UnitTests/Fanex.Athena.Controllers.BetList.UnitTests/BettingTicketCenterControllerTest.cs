namespace Fanex.Athena.Controllers.BetList.UnitTests
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Base.UnitTests;
    using DataAccess.Core.Configuration.Interfaces;
    using Model.BetList.ViewModel;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Common.Interfaces;
    using UnitTest.Common.Helpers;

    public class BettingTicketCenterControllerTest : CultureBaseControllerHelperTest
    {
        private static readonly DateTime BalanceUpDate = new DateTime(2018, 11, 2);

        private IProductService _productService;

        private IBalanceUpDataAccess _balanceUpDataAccess;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _productService = Substitute.For<IProductService>();
            _balanceUpDataAccess = Substitute.For<IBalanceUpDataAccess>();
            _balanceUpDataAccess.GetBalanceUp().Returns(new BalanceUp
            {
                BalanceUpDay = BalanceUpDate
            });

            SetUpDefaultFakeData();
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _productService = null;
        }

        [Test]
        public void RefNo_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Action
                var result = controller.RefNo() as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/BettingTicketCenter/RefNo.cshtml"));
            }
        }

        [Test]
        public void RefNo_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Action
                var result = controller.RefNo() as ViewResult;

                // Assert
                Assert.That(result.Model, Is.EqualTo(DefaultLicenseeSession.IsAllowedCustomerComm));
            }
        }

        [Test]
        public void Running_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var historyDate = FakeHelper.Create<DateTime>();
                AppSettings.HistoryDate.Returns(historyDate);

                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenterRunning,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.Running() as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/BettingTicketCenter/Running.cshtml"));
            }
        }

        [Test]
        public void Running_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenterRunning,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.Running() as ViewResult;
                var viewModel = result.Model as BettingTicketCenterViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewModel.CurrencyList, Is.EqualTo(DefaultUserSession.CurrencyList));
                    Assert.That(viewModel.ProductOptionList.Count(), Is.EqualTo(productCodes.Count));
                    Assert.That(viewModel.IsAllowedCustomerComm, Is.EqualTo(DefaultLicenseeSession.IsAllowedCustomerComm));
                });
            }
        }

        [Test]
        public void SingleCustomer_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var historyDate = FakeHelper.Create<DateTime>();
                AppSettings.HistoryDate.Returns(historyDate);

                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenter,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.SingleCustomer() as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/BettingTicketCenter/SingleCustomer.cshtml"));
            }
        }

        [Test]
        public void SingleCustomer_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenter,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.SingleCustomer() as ViewResult;
                var viewModel = result.Model as BettingTicketCenterViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewModel.LiveStatusList, Is.Not.Empty);
                    Assert.That(viewModel.StatusList, Is.Not.Empty);
                    Assert.That(viewModel.PlatformList, Is.Not.Empty);
                    Assert.That(viewModel.ProductOptionList.Count(), Is.EqualTo(productCodes.Count));
                    Assert.That(viewModel.IsAllowedCustomerComm, Is.EqualTo(DefaultLicenseeSession.IsAllowedCustomerComm));
                });
            }
        }

        [Test]
        public void MultipleCustomers_WhenCall_ReturnCorrectView()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var historyDate = FakeHelper.Create<DateTime>();
                AppSettings.HistoryDate.Returns(historyDate);

                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenterMultiCustomers,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.MultipleCustomers() as ViewResult;

                // Assert
                Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/BetList/BettingTicketCenter/MultiCustomer.cshtml"));
            }
        }

        [Test]
        public void MultipleCustomers_WhenCall_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var productCodes = FakeHelper.CreateMany<Product>(3).ToList();
                _productService.GetProductAccess(
                    DefaultLicenseeSession.LicenseeId,
                    DefaultUserSession.Language,
                    FunctionNames.BettingTicketCenterMultiCustomers,
                    true).Returns(new ProductAccess(productCodes));

                // Action
                var result = controller.MultipleCustomers() as ViewResult;
                var viewModel = result.Model as BettingTicketCenterViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewModel.CurrencyList, Is.EqualTo(DefaultUserSession.CurrencyList));
                    Assert.That(viewModel.LiveStatusList, Is.Not.Empty);
                    Assert.That(viewModel.StatusList, Is.Not.Empty);
                    Assert.That(viewModel.ProductOptionList.Count(), Is.EqualTo(productCodes.Count));
                    Assert.That(viewModel.MinDate, Is.EqualTo(BalanceUpDate));
                    Assert.That(viewModel.IsAllowedCustomerComm, Is.EqualTo(DefaultLicenseeSession.IsAllowedCustomerComm));
                });
            }
        }

        private BettingTicketCenterController CreateController()
        {
            var controller = Substitute.ForPartsOf<BettingTicketCenterController>(
                LangService,
                SessionService,
                AppSettings,
                _productService,
                _balanceUpDataAccess);
            return controller;
        }
    }
}