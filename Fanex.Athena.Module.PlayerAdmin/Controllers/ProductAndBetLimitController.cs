using Fanex.Athena.Controllers;
using Fanex.Athena.Extension.Utility;
using Fanex.Athena.Service.Core.Common.Interfaces;
using Fanex.Athena.Service.Core.Users.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.Athena.Module.PlayerAdmin.Controllers
{
    /// <summary>
    /// Iframe function
    /// </summary>
    public class ProductAndBetLimitController : CultureBaseController
    {
        public ProductAndBetLimitController(ILanguageService languageService,
           ISessionService sessionService,
            IAppSettings appSetting
           )
        : base(languageService, sessionService, appSetting)
        {

        }

    }
}
