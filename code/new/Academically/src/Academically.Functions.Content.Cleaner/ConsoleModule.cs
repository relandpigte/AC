using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Academically.Configuration;
using Academically.EntityFrameworkCore;
using Academically.Functions.Content.Cleaner.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;

namespace Academically.Functions.Content.Cleaner
{
    [DependsOn(typeof(AcademicallyEntityFrameworkModule))]
    public class ConsoleModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public ConsoleModule(AcademicallyEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            _appConfiguration = new ConfigurationBuilder()
                .SetBasePath(typeof(ConsoleModule).GetAssembly().GetDirectoryPathOrNull())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
                .Build();
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = 
                _appConfiguration.GetConnectionString(AcademicallyConsts.ConnectionStringName);

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;

            Configuration.ReplaceService<IAppConfigurationAccessor, ConsoleConfigurationAccessor>();
            Configuration.ReplaceService<IConfiguration, ConfigurationRoot>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ConsoleModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
