// -----------------------------------------------------------------------
// <copyright file="BetListService.cs" company="Microsoft">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.BetList.Service
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Common.Constant;
    using Common.DataAccess.Interfaces;
    using Common.Utility.Services.Interfaces;
    using Extensions;
    using Fanex.Athena.BetList.DataAccess.Interfaces;
    using Fanex.Athena.BetList.Model.DTO;
    using Fanex.Athena.BetList.Model.MetaModel;
    using Fanex.Athena.BetList.Service.Interfaces;
    using Fanex.BetList.Core.Builder;
    using Fanex.BetList.Core.Entities;
    using Helpers;

    public class BetListService : IBetListService
    {
        private readonly IBalanceUpDataAccess _balanceUpDataAccess;

        private readonly IBetListDataAccess _betlistDataAccess;

        private readonly ITicketHelper _ticketHelper;

        private readonly IBetListHTMLBuilder _betlistHtmlBuilder;

        private readonly ICacheRefAdapter _cacheRefAdapter;

        [System.CLSCompliant(false)]
        public BetListService(
            IBalanceUpDataAccess balanceUpDataAccess,
            IBetListDataAccess betlistDataAccess,
            ITicketHelper ticketHelper,
            IBetListHTMLBuilder betlistHtmlBuilder,
            ICacheRefAdapter cacheRefAdapter)
        {
            _balanceUpDataAccess = balanceUpDataAccess;
            _betlistDataAccess = betlistDataAccess;
            _ticketHelper = ticketHelper;
            _betlistHtmlBuilder = betlistHtmlBuilder;
            _cacheRefAdapter = cacheRefAdapter;
        }

        public string GetLeagueName(int leagueId)
        {
            return _cacheRefAdapter.GetLeagueName(leagueId);
        }

        public async Task<TicketResult> GetMixParlayDetailTicket(MixParlayDetailMetaModel metaModel)
        {
            return await _betlistDataAccess.GetMixParlayDetailTicket(metaModel);
        }

        [CLSCompliant(false)]
        public async Task<SystemParlayData> GetSystemParlayDetail(SystemParlayDetailMetaModel metaModel)
        {
            return await _betlistDataAccess.GetSystemParlayDetail(metaModel).ConfigureAwait(false);
        }

        public async Task<IList<SingleMatchParlayDetail>> GetSingleMatchParlayDetail(SingleMatchParlayDetailMetaModel metaModel)
        {
            return await _betlistDataAccess.GetSingleMatchParlayDetail(metaModel);
        }

        public async Task<TicketResult> GetBetListData(BetListMetaModel metaModel)
        {
            AssignBalanceUpDates(metaModel);

            return await _betlistDataAccess.GetBetListData(metaModel).ConfigureAwait(false);
        }

        public List<TicketText> BuildTicketTextList(
            TicketResult ticketResult,
            BetListMetaModel metaModel = null,
            int startIndex = 1,
            bool showOdds = false,
            bool isShowPlayerComm = false)
        {
            var baseCurrency = metaModel == null ? string.Empty : metaModel.BaseCurrency;
            var ticketTextList = new List<TicketText>();

            _ticketHelper.IsShowOddsWithChoice = showOdds;

            foreach (var ticket in ticketResult.MainTicketList)
            {
                if (ticket.BetTypeId == (int)BetType.CombinationMixParlay && metaModel != null)
                {
                    var custid = ticket.CustId != 0 ? ticket.CustId : metaModel.CustId;
                    _ticketHelper.ClientDetailSystemParlayFunction = BetListHelper.GenerateClientDetailSystemParlayFunction(_ticketHelper, baseCurrency, ticket, custid);
                }

                var ticketText = new TicketText
                {
                    Index = startIndex++,
                    ExternalId = ticket.ExternalId,
                    SystemId = ticket.UserName,
                    TransTime = _betlistHtmlBuilder.BuildTrans(ticket),
                    Status = _betlistHtmlBuilder.BuildLrfStatus(ticket, _ticketHelper, ticketResult.TicketDataList, metaModel),
                    Choice = _betlistHtmlBuilder.BuildChoice(ticket, _ticketHelper, ticketResult.TicketDataList, false),
                    Odds = _betlistHtmlBuilder.BuildOdds(ticket, ticketResult.TicketDataList, _ticketHelper.GetValidOddsTypeNameById),
                    Stake = _betlistHtmlBuilder.BuildStake(ticket),
                    LicenseeWL = _betlistHtmlBuilder.BuildLicenseeWL(ticket),
                    WinLoss = _betlistHtmlBuilder.BuildCustomerWL(ticket, isShowPlayerComm),
                    BetEffective = _betlistHtmlBuilder.BuildBetEffective(ticket)
                };

                ticketTextList.Add(ticketText);
            }

            return ticketTextList;
        }

        private void AssignBalanceUpDates(BetListMetaModel metaModel)
        {
            var balanceUp = _balanceUpDataAccess.GetBalanceUp();
            metaModel.MoveBetsDay = balanceUp.MoveBetsDay;
            metaModel.BalanceUpDay = balanceUp.BalanceUpDay;
        }
    }
}