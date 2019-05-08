namespace Fanex.Athena.Controllers.Report.UnitTests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Base.UnitTests;
    using Model.Core.DTO.Common;
    using Model.Report.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Common.Interfaces;

    public class LicenseeWinLossByTimeZoneReportControllerTest : CultureBaseControllerHelperTest
    {
        private IProductService _productService;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _productService = Substitute.For<IProductService>();

            StubUserSessionData(DefaultUserSession);
            StubLicenseeSessionData(DefaultLicenseeSession);
        }

        [Test]
        public void Index_WhenGet_ReturnCorrectViewName()
        {
            using (var controller = CreateController())
            {
                // Action
                var viewResult = controller.Index() as ViewResult;

                // Assert
                Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/Report/LicenseeWinLossByTimeZone/Main.cshtml"));
            }
        }

        [Test]
        public void Index_WhenGet_ReturnCorrectViewModel()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var productList = new List<Product>
                {
                    new Product
                    {
                       ProductCode = Product.AB
                    }
                };

                _productService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<string>(), true)
                    .Returns(new ProductAccess(productList));

                // Action
                var viewResult = controller.Index() as ViewResult;
                var model = (LicenseeWinLossByTimeZoneViewModel)viewResult.Model;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(model.ProductOptionList.Count, Is.EqualTo(productList.Count));
                    Assert.That(model.ProductOptionList.Select(x => x.Code).ToArray(), Is.EqualTo(productList.Select(x => x.ProductCode).ToArray()));
                });
            }
        }

        private LicenseeWinLossByTimeZoneReportController CreateController()
        {
            var controller = Substitute.ForPartsOf<LicenseeWinLossByTimeZoneReportController>(
                LangService,
                SessionService,
                AppSettings,
                _productService);
            return controller;
        }
    }
}