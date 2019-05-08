namespace Fanex.Athena.Controllers.TotalBets.UnitTests
{
    using System.Collections.Generic;
    using System.Linq;
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
    public class LicenseeWinLossReportControllerTest : CultureBaseControllerHelperTest
    {
        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            SetUpDefaultFakeData();
        }

        [Test]
        public void Index_WhenGetRealLicensee_ReturnCorrectViewResult()
        {
            // Arrange
            var reportSettingService = Substitute.For<IReportSettingService>();
            reportSettingService.GetSetting(PermissionKeys.ReportLicenseeWinLoss).Returns(new ReportSetting());

            AppSettings.FakeLicenseeList.Returns(Enumerable.Empty<int>());

            using (var controller = CreateController(reportSettingService))
            {
                // Action
                var viewResult = controller.Index() as ViewResult;
                var viewModel = viewResult.Model as LicenseeWinLossViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    StringAssert.Contains("Report/LicenseeWinLoss/Main.cshtml", viewResult.ViewName);
                    Assert.That(viewModel.Param.LicenseeId, Is.EqualTo(SessionService.LicenseeSession.LicenseeId));
                    Assert.That(viewModel.Param.DrawFilter, Is.EqualTo(DrawFilterType.Normal));
                    Assert.That(viewModel.Param.ReportBy, Is.EqualTo(ReportByType.Daily));
                });
            }
        }

        [Test]
        public void Index_WhenGetFakeLicensee_ReturnCorrectViewResult()
        {
            // Arrange
            var reportSettingService = Substitute.For<IReportSettingService>();
            reportSettingService.GetSetting(PermissionKeys.ReportLicenseeWinLoss).Returns(new ReportSetting { BaseCurrencies = "USD,MYR", TimeZone = 8 });

            AppSettings.FakeLicenseeList.Returns(new[] { DefaultLicenseeSession.LicenseeId });

            using (var controller = CreateController(reportSettingService))
            {
                // Action
                var viewResult = controller.Index() as ViewResult;
                var viewModel = viewResult.Model as SpecialLicenseeWinLossViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    StringAssert.Contains("Report/SpecialLicenseeWinLoss/Main.cshtml", viewResult.ViewName);
                    Assert.That(viewModel.Param.ReportBy, Is.EqualTo(ReportByType.Daily));
                    Assert.That(string.Join(",", viewModel.BaseCurrencyList.Values), Is.EqualTo("USD"));
                });
            }
        }

        private LicenseeWinLossReportController CreateController(IReportSettingService reportSettingService)
        {           
            var productService = Substitute.For<IProductService>();
            productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.LicenseeWinLoss,
                true).Returns(new ProductAccess(new List<Product>()));
            return new LicenseeWinLossReportController(
                LangService,
                SessionService,
                AppSettings,
                productService,
                reportSettingService);
        }
    }
}