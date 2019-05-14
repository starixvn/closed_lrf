using Fanex.Athena.Api.Base.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Fanex.Athena.Api.Base
{
    [AllowAnonymous]
    [ApiOneAuthorization]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ExternalApiBaseController : ApiController
    {
        public string UserName => (string)ActionContext.ActionArguments["username"];

        public string SiteName => (string)ActionContext.ActionArguments["sitename"];

        public string Language => (string)ActionContext.ActionArguments["language"];

        public int LicenseeId => (int)ActionContext.ActionArguments["licenseeid"];

        public int UserId => (int)ActionContext.ActionArguments["userid"];

        public string CurrencyIDList => (string)ActionContext.ActionArguments["currencyIDList"];

    }
}
