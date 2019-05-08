namespace Fanex.Athena.Controllers.Report.UnitTests
{
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Script.Serialization;
    using Constant.DataDomain;
    using Fanex.Athena.Controllers.Base.UnitTests;
    using Fanex.Athena.Model.Core.DataDomain;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Model.Core.MetaModel.Product;
    using Fanex.Athena.Model.Report.ViewModel;
    using Fanex.Athena.Service.Core.Common.Interfaces;
    using Fanex.Athena.Service.Report.Interfaces;
    using NSubstitute;
    using NUnit.Framework;
    using Session.Enum;

    [TestFixture]
    public class SubsidiaryPerformanceReportControllerTest : CultureBaseControllerHelperTest
    {
        private const string FakeProductCode = "TestingCode";
        private const string FakeProductName = "Testing Product Name";

        private static readonly ReadOnlyCollection<string> BaseCurrencyList = new ReadOnlyCollection<string>(
            new List<string> { "EUR", "USD", "GBP", "MYR", "CNY", "THB", "IDR" });

        private ISubsidiaryService _subsidiaryService;
        private ISubsidiaryPerformanceService _service;
        private JavaScriptSerializer _serializer;

        [SetUp]
        public void SetUp()
        {
            SetUpDefaultFakeData();

            _subsidiaryService = Substitute.For<ISubsidiaryService>();
            _service = Substitute.For<ISubsidiaryPerformanceService>();
            _serializer = new JavaScriptSerializer();
        }

        [Test]
        public void Index_IsManageableSubsidiaryIsTrue_CallServiceToGetSubsidiaryList()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var operatorList = new List<string> { "New York", "India", "Irag", "China" };
                _subsidiaryService.GetSubsidiaryNames().Returns(operatorList);

                SessionService.UserSession.Returns(new Session.Model.UserSession
                {
                    IsManageableSubsidiary = true,
                    Language = DefaultUserSession.Language
                });

                var expectedViewModelData = new SubsidiaryPerformanceViewModel
                {
                    ProductOptionList = new List<ProductOption>
                    {
                        new ProductOption { Code = FakeProductCode, Name = FakeProductName, Status = true }
                    },
                    SubsidiaryList = operatorList.Select(x => new CheckedItem { Name = x, Checked = true })
                };

                var expectedModel = _serializer.Serialize(expectedViewModelData);
                var expectedViewName = "~/Views/Desktop/Report/SubsidiaryPerformance/Main.cshtml";
                HttpContext.Current = GetHttpContext();

                // Action
                var viewResult = controller.Index() as ViewResult;
                var modelResult = _serializer.Serialize(viewResult.Model);

                // Assert
                Assert.That(viewResult.ViewName, Is.EqualTo(expectedViewName));
                Assert.That(modelResult, Is.EqualTo(expectedModel));
            }
        }

        [Test]
        public void Index_IsManageableSubsidiaryIsFalse_SubsidiaryListIsNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                SessionService.UserSession.Returns(new Session.Model.UserSession
                {
                    IsManageableSubsidiary = false,
                    Language = DefaultUserSession.Language
                });

                var expectedViewModelData = new SubsidiaryPerformanceViewModel
                {
                    SubsidiaryList = null,
                    ProductOptionList = new List<ProductOption>
                    {
                        new ProductOption { Code = FakeProductCode, Name = FakeProductName, Status = true }
                    }
                };

                var expectedModel = _serializer.Serialize(expectedViewModelData);
                var expectedViewName = "~/Views/Desktop/Report/SubsidiaryPerformance/Main.cshtml";
                HttpContext.Current = GetHttpContext();

                // Action
                var viewResult = controller.Index() as ViewResult;
                var modelResult = _serializer.Serialize(viewResult.Model);

                // Assert
                Assert.That(viewResult.ViewName, Is.EqualTo(expectedViewName));
                Assert.That(modelResult, Is.EqualTo(expectedModel));
            }
        }

        private static HttpContext GetHttpContext()
        {
            return new HttpContext(
                new HttpRequest(null, "http://tempuri.org", null),
                new HttpResponse(null));
        }

        private SubsidiaryPerformanceReportController CreateController()
        {
            var productService = Substitute.For<IProductService>();
            productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.SubsidiaryPerformance,
                true).Returns(new ProductAccess(new List<Product> { new Product { ProductCode = FakeProductCode, ProductName = FakeProductName } }));

            return new SubsidiaryPerformanceReportController(
                LangService,
                SessionService,
                AppSettings,
                productService,
                _subsidiaryService);
        }
    }
}