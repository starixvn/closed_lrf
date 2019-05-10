namespace Fanex.Athena.Excel.Report
{
    using System.Linq;
    using Base;
    using Fanex.Athena.Excel.Base.Extension;
    using Fanex.Athena.Model.Core.DataDomain;
    using Model.Core.ResultModel;
    using Model.Report;
    using NPOI.SS.UserModel;
    using Resources;

    public class PromotionPrizeExcel : ReportBase
    {
        private const int ColumnDate = 1;
        private const int ColumnCurrency = 2;
        private const int ColumnExternalId = 3;
        private const int ColumnSystemId = 4;
        private const int ColumnAmount = 5;

        private const int ColumnTemplateCount = 6;

        private const int RowContentTemplate = 2;
        private const int RowTotal = 4;
        private const int RowNoInfoTemplate = 7;

        private readonly ReportResultModel<PromotionPrize> _data;

        private readonly string _title;

        protected internal PromotionPrizeExcel(string templatePath)
            : base(templatePath, 0)
        {
        }

        public PromotionPrizeExcel(string templatePath, string title, ReportResultModel<PromotionPrize> data)
            : base(templatePath, data.TotalRows)
        {
            _data = data;
            _title = title;
        }

        protected override void AssignHeader(ISheet sheet)
        {
            // row 1
            var row = sheet.CopyRow(TemplateSheet, RowHeaderTemplate);
            row.Cells[ColumnIndex].SetCellValue("#");
            row.Cells[ColumnDate].SetCellValue(ViewResources.Date);
            row.Cells[ColumnCurrency].SetCellValue(ViewResources.Currency);
            row.Cells[ColumnExternalId].SetCellValue(ViewResources.ExternalId);
            row.Cells[ColumnSystemId].SetCellValue(ViewResources.SystemId);
            row.Cells[ColumnAmount].SetCellValue(ViewResources.Amount);
        }

        protected override void AssignNoInfoRow(ISheet sheet)
        {
            sheet.SetTextRowValue(TemplateSheet, RowNoInfoTemplate, RowContentTemplate, ColumnTemplateCount, ViewResources.NoInfo);
            ProcessUI(sheet);
        }

        protected override void AssignSheetData(ISheet sheet)
        {
            int index = 0;
            var rowCount = _data.TotalRows;

            for (index = 0; index < rowCount; index++)
            {
                var item = _data.DataList.ElementAt(index);

                var row = sheet.CopyRow(TemplateSheet, RowContentTemplate, index + RowContentTemplate);
                row.Cells[ColumnIndex].SetCellValue(index + 1);
                row.Cells[ColumnDate].SetCellValue(item.Date.ToString(FormatKey.DateTimeFormat));
                row.Cells[ColumnCurrency].SetCellValue(item.CurrencyName);
                row.Cells[ColumnExternalId].SetCellValue(item.ExternalId);
                row.Cells[ColumnSystemId].SetCellValue(item.SystemId);
                row.Cells[ColumnAmount].SetCellValue(item.Amount);
            }

            AssignGrandTotal(sheet, index + RowContentTemplate);
        }

        protected override void AssignTitle(ISheet sheet)
        {
            sheet.SetTextRowValue(TemplateSheet, RowTitleTemplate, ColumnTemplateCount, _title);

            // Freeze 2 rows title and header
            sheet.CreateFreezePane(0, RowContentTemplate);

            // Remove content below header before insert new data
            ClearTemplate(sheet, RowContentTemplate);
        }

        protected internal virtual int AssignGrandTotal(ISheet sheet, int rowIndex)
        {
            var currencies = _data.SummaryTotal.Keys.Reverse();

            foreach (string currency in currencies)
            {
                // Copy template
                var row = sheet.CopyRow(TemplateSheet, RowTotal, rowIndex);
                row.Cells[ColumnAmount].SetCellValue(_data.SummaryTotal[currency].Amount);
                row.Cells[ColumnIndex].SetCellValue(ViewResources.Totalin + " " + currency.ToUpperInvariant());

                // Merge first two column
                sheet.MergeCols(ColumnIndex, ColumnSystemId, rowIndex);
                rowIndex++;
            }

            return rowIndex;
        }
    }
}