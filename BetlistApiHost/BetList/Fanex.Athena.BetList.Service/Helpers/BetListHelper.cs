namespace Fanex.Athena.BetList.Service.Helpers
{
    using System;
    using Common.Constant;
    using Fanex.BetList.Core.Entities;
    using Model.DTO;
    using Resources;

    public static class BetListHelper
    {
        private const int MinColossusBetBetType = 18000;

        private const int MaxColossusBetBetType = 18007;

        public static void ClearData(TicketResult ticketResult)
        {
            ticketResult.MainTicketList.Clear();
            ticketResult.TicketDataList.Clear();
            ticketResult.MainTicketList.TrimExcess();
            ticketResult.TicketDataList.TrimExcess();
            ticketResult.MainTicketList = null;
            ticketResult.TicketDataList = null;
        }

        [CLSCompliant(false)]
        public static string GenerateClientDetailSystemParlayFunction(
            ITicketHelper tickerHelper,
            string baseCurrency,
            LrfTicket ticket,
            long custid)
        {
            const string FormatDetail = @"showCombMPDetail({0},{1},{2},{3},&quot;{4}&quot;,&quot;{5}&quot;)";
            var comboName = tickerHelper.GetCombinationMPOfferName(ticket.BetTeam);
            var betTypeName = GetBetTypeName(tickerHelper, ticket);
            if (!string.IsNullOrEmpty(comboName))
            {
                betTypeName += " - " + comboName;
            }

            return string.Format(
                FormatDetail,
                ticket.TransId,
                ticket.RefNo,
                ticket.BetId,
                custid,
                betTypeName,
                baseCurrency);
        }

        public static bool IsBoughtTicket(int bettype)
        {
            return bettype == (int)BetType.BetTradeBought || bettype == (int)BetType.CashOutBought;
        }

        public static bool IsColossusBet(int bettype)
        {
            return bettype >= MinColossusBetBetType && bettype <= MaxColossusBetBetType;
        }

        public static bool IsRunning(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return false;
            }

            return status.Equals("running", StringComparison.OrdinalIgnoreCase) ||
                    status.Equals("waiting", StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsVoid(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return false;
            }

            return status.Equals("void", StringComparison.OrdinalIgnoreCase);
        }

        private static string GetBetTypeName(ITicketHelper tickerHelper, LrfTicket ticket)
        {
            return (ticket.BetTypeId == (int)BetType.CombinationMixParlay && ticket.BetTeam == "1") ?
                            ViewResources.MixParlay :
                            tickerHelper.GetBetTypeNameById(ticket.BetTypeId);
        }
    }
}