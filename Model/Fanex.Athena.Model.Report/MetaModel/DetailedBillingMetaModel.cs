namespace Fanex.Athena.Model.Report.MetaModel
{
    using System;

    public class DetailedBillingMetaModel
    {
        public int LicenseeId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string BaseCurrency { get; set; }

        public string Environment { get; set; }
    }
}