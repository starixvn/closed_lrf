namespace Fanex.Athena.Service.Core.UnitTests.Common
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Xml.Linq;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using NSubstitute;
    using NUnit.Framework;

    [TestFixture]
    public partial class ProductServiceTest
    {
        private const string FunctionAllowedProductsKey = "FunctionAllowedProducts";

        private const string FilterFunctionName = "ActiveCustomerSummary";

        [TestCase(null, "_Default")]
        [TestCase("Test", "Test")]
        public void GetProductAccess_GetAllowedProductsFromCache_HasConfig_ReturnCorrectResult(string functionName, string expectedFunctionName)
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { expectedFunctionName, expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(expectedResult);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, functionName);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
            });
        }

        [Test]
        public void GetProductAccess_GetAllowedProductsFromCache_HasNoConfig_ReturnEmptytResult()
        {
            // Arrange
            var fakeProducts = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { "FakeKey", fakeProducts.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(new List<Product>());

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(fakeProducts.First().ProductID), Is.False);
                Assert.That(result.IsAllow(fakeProducts.Last().ProductID), Is.False);
            });
        }

        [TestCase(null, "_Default")]
        [TestCase("Test", "Test")]
        public void GetProductAccess_GetAllowedProductsFromFile_HasData_ReturnCorrectResultAndUpdateCache(string functionName, string expectedFunctionName)
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { expectedFunctionName, expectedResult.Select(x => x.ProductCode) } });

            _cache.Get<IEnumerable<XElement>>(FunctionAllowedProductsKey).Returns(x => null);
            _cache.When(x => x.Set(Arg.Any<string>(), Arg.Any<IEnumerable<XElement>>())).DoNotCallBase();
            _xmlWrapper.Load(Arg.Any<string>()).Returns(XDocument.Parse(xmlContent));

            SetUpForGetProductListFromCache(expectedResult);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, functionName);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
                _cache.Received().Set(
                    FunctionAllowedProductsKey,
                    Arg.Is<IEnumerable<XElement>>(x => x.First().Attribute("Name").Value == expectedFunctionName));
            });
        }

        [TestCase(null)]
        [TestCase("Test")]
        public void GetProductAccess_GetAllowedProductsFromFile_DataIsEmpty_ReturnEmpty(string functionName)
        {
            // Arrange
            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>>());

            _cache.Get<IEnumerable<XElement>>(FunctionAllowedProductsKey).Returns(x => null);
            _cache.When(x => x.Set(Arg.Any<string>(), Arg.Any<IEnumerable<XElement>>())).DoNotCallBase();
            _xmlWrapper.Load(Arg.Any<string>()).Returns(XDocument.Parse(xmlContent));

            SetUpForGetProductListFromCache(new List<Product>());

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, functionName);

            // Assert
            Assert.That(result.ProductList, Is.Empty);
        }

        [Test]
        public void GetProductAccess_AllowedProductsIsEmpty_ReturnOriginalProducts()
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { "FakeKey", expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(expectedResult);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
            });
        }

        [Test]
        public void GetProductAccess_AllowedProductsIsNotEmpty_ReturnIntersectionOfOriginalAndAllowedProducts()
        {
            // Arrange
            const string FunctionKey = "FakeKey";

            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var productList = new List<Product>
            {
                new Product { ProductID = 300, ProductCode = "CS" },
            };

            productList.AddRange(expectedResult);

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { FunctionKey, expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(productList);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, FunctionKey);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
                Assert.That(result.IsAllow(productList.First().ProductID), Is.False);
            });
        }

        [Test]
        public void GetSingleWalletProductAccess_AllowedProductsIsEmpty_ReturnOriginalProductList()
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "AB" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { "FakeKey", expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(expectedResult);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, null, true);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
            });
        }

        [Test]
        public void GetSingleWalletProductAccess_AllowedProductsIsNotEmpty_ReturnIntersectionOfOriginalAndAllowedProducts()
        {
            // Arrange
            const string FunctionKey = "FakeKey";

            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB", IsOfferedSingleWallet = true },
                new Product { ProductID = 200, ProductCode = "AB", IsOfferedSingleWallet = true },
            };

            var productList = new List<Product>
            {
                new Product { ProductID = 300, ProductCode = "CS", IsOfferedSingleWallet = true },
            };

            productList.AddRange(expectedResult);

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { FunctionKey, expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            SetUpForGetProductListFromCache(productList);

            // Action
            var result = _productService.GetProductAccess(_licenseeId, _languageCode, FunctionKey, true);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
                Assert.That(result.IsAllow(productList.First().ProductID), Is.False);
            });
        }

        [Test]
        public void GetProductAccessForActiveCustomerSummary_DataWasCached_ReturnFromCache()
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "ABC" },
            };

            _cache.Get<IList<Product>>(CacheKey.MemorycacheActiveCustomerSummaryProduct + _licenseeId + _languageCode)
                .Returns(expectedResult);

            // Action
            var result = _productService.GetProductAccessForActiveCustomerSummary(_licenseeId, _languageCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(100), Is.True);
                Assert.That(result.IsAllow(200), Is.True);
            });
        }

        [Test]
        public void GetProductAccessForActiveCustomerSummary_AllowedProductsIsEmpty_ReturnProductAccessList()
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB" },
                new Product { ProductID = 200, ProductCode = "ABC" },
            };

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { "FakeKey", expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            _productDataAccess.GetProductAccessList(_licenseeId, true).Returns(expectedResult);

            _cache.Get<IList<Product>>(CacheKey.MemorycacheActiveCustomerSummaryProduct + _licenseeId + _languageCode)
                .Returns(x => { return null; });

            // Action
            var result = _productService.GetProductAccessForActiveCustomerSummary(_licenseeId, _languageCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(100), Is.True);
                Assert.That(result.IsAllow(200), Is.True);
            });
        }

        [Test]
        public void GetProductAccessForActiveCustomerSummary_AllowedProductsIsNotEmpty_ReturnIntersectionOfOriginalAndAllowedProducts()
        {
            // Arrange
            var expectedResult = new List<Product>
            {
                new Product { ProductID = 100, ProductCode = "SB", IsOfferedSingleWallet = true },
                new Product { ProductID = 200, ProductCode = "AB", IsOfferedSingleWallet = true },
            };

            var productList = new List<Product>
            {
                new Product { ProductID = 300, ProductCode = "CS", IsOfferedSingleWallet = true },
            };

            productList.AddRange(expectedResult);

            var xmlContent = BuildFunctionAllowedProductsXmlString(
                "Test",
                new Dictionary<string, IEnumerable<string>> { { FilterFunctionName, expectedResult.Select(x => x.ProductCode) } });

            SetUpGetAllowedProductsFromCache(xmlContent);

            _productDataAccess.GetProductAccessList(_licenseeId, true).Returns(productList);

            _cache.Get<IList<Product>>(CacheKey.MemorycacheActiveCustomerSummaryProduct + _licenseeId + _languageCode)
                .Returns(x => { return null; });

            // Action
            var result = _productService.GetProductAccessForActiveCustomerSummary(_licenseeId, _languageCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.IsAllow(expectedResult.First().ProductID), Is.True);
                Assert.That(result.IsAllow(expectedResult.Last().ProductID), Is.True);
                Assert.That(result.IsAllow(productList.First().ProductID), Is.False);
            });
        }

        private void SetUpGetAllowedProductsFromCache(string xmlContent)
        {
            _cache.Get<IEnumerable<XElement>>(FunctionAllowedProductsKey).Returns(XDocument.Parse(xmlContent).Descendants(nameof(Function)));
            _cache.When(x => x.Set(Arg.Any<string>(), Arg.Any<IEnumerable<XElement>>())).DoNotCallBase();
        }

        private void SetUpForGetProductListFromCache(IList<Product> expectedResult)
        {
            var cacheKey = CacheKey.MemorycacheCommonProduct + _licenseeId + _languageCode;
            _cache.Get<IList<Product>>(cacheKey).Returns(expectedResult);
        }

        private string BuildFunctionAllowedProductsXmlString(string groupName, IDictionary<string, IEnumerable<string>> functionProducts)
        {
            var stringBuilder = new StringBuilder();
            stringBuilder.Append($"<Root><Group Name=\"{groupName}\">");
            foreach (var function in functionProducts)
            {
                stringBuilder.Append($"<Function Name = \"{function.Key}\" Product=\"{string.Join(",", function.Value)}\"></Function>");
            }

            stringBuilder.Append("</Group></Root>");

            return stringBuilder.ToString();
        }
    }
}