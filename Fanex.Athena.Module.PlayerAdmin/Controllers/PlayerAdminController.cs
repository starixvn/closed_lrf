using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    public class PlayerAdminController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Desktop/Module/PlayerAdmin/Main.cshtml");
        }
    }
}
