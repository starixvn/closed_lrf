namespace Fanex.Athena.Controllers.TotalBets.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Base.UnitTests;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using Model.Report.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using Report;
    using Service.Core.Common.Interfaces;
    using Service.Core.Configuration.Interfaces;

    [TestFixture]
    public class CustomerWinLossReportControllerTest : CultureBaseControllerHelperTest
    {
        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            SetUpDefaultFakeData();
        }

        [Test]
        public void Index_WhenGet_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Action
                var viewResult = controller.Index() as ViewResult;
                var viewModel = viewResult.Model as CustomerWinLossViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/Report/CustomerWinLoss/Main.cshtml"));
                    Assert.That(viewModel.IsHistory, Is.False);
                });
            }
        }

        [Test]
        public void History_WhenGet_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Action
                var viewResult = controller.History() as ViewResult;
                var viewModel = viewResult.Model as CustomerWinLossViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/Report/CustomerWinLoss/Main.cshtml"));
                    Assert.That(viewModel.IsHistory, Is.True);
                });
            }
        }

        private CustomerWinLossReportController CreateController()
        {
            var reportSettingService = Substitute.For<IReportSettingService>();
            reportSettingService.GetSetting(PermissionKeys.ReportCustomerWinLoss).Returns(new ReportSetting());

            var productService = Substitute.For<IProductService>();
            productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.CustomerWinLoss,
                true).Returns(new ProductAccess(new List<Product>()));

            return new CustomerWinLossReportController(
                LangService,
                SessionService,
                AppSettings,
                productService,
                reportSettingService);
        }
    }
}