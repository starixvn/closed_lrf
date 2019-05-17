namespace Fanex.Athena.Model.Report.ResultModel
{
    using System.Collections.Generic;
    using DTO;

    public class DetailedBillingResultModel
    {
        public IList<DetailedBilling> Data { get; set; }

        public SummaryDetailedBilling Summary { get; set; }

        public IDictionary<string, float> Exchange { get; set; }

        public decimal Total { get; set; }

        public decimal SubTotal { get; set; }
    }
}