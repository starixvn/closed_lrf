using System;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Web.Compilation;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using CitiXchangeLibrary;
using Fanex.Athena.Api.Base.Logger;
using Fanex.Athena.DataAccess.Report;
using Fanex.Athena.DataAccess.Report.Interfaces;
using Fanex.Athena.Extension.Utility.Internal;
using Fanex.Logging;
using ONEbook.UM.Services;
using ONEbook.UM.Services.Impl;

namespace Fanex.Athena
{
    public static class DIConfig
    {
        private static readonly Func<Assembly, bool> FilterDashboardApi = (a) => a.FullName.Contains("Fanex.Athena.Module.Dashboard");

        public static void Register()
        {
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;
            var assemblies = GetAssemblies();
            var serviceAssemblies = GetServiceAssemblies(assemblies);
            var controllerAssemblies = GetControllerAssemblies(assemblies);
            var apiControllerAssemblies = GetApiControllerAssemblies(assemblies);
            builder.RegisterAssemblyTypes(serviceAssemblies).AsImplementedInterfaces();
            builder.RegisterControllers(controllerAssemblies);
            builder.RegisterApiControllers(apiControllerAssemblies);

            builder.RegisterFilterProvider();
            builder.RegisterWebApiFilterProvider(config);

            RegisterThirdpartyServices(builder);

            // generic types
            builder.RegisterGeneric(typeof(ThirdPartyWinLossDataAccess<>))
                .As(typeof(IThirdPartyWinLossDataAccess<>));

            // static services
            builder.RegisterInstance(new CustomMemoryCache()).As<ICustomMemoryCache>();

            builder.RegisterType<ApiExceptionLogger>().As<IExceptionLogger>();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static void RegisterThirdpartyServices(ContainerBuilder builder)
        {
            builder.RegisterType<MaintenanceService>().As<IMaintenanceService>();

            builder.RegisterInstance(Logger.Log).As<Logging.ILogger>();

            builder.Register(x => (ICitiXchangeClient)Activator.GetObject(typeof(ICitiXchangeClient), ConfigurationManager.AppSettings["ExchangeProductApiHost"]))
                .As<ICitiXchangeClient>()
                .ExternallyOwned();
        }

        private static Assembly[] GetAssemblies()
        {
            Assembly[] assemblies = null;
            try
            {
                assemblies = BuildManager.GetReferencedAssemblies().Cast<Assembly>().ToArray();
            }
            catch
            {
                assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(i => !i.IsDynamic).ToArray();
            }

            return assemblies.Where(x => x.FullName.StartsWith("Fanex.Athena", StringComparison.InvariantCulture))
                .ToArray();
        }

        private static Assembly[] GetServiceAssemblies(Assembly[] assemblies)
        {
            string[] controllerFileNames = new[]
            {
                "Fanex.Athena.Controllers",
                "Fanex.Athena.Api",
				"Fanex.Athena.Module.Controllers"
            };
            return assemblies.Where(ass => !controllerFileNames.Any(x => ass.FullName.Contains(x))).ToArray();
        }

        private static Assembly[] GetControllerAssemblies(Assembly[] assemblies)
        {
            return assemblies.Where(ass => ass.FullName.Contains("Fanex.Athena.Controllers") || ass.FullName.Contains("Fanex.Athena.Module")).ToArray();
        }

        private static Assembly[] GetApiControllerAssemblies(Assembly[] assemblies)
        {
            return assemblies.Where(ass => ass.FullName.Contains("Fanex.Athena.Api") || FilterDashboardApi(ass)).ToArray();
        }
    }
}