namespace Fanex.Athena.Module.Dashboard.Api
{
    using Fanex.Athena.Api.Base;
    using Fanex.Athena.Module.Dashboard.MetaModel;

    public class BaseDashboardApiController : ExternalApiBaseController
    {
        protected void AssignAuthProperties(DashboardBaseModel model)
        {
            model.LicenseeId = this.LicenseeId;
            model.CurrencyIDList = model.CurrencyId == 0 ? CurrencyIDList : model.CurrencyId.ToString();
        }
    }
}