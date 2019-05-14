using System.Web.Http;
using System.Web.Http.Cors;
using Fanex.Athena.Api.Base;
using Fanex.Athena.Api.Base.Attributes;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    public class PlayerMainController : ExternalApiBaseController
    {

        /**
         * search player list
         * get player detailed infor (use for account info tab)
         */
        [HttpGet]
        public dynamic GetPlayerList(string userName)
        {
            return new[] {
                new {
                    UserNameInput = userName,
                    Status = "Active",
                    UserName = "qatest01",
                    SystemId = "qatestIN0194315",
                    Currency = "RMB",
                    CurrentBalance = 75.60m,
                    OutstandingBalance = 0m,
                    OddsGroup = "A",
                    BaStatus = true,
                    SpecialLevel = "None",
                    LastTransaction = "2/9/2019 8:49:00 AM"
                }
            };
        }
    }
}
