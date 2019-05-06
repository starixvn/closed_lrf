// -----------------------------------------------------------------------
// <copyright file="BetListDataAccess.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.Athena.BetList.DataAccess
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Data;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.DataAccess.Extensions;
    using Common.Utility.Collections;
    using Data;
    using Fanex.Athena.BetList.DataAccess.Interfaces;
    using Fanex.Athena.BetList.Model.DTO;
    using Fanex.Athena.BetList.Model.MetaModel;
    using Fanex.BetList.Core.Entities;
    using Fanex.Common;
    using Fanex.Common.Extensions;
    using Util;

    public class BetListDataAccess : BaseBetListDataAccess, IBetListDataAccess
    {
        public async Task<TicketResult> GetMixParlayDetailTicket(MixParlayDetailMetaModel metaModel)
        {
            const string UspName = "Lrf_BetList_SelParlayDetail";

            using (var db = this.GetObjectDb(UspName))
            {
                db.SetParameterValue("TransId", metaModel.TransId);
                db.SetParameterValue("CustId", metaModel.CustId);
                using (var reader = await db.ExecuteReaderAsync().ConfigureAwait(false))
                {
                    var result = new TicketResult();
                    result.MainTicketList.AddRange(ReadBetListTicket(reader, metaModel.UserCurrencyList, string.Empty));
                    return result;
                }
            }
        }

        private static void SetSystemParlayDetailParameter(IObjectDb db, SystemParlayDetailMetaModel metaModel)
        {
            db.SetParameterValue("AgentList", metaModel.AgentListXml);
            db.SetParameterValue("refno", metaModel.RefNo);
            db.SetParameterValue("movebetsday", metaModel.MoveBetsDay);
            db.SetParameterValue("balanceupday", metaModel.BalanceUpDay);
            db.SetParameterValue("BaseCurrency", metaModel.BaseCurrency);
            db.SetParameterValue("outstanding", null);
        }

        [CLSCompliant(false)]
        public async Task<SystemParlayData> GetSystemParlayDetail(SystemParlayDetailMetaModel metaModel)
        {
            const string UspName = "Lrf_BetList_SelCombinationParlayDetail";
            using (var db = this.GetObjectDb(UspName))
            {
                SetSystemParlayDetailParameter(db, metaModel);

                var dataSet = await db.ExecuteDataSetAsync().ConfigureAwait(false);
                var systemParlayData = new SystemParlayData
                {
                    TicketList = new List<ISystemParlayTicket>(),
                    SerialList = new List<ISystemParlaySerial>()
                };

                if (dataSet.Tables.Count > 0)
                {
                    using (var ticketData = dataSet.Tables[0])
                    {
                        foreach (DataRow row in ticketData.Rows)
                        {
                            systemParlayData.TicketList.Add(ReadSystemParlayTicket(row));
                        }
                    }

                    if (dataSet.Tables.Count > 1)
                    {
                        using (var serialData = dataSet.Tables[1])
                        {
                            foreach (DataRow row in serialData.Rows)
                            {
                                systemParlayData.SerialList.Add(ReadSystemParlaySerial(row));
                            }
                        }
                    }
                }

                systemParlayData.Outstanding = Converter.ToDecimal(db.GetParameterValue("outstanding"));

                return systemParlayData;
            }
        }

        public async Task<IList<SingleMatchParlayDetail>> GetSingleMatchParlayDetail(SingleMatchParlayDetailMetaModel metaModel)
        {
            const string UspName = "Lrf_BetList_BetBuilder_Detail";
            var result = new List<SingleMatchParlayDetail>();

            using (var db = this.GetObjectDb(UspName))
            {
                db.SetParameterValue("TransId", metaModel.TransId);
                db.SetParameterValue("CustId", metaModel.CustId);
                using (var reader = await db.ExecuteReaderAsync().ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        result.Add(new SingleMatchParlayDetail
                        {
                            SelectionType = reader.ToInt("SelectionType"),
                            Result = reader.ToString("Result")
                        });
                    }
                }
            }

            return result;
        }

        public async Task<TicketResult> GetBetListData(BetListMetaModel metaModel)
        {
            var ticketResult = new TicketResult();

            using (var db = GetObjectDb(metaModel.UspKey))
            {
                BetListParameterBuilder.CreateBetListParameters(db, metaModel);
                var baseCurrency = BetListParameterBuilder.HasBaseCurrencyOutputColumn(metaModel.UspKey) ?
                    metaModel.BaseCurrency :
                    string.Empty;

                using (var reader = await db.ExecuteReaderAsync().ConfigureAwait(false))
                {
                    ticketResult.MainTicketList.AddRange(ReadBetListTicket(reader, metaModel.CurrencyList, baseCurrency, metaModel.CustId));
                    if (reader.NextResult())
                    {
                        ticketResult.TicketDataList.AddRange(ReadLrfReferneceTicket(reader, baseCurrency).ToList());
                    }

                    SortData(metaModel, ticketResult.MainTicketList);
                }

                Hashtable outSqlParams = db.GetOuputParams() ?? new Hashtable();

                UpdateSummaryData(ticketResult, outSqlParams, baseCurrency);

                return ticketResult;
            }
        }

        private static void UpdateSummaryData(TicketResult ticketResult, Hashtable outPutParams, string baseCurrency)
        {
            ticketResult.TotalRows = Converter.ToInt(outPutParams["totalrows"]);
            ticketResult.SumWinLoss = outPutParams.ContainsKey("sumwinlost" + baseCurrency)
                ? Converter.ToDecimal(outPutParams["sumwinlost" + baseCurrency])
                : ticketResult.MainTicketList.Sum(x => x.Winlost);
            ticketResult.SumBetEffective = outPutParams.ContainsKey("sumbeteffective" + baseCurrency)
                ? Converter.ToDecimal(outPutParams["sumbeteffective" + baseCurrency])
                : ticketResult.MainTicketList.Sum(x => x.BetEffective);
            ticketResult.SumLicenseeWL = outPutParams.ContainsKey("sumlicenseewl" + baseCurrency)
                ? Converter.ToDecimal(outPutParams["sumlicenseewl" + baseCurrency])
                : ticketResult.MainTicketList.Sum(x => x.LicenseeWL);
            ticketResult.SumComm = outPutParams.ContainsKey("sumcomm" + baseCurrency)
                ? Converter.ToDecimal(outPutParams["sumcomm" + baseCurrency])
                : ticketResult.MainTicketList.Sum(x => x.Comm);
            ticketResult.SumPlayerComm = outPutParams.ContainsKey("sumplayercomm" + baseCurrency)
                ? Converter.ToDecimal(outPutParams["sumplayercomm" + baseCurrency])
                : ticketResult.MainTicketList.Sum(x => x.PlayerComm);
        }

        private static IEnumerable<ITicketData> ReadLrfReferneceTicket(IDataReader reader, string baseCurrency)
        {
            var stakeColumn = "stake" + baseCurrency;
            var hasOrdinalBetTeam = reader.HasColumn("betteam");
            var hasOrdinalStake = reader.HasColumn(stakeColumn);
            while (reader.Read())
            {
                var ticket = new TicketData
                {
                    BetTeam = hasOrdinalBetTeam ? reader.ToString("betteam") : string.Empty,
                    RefNo = reader.ToString("refno"),
                    Status = reader.ToString("status"),
                    BetTypeId = reader.ToInt("bettype"),
                    Stake = hasOrdinalStake ? reader.ToDecimal(stakeColumn) : 0,
                    Odds = reader.ToDecimal("odds")
                };

                yield return ticket;
            }
        }

        private static void SortData(BetListMetaModel metaModel, SortableList<LrfTicket> ticketList)
        {
            if (!metaModel.IsServerPaging && !string.IsNullOrWhiteSpace(metaModel.SortBy))
            {
                // Because Winloss and Commission are shared the same column (in grid)
                // so we need to sort by the total of two values which is stored in WinlossComm property.
                if (metaModel.SortBy.Equals("WinLoss", StringComparison.OrdinalIgnoreCase))
                {
                    metaModel.SortBy = "WinLossComm";
                }

                if (metaModel.SortBy.Equals("LicenseeWL", StringComparison.OrdinalIgnoreCase))
                {
                    metaModel.SortBy = "LicenseeWLComm";
                }

                if (metaModel.SortBy.Equals("nickname", StringComparison.OrdinalIgnoreCase))
                {
                    metaModel.SortBy = "ExternalId";
                }

                ticketList.Sort(metaModel.SortBy, metaModel.SortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase));
            }
        }

        private SystemParlayTicket ReadSystemParlayTicket(DataRow row)
        {
            return new SystemParlayTicket
            {
                Comm = Converter.ToDecimal(row["comm"]),
                MOdds = Converter.ToDecimal(row["modds"]),
                PlayerComm = Converter.ToDecimal(row["playercomm"]),
                Serial = Convert.ToInt64(row["serial"]),
                Stake = Converter.ToDecimal(row["stake"]),
                Status = Converter.ToString2(row["status"]),
                StatusId = Converter.ToInt(row["statusid"]),
                TransId = Convert.ToInt64(row["transid"]),
                WinLost = Converter.ToDecimal(row["winlost"]),
                WinLostDate = Converter.ToDateTime(row["winlostdate"])
            };
        }

        private SystemParlaySerial ReadSystemParlaySerial(DataRow row)
        {
            return new SystemParlaySerial
            {
                Serial = Convert.ToInt64(row["serial"]),
                HomeId = Converter.ToInt(row["homeid"]),
                AwayId = Converter.ToInt(row["awayid"])
            };
        }
    }
}