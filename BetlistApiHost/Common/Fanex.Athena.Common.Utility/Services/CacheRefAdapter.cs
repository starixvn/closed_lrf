using System;
using System.Threading;
using Fanex.Athena.Common.Utility.Services.Interfaces;
using Fanex.RemotingRef;

namespace Fanex.Athena.Common.Utility.Services
{
    public class CacheRefAdapter : ICacheRefAdapter
    {
#pragma warning disable CS3001 // Argument type is not CLS-compliant
        public CacheRefAdapter(IRemotingRefService remotingRefService)
#pragma warning restore CS3001 // Argument type is not CLS-compliant
        {
            RemotingRefService = remotingRefService;
        }
        [CLSCompliant(false)]
        public IRemotingRefService RemotingRefService { get; }

        public string GetSportName(object sportId, string languageCode = null)
        {
            if (!IsValidId(sportId))
            {
                return string.Empty;
            }

            return RemotingRefService.GetSportName(sportId.ToString(), GetCurrentIBCLanguageCode(languageCode), string.Empty);
        }

        public string GetLeagueName(object leagueId)
        {
            if (!IsValidId(leagueId))
            {
                return string.Empty;
            }

            return RemotingRefService.GetLeagueName(leagueId.ToString(), GetCurrentIBCLanguageCode(), string.Empty);
        }

        public string[] GetCombinationTypeCombo(string betTeam, string betCheck, decimal handicap1, 
            decimal handicap2)
        {
            return RemotingRefService.GetCombinationTypeCombo(betTeam, betCheck,
                Convert.ToInt32(handicap1), Convert.ToInt32(handicap2), GetCurrentIBCLanguageCode());
        }

        public string[] GetBetBuilderSelectionNames(int[] selectionIds)
        {
            return RemotingRefService.GetBetBuilderSelectionNames(selectionIds, GetCurrentIBCLanguageCode());
        }

        private static bool IsValidId(object id)
        {
            return id != null && id.ToString() != string.Empty && id.ToString() != "0";
        }

        private static string GetCurrentIBCLanguageCode(string languageCode = null)
        {
            return string.IsNullOrEmpty(languageCode) ? Thread.CurrentThread.CurrentUICulture.IetfLanguageTag : languageCode;
        }
    }
}