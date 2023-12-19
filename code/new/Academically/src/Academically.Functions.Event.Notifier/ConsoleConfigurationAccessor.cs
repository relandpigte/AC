using Abp.Dependency;
using Abp.Reflection.Extensions;
using Academically.Configuration;
using Microsoft.Extensions.Configuration;
using System;

namespace Academically.Functions.Event.Notifier
{
    public class ConsoleConfigurationAccessor : IAppConfigurationAccessor, ISingletonDependency
    {
        public IConfigurationRoot Configuration { get; }

        public ConsoleConfigurationAccessor()
        {
            Configuration = BuildConfig();
        }

        private IConfigurationRoot BuildConfig()
        {
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var currentPath = typeof(ConsoleModule).GetAssembly().GetDirectoryPathOrNull();
            var builder = new ConfigurationBuilder()
                .SetBasePath(currentPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
                ;

            return builder.Build();
        }

    }
}
