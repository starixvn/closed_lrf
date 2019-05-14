// --------------------------------------------------------------------------
// <copyright file="LrfBetListHtmlBuilder.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.BetList.Service.Extensions
{
    using System;
    using System.Collections.Generic;
    using Common.Constant;
    using Fanex.Athena.BetList.Model.DTO;
    using Fanex.Athena.BetList.Model.MetaModel;
    using Fanex.BetList.Core.App_GlobalResources;
    using Fanex.BetList.Core.Builder;
    using Fanex.BetList.Core.Entities;
    using Helpers;
    using Resources;

    public static class LrfBetListHtmlBuilder
    {
        [CLSCompliant(false)]
        public static string BuildLrfStatus(
            this IBetListHTMLBuilder builder,
            LrfTicket ticket,
            ITicketHelper ticketHelper,
            List<ITicketData> ticketData,
            BetListMetaModel metaModel)
        {
            const string StatusTemp = "<div class='status'>{0}</div>";
            var statusText = GetStatusText(ticket.Status);
            var statusNormalText = string.Format(StatusTemp, statusText);

            // If Sport type is keno, doesn't show "Result" link.
            if (ticket.SportTypeId == (int)SportType.Keno)
            {
                return statusNormalText;
            }

            switch (ticket.BetTypeId)
            {
                case (int)BetType.CasinoGames:
                    const string CasinoHandTemplate =
                        "<div id='casino-hand-history-{0}' class='result casino-hand-history-link' url-param='{1}' onclick='BetList.ViewCasinoHandHistory({0});'>{2}</div>";
                    return statusNormalText + string.Format(
                        CasinoHandTemplate,
                        ticket.RefNo,
                        GetCasinoHandHistoryParam(ticket, metaModel),
                        ViewResources.Results);

                case (int)BetType.P2PGames:
                case (int)BetType.MiniGames:
                    return statusNormalText;

                default:
                    return builder.BuildStatus(ticket, ticketHelper, ticketData, false);
            }
        }

        // when updating this, remember to update Fanex.Athena.Excel.BetList.LrfBetListExcelBuilder as well
        [CLSCompliant(false)]
        public static string BuildLicenseeWL(this IBetListHTMLBuilder builder, LrfTicket ticket)
        {
            var isRunning = BetListHelper.IsRunning(ticket.Status);

            if (BetListHelper.IsBoughtTicket(ticket.BetTypeId) ||
                BetListHelper.IsColossusBet(ticket.BetTypeId))
            {
                var licenseeWl = isRunning
                    ? "-"
                    : FormatLicenseeWl(ticket.LicenseeWL);
                var comm = isRunning
                    ? "-"
                    : string.Format("{0:#,##0.00}", ticket.Comm);

                return string.Format("<div class ='lic-win-loss'>{0}<br/>{1}</div>", licenseeWl, comm);
            }

            return isRunning
                    ? "-"
                    : string.Format(
                        "<div class='lic-win-loss'>{0}</div>",
                        FormatLicenseeWl(ticket.LicenseeWL + ticket.Comm));
        }

        [CLSCompliant(false)]
        public static string BuildCustomerWL(this IBetListHTMLBuilder builder, Ticket ticket, bool showPlayerComm)
        {
            bool isRunning = BetListHelper.IsRunning(ticket.Status);
            var winloss = isRunning
                            ? "-"
                            : string.Format("<div class='underdog'>{0:#,##0.00}</div>", ticket.Winlost);

            if (!showPlayerComm)
            {
                return winloss;
            }

            winloss += isRunning
                ? string.Empty
                : string.Format("<div class='underdog'>{0:#,##0.00}</div>", ticket.PlayerComm);

            return winloss;
        }

        [CLSCompliant(false)]
        public static string BuildBetEffective(this IBetListHTMLBuilder builder, LrfTicket ticket)
        {
            return string.Format("<div class='underdog'>{0:#,##0.00}</div>", ticket.BetEffective);
        }

        [CLSCompliant(false)]
        public static string BuildLiveStatus(this IBetListHTMLBuilder builder, ITicket ticket)
        {
            const string PatternStatusBetlist = "<label style='color:{0}'>{1}</label>";
            if (ticket.BetTypeId == (int)BetType.MixParlay || ticket.BetTypeId == (int)BetType.CombinationMixParlay)
            {
                switch (ticket.LiveHomeScore)
                {
                    case LiveStatusTypes.Live:
                        return string.Format(PatternStatusBetlist, "#cc0033", ViewResources.Live);

                    case LiveStatusTypes.Mix:
                        return string.Format(PatternStatusBetlist, "#0033ff", ViewResources.MixLiveAndNoneLive);

                    default:
                        return string.Format(PatternStatusBetlist, "#000", ViewResources.NoneLive);
                }
            }

            return ticket.IsLive
                ? string.Format(PatternStatusBetlist, "#cc0033", ViewResources.Live)
                : string.Format(PatternStatusBetlist, "#000", ViewResources.NoneLive);
        }

        [CLSCompliant(false)]
        public static string BuildSingleMatchParlaySelectionStatus(this IBetListHTMLBuilder builder, string status)
        {
            return GetStatusText(status);
        }

        #region Private Utility

        /// <summary>
        /// Get Casino Hand History Parameter.
        /// </summary>
        /// <param name="ticket">LRF Ticket object.</param>
        /// <param name="metaModel">Meta model object.</param>
        /// <returns>Parameter for Casino Hand History.</returns>
        private static string GetCasinoHandHistoryParam(LrfTicket ticket, BetListMetaModel metaModel)
        {
            var param = string.Empty;
            param += "?RefNo=" + ticket.RefNo;
            param += "&FromDate=" + metaModel.FromDate;
            param += "&ToDate=" + metaModel.ToDate;
            param += "&SystemId=" + (string.IsNullOrEmpty(ticket.UserName) ? metaModel.SystemId : ticket.UserName);
            param += "&ExternalId=" + (string.IsNullOrEmpty(ticket.ExternalId) ? metaModel.ExternalId : ticket.ExternalId);
            param += "&CustId=" + (ticket.CustId == 0 ? metaModel.CustId : ticket.CustId);
            param += "&CurrencyId=" + metaModel.CurrencyId;
            param += "&CurrencyName=" + metaModel.CurrencyName;
            param += "&BaseCurrency=" + metaModel.BaseCurrency;
            return param;
        }

        /// <summary>
        /// Format licensee win lost, show red text if the licensee win lost is negative.
        /// </summary>
        /// <param name="licenseeWl">Licensee win loss value.</param>
        /// <returns>Licensee win loss text.</returns>
        private static string FormatLicenseeWl(decimal licenseeWl)
        {
            return licenseeWl < 0
                ? string.Join(
                    null,
                    new[] { "<span class='negative-number'>", string.Format("{0:#,##0.00}", licenseeWl), "</span>" })
                : string.Format("{0:#,##0.00}", licenseeWl);
        }

        /// <summary>
        /// Get status text by status id.
        /// </summary>
        /// <param name="ticketStatus">LRF ticket status.</param>
        /// <returns>Status text.</returns>
        private static string GetStatusText(string ticketStatus)
        {
            switch (ticketStatus.ToLowerInvariant())
            {
                case BetStatus.Running:
                    return CoreBetList.running;

                case BetStatus.Reject:
                    return CoreBetList.reject;

                case BetStatus.Won:
                    return CoreBetList.won;

                case BetStatus.Lose:
                    return CoreBetList.lose;

                case BetStatus.Draw:
                    return CoreBetList.draw;

                case BetStatus.Waiting:
                    return CoreBetList.waiting;

                case BetStatus.Void:
                    return CoreBetList.voided;

                case BetStatus.Refund:
                    return CoreBetList.refund;

                default:
                    return string.Empty;
            }
        }

        #endregion Private Utility
    }
}