using System.Web.Http;
using System.Web.Http.Cors;
using Fanex.Athena.Api.Base.Attributes;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    [AllowAnonymous]
    [ApiOneAuthorization]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PlayerDetailedInfoController : ApiController
    {
        //[HttpGet]
        public dynamic GetAccountProfile()
        {
            return new
            {
                CreatedDate = "02/06/2013",
                LastLogin = "01/20/2017",
                LastTxn = "04/20/2018",
                RegistrationDate = "04/20/2018",
                BaUpdatedBy = "admin",
                LastUpdatedBA = "09/14/2018",
                SpecialLevelBy = "admin",
                LastUpdatedSpecialLevel = "03/05/2019"
            };
        }
    }
}
