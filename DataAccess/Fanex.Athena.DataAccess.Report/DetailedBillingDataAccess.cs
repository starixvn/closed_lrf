namespace Fanex.Athena.DataAccess.Report
{
    using System.Collections.Generic;
    using System.Linq;
    using Core;
    using Interfaces;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ResultModel;

    public class DetailedBillingDataAccess : BaseDataAccess, IDetailedBillingDataAccess
    {
        public string GetLicenseeBaseCurrency(int licenseeId)
        {
            const string UspName = "Lrf_LicenseeBaseCurrencySel";
            using (var db = GetObjectDb(UspName))
            {
                db.SetParameterValue("LicenseeId", licenseeId);
                return db.QueryEntity<string>();
            }
        }

        public DetailedBillingResultModel GetData(DetailedBillingMetaModel metaModel)
        {
            var result = new DetailedBillingResultModel
            {
                Data = BindData(),
                Summary = BindSummary(),
                Exchange = BindExchange()
            };

            CalculateTotal(result);

            return result;
        }

        private static void CalculateTotal(DetailedBillingResultModel result)
        {
            result.SubTotal = result.Data.Sum(x => x.AmountDue);

            result.Total = result.Summary != null
                ? result.SubTotal - (result.Summary.Discount + result.Summary.DeductAMF + result.Summary.DeductPrepayment)
                : result.SubTotal;
        }

        private IList<DetailedBilling> BindData()
        {
            return new List<DetailedBilling>
            {
                new DetailedBilling { Product = "SB", Turnover = 0, CustomerWL = 0, AmountDue = 0, LicenseeNetWL = 0 },
                new DetailedBilling { Product = "SB", Turnover = 0, CustomerWL = 0, AmountDue = 0, LicenseeNetWL = 0 },
                new DetailedBilling { Product = "SB", Turnover = 0, CustomerWL = 0, AmountDue = 0, LicenseeNetWL = 0 }
            };
        }

        private SummaryDetailedBilling BindSummary()
        {
            return new SummaryDetailedBilling
            {
                Discount = 0,
                DeductAMF = 0,
                DeductPrepayment = 0
            };
        }

        private IDictionary<string, float> BindExchange()
        {
            return new Dictionary<string, float>
            {
                { "EUR", 0 },
                { "USD", 0 },
                { "GBP", 0 }
            };
        }
    }
}