using System.Web.Mvc;
using Fanex.Athena.Module.PlayerAdmin.Filters;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    [AllowAnonymous]
    public class PlayerAdminController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/Main.cshtml");
        }

        [AllowCrossSiteJson]
        public ActionResult GetPlayerList(string userName)
        {
            return Json(new[] {
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
            }, JsonRequestBehavior.AllowGet);
        }
    }
}