using System.Web.Http;
using Fanex.Athena.Api.Base;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    public class PlayerDetailedInfoController : ExternalApiBaseController
    {
        [HttpPost]
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

        [HttpPost]
        public dynamic GetCustomerBettingStatus()
        {
            return Json(new
            {
                VoidRejectCancel = 20000m,
                Win = 80000m,
                Loss = 40000m,
                Turnover = 50000m,
                Margin = 2
            });
        }
    }
}
