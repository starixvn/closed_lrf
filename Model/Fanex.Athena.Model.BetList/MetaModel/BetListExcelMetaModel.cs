using System;

namespace Fanex.Athena.Model.BetList.MetaModel
{
    public class BetListExcelMetaModel : BetListMetaModel
    {
        public string Title { get; set; }

        public BetListShowingOption ShowingOption { get; set; }

        public int[] HiddenColumns { get; set; }

        public int StartIndex { get; set; } = 1;

        public DateTime WinLostDate { get; set; }
    }
}