// --------------------------------------------------------------------------
// <copyright file="BaseApiController.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.Api.Base
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web.Http;
    using Fanex.Athena.Service.Core.Common.Interfaces;
    using Fanex.Athena.Service.Core.Users.Interfaces;
    using Model.Core.MetaModel.Product;
    using NPOI.SS.UserModel;
    using ONEbook.UM.Filters;

    [CheckUMFilter]
    [XFrameOptionApi]
    public class BaseApiController : ApiController
    {
        private readonly ILanguageService _langService;
        private readonly IProductService _productService;
        private readonly ISessionService _sessionService;

        protected internal BaseApiController(ISessionService sessionService, IProductService productService, ILanguageService languageService)
        {
            _sessionService = sessionService;
            _productService = productService;
            _langService = languageService;
        }

        protected IDictionary<int, string> UserCurrencyList => _sessionService.UserSession.CurrencyList;

        protected IProductService ProductService
        {
            get
            {
                return _productService;
            }
        }

        protected ISessionService SessionService
        {
            get
            {
                return _sessionService;
            }
        }

        [System.CLSCompliant(false)]
        protected internal virtual HttpResponseMessage ExcelStream(IWorkbook workbook, string fileName)
        {
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new PushStreamContent(
              (stream, context, transportContext) =>
              {
                  try
                  {
                      workbook.Write(stream);
                  }
                  finally
                  {
                      workbook.Clear();
                      stream.Close();
                      context.Dispose();
                  }
              },
              new MediaTypeHeaderValue("application/octet-stream"));
            result.Headers.TransferEncodingChunked = true;
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileName
            };
            return result;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            var currentLanguage = _langService.GetCurrentLanguage();
            _langService.SetPageCulture(currentLanguage);
        }

        protected string RemoveInvalidProducts(string productCodeList, string functionProductConfigKey)
        {
            if (string.IsNullOrWhiteSpace(productCodeList))
            {
                return string.Empty;
            }

            var productAccess = ProductService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                functionProductConfigKey);
            var productList = productAccess.ProductList;

            var validProductCodes = productCodeList.Split(',').Where(x => productList.Any(y => y.ProductCode.Equals(x, StringComparison.OrdinalIgnoreCase)));
            return string.Join(",", validProductCodes.ToArray());
        }

        protected IList<ProductOption> RemoveInvalidProducts(IList<ProductOption> productOption, string functionProductConfigKey, bool isSingleWalletOnly = false)
        {
            if (!productOption.Any())
            {
                return productOption;
            }

            var validProductAccess = ProductService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                functionProductConfigKey,
                isSingleWalletOnly).ProductList;

            return productOption.Where(x => validProductAccess.Any(y => y.ProductCode == x.Code)).ToList();
        }
    }
}