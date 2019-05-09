namespace Fanex.Athena.Api.Base.UnitTests
{
    using System.Collections.Generic;
    using Extension.Utility;
    using Model.Core.DTO.Common;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Common.Interfaces;
    using Service.Core.Users.Interfaces;
    using Session.Model;

    public abstract class BaseApiControllerHelperTest
    {
        protected const int SessionLicenseeId = 1;

        protected const string SessionLicenseeName = "Test";

        protected const int SessionUserId = 1;

        protected const string SessionUserName = "Test User";

        protected const string SessionLanguage = "en-US";

        protected const string AgentListXml = "XmlData";

        protected ISessionService SessionService { get; private set; }

        protected IProductService ProductService { get; private set; }

        protected IAppSettings AppSetting { get; private set; }

        protected ILanguageService LangService { get; private set; }

        protected IDictionary<int, string> UserCurrencyList => SessionService.UserSession.CurrencyList;

        [OneTimeSetUp]
        public virtual void FixtureSetUp()
        {
            SessionService = Substitute.For<ISessionService>();
            SessionService.UserSession.Returns(new UserSession
            {
                Language = SessionLanguage,
                CurrencyList = new Dictionary<int, string>()
            });
            ProductService = Substitute.For<IProductService>();
            AppSetting = Substitute.For<IAppSettings>();
            LangService = Substitute.For<ILanguageService>();

            LangService.GetCurrentLanguage().Returns("en-US");
            LangService.When(x => x.SetPageCulture(Arg.Any<string>())).DoNotCallBase();
        }

        [OneTimeTearDown]
        public virtual void FixtureTearDown()
        {
            SessionService = null;
            ProductService = null;
            AppSetting = null;
            LangService = null;
        }

        protected void MockSessionData()
        {
            var userSession = new UserSession
            {
                UserId = SessionUserId,
                UserName = SessionUserName,
                CurrencyList = new Dictionary<int, string> { { -1, "EUR" }, { -2, "USD" } },
                Language = SessionLanguage
            };

            var licenseeSession = new LicenseeSession
            {
                LicenseeId = SessionLicenseeId,
                LicenseeName = SessionLicenseeName
            };

            StubUserSessionData(userSession);
            StubLicenseeSessionData(licenseeSession);
            SessionService.GenerateAgentListXml(Arg.Any<int>(), Arg.Any<bool>()).Returns(AgentListXml);
        }

        protected void StubProductAccess(string[] productCode, string functionConfigKey, bool isSingleWalletOnly = false)
        {
            var productList = new List<Product>();

            for (var i = 0; i < productCode.Length; i++)
            {
                productList.Add(new Product { ProductCode = productCode[i] });
            }

            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), functionConfigKey, isSingleWalletOnly)
                .Returns(new ProductAccess(productList));
        }

        protected void StubUserSessionData(UserSession userSession)
        {
            SessionService.UserSession.Returns(userSession);
        }

        protected void StubLicenseeSessionData(LicenseeSession licenseeSession)
        {
            SessionService.LicenseeSession.Returns(licenseeSession);
        }

        protected void StubGetValueAppSettings(string valueName, string value)
        {
            AppSetting.GetValue(valueName).Returns(value);
        }
    }
}