namespace Fanex.Athena.DataAccess.Report
{
    using Core;
    using Interfaces;

    public class DetailedBillingDataAccess : BaseDataAccess, IDetailedBillingDataAccess
    {
        public string GetLicenseeBaseCurrency(int licenseeId)
        {
            ////Lrf_f_GetCurrencybyUser
            return "EUR";
        }
    }
}