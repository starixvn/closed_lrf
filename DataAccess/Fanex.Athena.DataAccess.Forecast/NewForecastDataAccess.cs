// --------------------------------------------------------------------------
// <copyright file="ForecastDataAccess.cs" company="">
// Copyright (c) . All rights reserved.
// </copyright>
// --------------------------------------------------------------------------

namespace Fanex.Athena.DataAccess.Forecast
{
    using System.Data;
    using System.Threading.Tasks;
    using Core;
    using Fanex.Athena.Model.Forecast.ViewModel;
    using Fanex.Common;
    using Interfaces;
    using Model.Forecast.DTO.NewForecastHdpOu;
    using Model.Forecast.MetaModel;
    using Resources;

    public class NewForecastDataAccess : BaseDataAccess, INewForecastDataAccess
    {
        public async Task<NewForecastHdpOuData> GetNewForecastData(
            NewForecastHandicapOverUnderMetaModel metaModel,
            NewForecastHdpOuMatchInfo matchInfo)
        {
            using (var db = this.GetObjectDb("Lrf_Forecast_MatchTotalForecast"))
            {
                SetParams(metaModel, db);
                using (var ds = await db.ExecuteDataSetAsync().ConfigureAwait(false))
                {
                    var forecastData = new NewForecastHdpOuData();
                    if (ds.Tables.Count > 1)
                    {
                        var totalTable = ds.Tables[0];
                        var detailTable = ds.Tables[1];
                        foreach (DataRow dr in totalTable.Rows)
                        {
                            forecastData.TotalItemList.Add(new NewForecastHdpOuTotalItem
                            {
                                Type = Converter.ToInt(dr["Type"]),
                                TicketNo = Converter.ToInt(dr["TotalTickets"]),
                                TotalTurnoverHome = Converter.ToDecimal(dr["HomeTurnover" + metaModel.BaseCurrency]),
                                TotalTurnoverAway = Converter.ToDecimal(dr["AwayTurnover" + metaModel.BaseCurrency]),
                                TotalTurnoverOver = Converter.ToDecimal(dr["OverTurnover" + metaModel.BaseCurrency]),
                                TotalTurnoverUnder = Converter.ToDecimal(dr["UnderTurnover" + metaModel.BaseCurrency]),
                            });
                        }

                        foreach (DataRow dr in detailTable.Rows)
                        {
                            forecastData.DetailItemList.Add(new NewForecastHdpOuDetailItem
                            {
                                Bettype = Converter.ToInt(dr["Bettype"]),
                                Hdp = Converter.ToDecimal(dr["Hdp"]),
                                HomeWinLoss = Converter.ToDecimal(dr["HomeWinloss" + metaModel.BaseCurrency]),
                                AwayWinLoss = Converter.ToDecimal(dr["AwayWinloss" + metaModel.BaseCurrency]),
                            });
                        }
                    }

                    var date = db.GetParameterValue("MatchTime")?.ToString();
                    matchInfo.HomeScore = Converter.ToInt(db.GetParameterValue("HomeScore"));
                    matchInfo.AwayScore = Converter.ToInt(db.GetParameterValue("AwayScore"));
                    matchInfo.KickOffDateString = string.IsNullOrEmpty(date)
                        ? ViewResources.Live + "!"
                        : Converter.ToDateTime(date).ToString("MM/dd/yyyy hh:mm tt");
                    return forecastData;
                }
            }
        }

        private static void SetParams(NewForecastHandicapOverUnderMetaModel metaModel, Data.IObjectDb db)
        {
            db.SetParameterValue("AgentList", metaModel.AgentListXml);
            db.SetParameterValue("MatchId", metaModel.MatchId);
            db.SetParameterValue("HomeScore", null);
            db.SetParameterValue("AwayScore", null);
            db.SetParameterValue("MatchTime", null);
        }
    }
}