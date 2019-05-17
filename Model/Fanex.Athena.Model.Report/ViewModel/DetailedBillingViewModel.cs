namespace Fanex.Athena.Model.Report.ViewModel
{
    using System;
    using System.Collections.Generic;
    using Fanex.Athena.Model.Core.DTO.Configuration;

    public class DetailedBillingViewModel
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string BaseCurrency { get; set; }

        public ReportSetting ReportSetting { get; set; }

        public IList<string> BaseCurrencyList { get; set; }
    }
}