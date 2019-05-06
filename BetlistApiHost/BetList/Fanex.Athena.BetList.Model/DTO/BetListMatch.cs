// -----------------------------------------------------------------------
// <copyright file="BetListMatch.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

using System;

namespace Fanex.Athena.BetList.Model.DTO
{
    using System;

    /// <summary>
    /// BetListMatch class.
    /// </summary>
    public class BetListMatch
    {
        public int SportType { get; set; }

        public string Status { get; set; }

        public int MatchId { get; set; }

        public int LeagueId { get; set; }

        public string MatchCode { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string Race { get; set; }

        public DateTime EventDate { get; set; }
    }
}