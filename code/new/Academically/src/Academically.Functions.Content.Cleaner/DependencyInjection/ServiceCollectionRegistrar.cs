using Microsoft.Extensions.DependencyInjection;
using Castle.Windsor.MsDependencyInjection;
using Abp.Dependency;
using Academically.Identity;
using Microsoft.EntityFrameworkCore;
using Academically.EntityFrameworkCore;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using Abp.Reflection.Extensions;
using System;

namespace Academically.Functions.Content.Cleaner.DependencyInjection
{
    public static class ServiceCollectionRegistrar
    {
        public static void Register(IIocManager iocManager)
        {
            var services = new ServiceCollection();

            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var configuration = new ConfigurationBuilder()
                .SetBasePath(typeof(ConsoleModule).GetAssembly().GetDirectoryPathOrNull())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
                .Build();
            // used for app that is injecting IConfiguration
            services.AddSingleton<IConfiguration>(configuration);

            IdentityRegistrar.Register(services);

            var serviceProvider = WindsorRegistrationHelper.CreateServiceProvider(iocManager.IocContainer, services);

            var builder = new DbContextOptionsBuilder<AcademicallyDbContext>();

            iocManager.IocContainer.Register(
                Component
                    .For<DbContextOptions<AcademicallyDbContext>>()
                    .Instance(builder.Options)
                    .LifestyleSingleton()
            );

            //iocManager.Register<IEmailService, SESService>(DependencyLifeStyle.Singleton);
            //iocManager.Register<IAddressLookupService, AddressLookupService>(DependencyLifeStyle.Singleton);
            //iocManager.Register<IPaymentService, PaymentService>(DependencyLifeStyle.Singleton);

            //services.AddEntityFrameworkProxies();
            builder.UseInternalServiceProvider(serviceProvider);

        }
    }
}

