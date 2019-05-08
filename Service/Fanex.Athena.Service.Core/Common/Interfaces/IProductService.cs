namespace Fanex.Athena.Service.Core.Common.Interfaces
{
    using System.Collections.Generic;
    using Fanex.Athena.Model.Core.DTO.Common;

    public interface IProductService
    {
        ProductAccess GetProductAccess(int licenseeId, string languageCode, string functionConfigKey = null, bool isSingleWalletOnly = false);

        IList<Product> GetProductList(int licenseeId, string languageCode);

        ProductAccess GetProductAccessForActiveCustomerSummary(int licenseeId, string languageCode);
    }
}