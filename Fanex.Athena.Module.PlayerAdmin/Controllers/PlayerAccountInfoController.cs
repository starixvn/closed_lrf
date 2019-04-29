using System.Web.Mvc;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    public class PlayerAccountInfoController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/PlayerAccountInfo/Index.cshtml");
        }
    }
}
