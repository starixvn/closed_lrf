namespace Fanex.Athena.DataAccess.Report.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Model.Report.MetaModel;
    using Model.Report.ResultModel;

    public interface IDetailedBillingDataAccess
    {
        Task<DetailedBillingResultModel> GetData(DetailedBillingMetaModel metaModel, IDictionary<int, string> currencyList);
    }
}