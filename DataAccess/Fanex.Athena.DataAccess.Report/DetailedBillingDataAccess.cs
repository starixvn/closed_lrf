namespace Fanex.Athena.DataAccess.Report
{
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.Extensions;
    using Core;
    using Extension.Helper;
    using Extension.Utility;
    using Interfaces;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ResultModel;

    public class DetailedBillingDataAccess : BaseDataAccess, IDetailedBillingDataAccess
    {
        public async Task<DetailedBillingResultModel> GetData(DetailedBillingMetaModel metaModel, IDictionary<int, string> currencyList)
        {
            var result = new DetailedBillingResultModel();

            const string UspName = "Lrf_Rpt_DetailedBilling";
            using (var db = GetObjectDb(UspName))
            {
                db.SetParameterValue("LicenseeId", metaModel.LicenseeId);
                db.SetParameterValue("FromDate", metaModel.FromDate);
                db.SetParameterValue("ToDate", metaModel.ToDate);
                db.SetParameterValue("BaseCurrency", metaModel.BaseCurrency);
                db.SetParameterValue("Environment", metaModel.Environment);

                using (var reader = await db.ExecuteReaderAsync().ConfigureAwait(false))
                {
                    result.Data = BindData(reader);

                    reader.NextResult();
                    result.Exchange = BindExchange(reader, currencyList);

                    reader.NextResult();
                    result.Summary = BindSummary(reader);
                }
            }

            CalculateTotal(result);

            return result;
        }

        private static void CalculateTotal(DetailedBillingResultModel result)
        {
            result.SubTotal = result.Data.Sum(x => x.AmountDue);

            result.Total = result.Summary != null
                ? result.SubTotal - result.Summary.Sum(x => x.Amount)
                : result.SubTotal;
        }

        private static IDictionary<string, float> BindExchange(IDataReader reader, IDictionary<int, string> currencyList)
        {
            var exchange = new Dictionary<string, float>();

            while (reader.Read())
            {
                var currencyId = reader.ToInt("CurrencyId");
                var currencyCode = currencyList?.GetValueOrDefault(currencyId, string.Empty);

                if (!string.IsNullOrEmpty(currencyCode))
                {
                    exchange.Add(currencyCode, reader.ToFloat("Rate"));
                }
            }

            return exchange;
        }

        private IList<DetailedBilling> BindData(IDataReader reader)
        {
            var data = new List<DetailedBilling>();

            while (reader.Read())
            {
                data.Add(new DetailedBilling
                {
                    Product = DataHelper.GetProductName(reader.ToString("ProductCode")),
                    Turnover = reader.ToDecimal("Turnover"),
                    CustomerWL = reader.ToDecimal("CustomerWL"),
                    LicenseeNetWL = reader.ToDecimal("LicenseeNetWL"),
                    AmountDue = reader.ToDecimal("AmountDue")
                });
            }

            return data;
        }

        private IList<SummaryDetailedBilling> BindSummary(IDataReader reader)
        {
            var summary = new List<SummaryDetailedBilling>();

            while (reader.Read())
            {
                var productCode = reader.ToString("ProductCode");
                summary.Add(new SummaryDetailedBilling
                {
                    Product = !string.IsNullOrEmpty(productCode) ? DataHelper.GetProductName(productCode) : string.Empty,
                    InvoiceItemTypeId = reader.ToInt("TypeId"),
                    Amount = reader.ToDecimal("Amount")
                });
            }

            return summary;
        }
    }
}