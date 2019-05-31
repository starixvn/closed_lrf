using System.Web.Http;
using Fanex.Athena.Api.Base;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    public class PlayerMainController : ExternalApiBaseController
    {

        /**
         * search player list
         */
        [HttpPost]
        public dynamic Search(string userName = "")
        {
            return new[] {
                new {
                    CustId = 1,
                    UserNameInput = userName,
                    UserName = "qatest01",
                    SystemId = "qatestIN0194315",
                    Currency = "RMB",
                    CurrentBalance = 75.60m,
                    OutstandingBalance = 0m,
                    OddsGroup = "A",
                    BaStatus = true,
                    SpecialLevel = "None",
                    LastTransaction = "2/9/2019 8:49:00 AM"
                },
                new {
                    CustId = 2,
                    UserNameInput = userName,
                    UserName = "qatest02",
                    SystemId = "qatestIN0208741",
                    Currency = "RMB",
                    CurrentBalance = 75.60m,
                    OutstandingBalance = 0m,
                    OddsGroup = "A",
                    BaStatus = false,
                    SpecialLevel = "None",
                    LastTransaction = "2/9/2019 8:49:00 AM"
                }
            };
        }
    }
}
