namespace Fanex.Athena.DataAccess.Report.Interfaces
{
    using Model.Report.MetaModel;
    using Model.Report.ResultModel;

    public interface IDetailedBillingDataAccess
    {
        string GetLicenseeBaseCurrency(int licenseeId);

        DetailedBillingResultModel GetData(DetailedBillingMetaModel metaModel);
    }
}