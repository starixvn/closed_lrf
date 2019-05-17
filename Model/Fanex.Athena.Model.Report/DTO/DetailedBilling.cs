namespace Fanex.Athena.Model.Report.DTO
{
    public class DetailedBilling
    {
        public string Product { get; set; }

        public decimal Turnover { get; set; }

        public decimal CustomerWL { get; set; }

        public decimal LicenseeNetWL { get; set; }

        public decimal AmountDue { get; set; }
    }
}