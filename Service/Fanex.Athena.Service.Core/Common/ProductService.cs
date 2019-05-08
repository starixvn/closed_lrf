// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ProductService.cs" company="">
//  The product service.
// </copyright>
// <summary>
//   The product service.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Fanex.Athena.Service.Core.Common
{
    #region

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Hosting;
    using System.Xml.Linq;
    using Extension.Utility.Interfaces;
    using Fanex.Athena.DataAccess.Core.Common.Interfaces;
    using Fanex.Athena.Extension.Utility;
    using Fanex.Athena.Model.Core.DTO.Common;
    using Fanex.Athena.Model.Core.DTO.Configuration;
    using Fanex.Athena.Service.Core.Common.Interfaces;

    #endregion

    public class ProductService : IProductService
    {
        private readonly IProductDataAccess _productDataAccess;

        private readonly IAppSettings _appSettings;

        private readonly IXDocumentWrapper _xmlWrapper;

        private readonly IMemoryCacheService _cache;

        public ProductService(IAppSettings appSettings, IProductDataAccess productDataAccess, IXDocumentWrapper xmlWrapper, IMemoryCacheService cache)
        {
            _appSettings = appSettings;
            _productDataAccess = productDataAccess;
            _xmlWrapper = xmlWrapper;
            _cache = cache;
        }

        #region Public Methods and Operators

        public IList<Product> GetProductList(int licenseeId, string languageCode)
        {
            var cacheKey = CacheKey.MemorycacheCommonProduct + licenseeId + languageCode;
            var productList = _cache.Get<IList<Product>>(cacheKey);

            if (productList != null)
            {
                return productList;
            }

            productList = _productDataAccess.GetProductAccessList(licenseeId);
            _cache.Set(cacheKey, productList);

            return productList;
        }

        public ProductAccess GetProductAccess(int licenseeId, string languageCode, string functionConfigKey = null, bool isSingleWalletOnly = false)
        {
            var allowedProducts = GetAllowedProducts(functionConfigKey);

            var originalProducts = GetProductList(licenseeId, languageCode);

           if (!allowedProducts.Any())
            {
                return new ProductAccess(originalProducts);
            }

            var productList = isSingleWalletOnly ? originalProducts.Where(i => i.IsOfferedSingleWallet && allowedProducts.Contains(i.ProductCode))
                : originalProducts.Where(i => allowedProducts.Contains(i.ProductCode));

            return new ProductAccess(productList.ToList());
        }

        public ProductAccess GetProductAccessForActiveCustomerSummary(int licenseeId, string languageCode)
        {
            const string FilterFunctionName = "ActiveCustomerSummary";

            var cacheKey = CacheKey.MemorycacheActiveCustomerSummaryProduct + licenseeId + languageCode;
            var products = _cache.Get<IList<Product>>(cacheKey);

            if (products == null)
            {
                products = _productDataAccess.GetProductAccessList(licenseeId, true);
                var allowedProducts = GetAllowedProducts(FilterFunctionName);
                if (allowedProducts.Any())
                {
                    products = products.Where(i => i.IsOfferedSingleWallet && allowedProducts.Contains(i.ProductCode)).ToList();
                }

                _cache.Set(cacheKey, products);
            }

            return new ProductAccess(products);
        }

        #endregion

        private string[] GetAllowedProducts(string functionName = null)
        {
            const string FunctionAllowedProductsKey = "FunctionAllowedProducts";

            var functions = _cache.Get<IEnumerable<XElement>>(FunctionAllowedProductsKey);
            if (functions == null)
            {
                var filePath = HostingEnvironment.MapPath(_appSettings.GetValue("FunctionAllowedProductFile"));
                functions = _xmlWrapper.Load(filePath).Descendants(nameof(Function));
                if (functions != null && functions.Any())
                {
                    _cache.Set(FunctionAllowedProductsKey, functions);
                }
            }

            var configFunctionName = string.IsNullOrWhiteSpace(functionName) ? "_Default" : functionName;
            var config = functions.FirstOrDefault(x => x.Attribute("Name").Value.Equals(configFunctionName, StringComparison.OrdinalIgnoreCase));
            return config == null ? new string[] { } : config.Attribute(nameof(Product)).Value.Split(',')
                    .Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToArray();
        }
    }
}