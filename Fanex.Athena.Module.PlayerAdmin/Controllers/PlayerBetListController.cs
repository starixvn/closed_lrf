using System.Web.Mvc;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    public class PlayerBetListController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/PlayerBetList/Index.cshtml");
        }
    }
}
