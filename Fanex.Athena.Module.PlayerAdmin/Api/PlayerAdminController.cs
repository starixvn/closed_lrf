using System.Web.Http;
using System.Web.Http.Cors;
using Fanex.Athena.Api.Base.Attributes;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    [AllowAnonymous]
    [ApiOneAuthorization]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PlayerAdminController : ApiController
    {
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
