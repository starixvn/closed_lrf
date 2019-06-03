namespace Fanex.Athena.Model.Report.DTO
{
    public class SummaryDetailedBilling
    {
        public int InvoiceItemTypeId { get; set; }

        public string Product { get; set; }

        public decimal Amount { get; set; }
    }
}