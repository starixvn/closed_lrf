using System.Web.Http;
using System.Web.Http.Cors;
using Fanex.Athena.Api.Base.Attributes;

namespace Fanex.Athena.Module.PlayerAdmin.Api
{
    [AllowAnonymous]
    [ApiOneAuthorization]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PlayerAdminController:ApiController
    {
       
    }
}
