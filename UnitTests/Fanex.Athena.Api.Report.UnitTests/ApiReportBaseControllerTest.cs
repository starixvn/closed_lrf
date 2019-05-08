namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using Base.UnitTests;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Session.Model;

    public class ApiReportBaseControllerTest : BaseApiControllerHelperTest
    {
        private ApiReportBaseController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _controller = Substitute.ForPartsOf<ApiReportBaseController>(SessionService, ProductService, LangService);
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _controller = null;
        }

        [TestCase(BaseCurrencyType.Gbp, true)]
        [TestCase(BaseCurrencyType.Eur, true)]
        [TestCase(100, true)]
        [TestCase(101, false)]
        [TestCase(-4, false)]
        public void IsValidRequest_WhenCall_ReturnCorrectResult(int metaModelCurrencyId, bool expectedResult)
        {
            // Arrange
            var userSession = new UserSession
            {
                CurrencyList = new Dictionary<int, string> { { 100, "AMC" } }
            };
            StubUserSessionData(userSession);
            var metaModel = new BaseMetaModel
            {
                CurrencyId = metaModelCurrencyId
            };

            // Action
            var result = _controller.IsValidRequest(metaModel.CurrencyId);

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [TestCase("SBX")]
        [TestCase("NGX")]
        [TestCase("SBX,NGX")]
        public void CheckValidProducts_ValidProducts_DoesNotThrowException(string productCodeList)
        {
            // Arrange
            MockSessionData();
            const string FunctionKey = "ACBdfsd";
            var productList = new List<Product>
            {
                new Product { ProductCode = "SBX" },
                new Product { ProductCode = "NGX" }
            };
            var productAccess = new ProductAccess(productList);
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), FunctionKey, true).Returns(productAccess);

            // Action
            TestDelegate testDelegate = () => _controller.CheckValidProducts(FunctionKey, productCodeList);

            // Assert
            Assert.That(testDelegate, Throws.Nothing);
        }

        [TestCase("SBX,NGX,XXX")]
        [TestCase("XXX")]
        [TestCase("XXX,YYY")]
        public void CheckValidProducts_InvalidProduct_ThrowException(string productCodeList)
        {
            // Arrange
            MockSessionData();
            const string FunctionKey = "ACBdfsd";
            var productList = new List<Product>
            {
                new Product { ProductCode = "SBX" },
                new Product { ProductCode = "NGX" }
            };
            var productAccess = new ProductAccess(productList);
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), FunctionKey, true).Returns(productAccess);

            // Action
            TestDelegate testDelegate = () => _controller.CheckValidProducts(FunctionKey, productCodeList);

            // Assert
            Assert.Throws<ArgumentException>(testDelegate, "Invalid product: XXX");
        }

        [TestCase("")]
        [TestCase(null)]
        public void CheckValidProducts_NullProduct_ThrowException(string productCodeList)
        {
            // Arrange
            MockSessionData();

            // Action
            TestDelegate testDelegate = () => _controller.CheckValidProducts("any string", productCodeList);

            // Assert
            Assert.Throws<ArgumentNullException>(testDelegate);
        }
    }
}