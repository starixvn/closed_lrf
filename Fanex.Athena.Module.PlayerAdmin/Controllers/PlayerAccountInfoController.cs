using System.Web.Mvc;
using Fanex.Athena.Module.PlayerAdmin.Filters;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    [AllowAnonymous]
    public class PlayerAccountInfoController : Controller
    {
        public PlayerAccountInfoController()
        {
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/PlayerAccountInfo/Index.cshtml");
        }

        [AllowCrossSiteJson]
        public ActionResult GetAccountProfile()
        {
            return Json(new
            {
                CreatedDate = "02/06/2013",
                LastLogin = "01/20/2017",
                LastTxn = "04/20/2018",
                RegistrationDate = "04/20/2018",
                BaUpdatedBy = "admin",
                LastUpdatedBA = "09/14/2018",
                SpecialLevelBy = "admin",
                LastUpdatedSpecialLevel = "03/05/2019"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
