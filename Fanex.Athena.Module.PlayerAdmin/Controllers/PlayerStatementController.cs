using System.Web.Mvc;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    public class PlayerStatementController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/PlayerStatement/Index.cshtml");
        }
    }
}
