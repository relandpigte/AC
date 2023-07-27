using Abp;
using Abp.Castle.Logging.Log4Net;
using Abp.Dependency;
using Abp.Timing;
using Amazon.Lambda.Core;
using Castle.Facilities.Logging;
using System;

namespace Academically.Functions.Content.Cleaner
{
    public class Function
    {
        public void Handler(ILambdaContext context)
        {
            Console.WriteLine("Entry point to Content Cleaner function.");

            using var bootstrapper = AbpBootstrapper.Create<ConsoleModule>();
            try
            {
                Console.WriteLine("Initializing logging facility.");

                bootstrapper.IocManager.IocContainer
                .AddFacility<LoggingFacility>(f =>
                    f.UseAbpLog4Net().WithConfig("log4net.config")
                );
                bootstrapper.Initialize();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Facility of type 'Castle.Facilities.Logging.LoggingFacility' has already been registered with the container. Only one facility of a given type can exist in the container.")
                    Console.WriteLine("Suppress issue with re-registering LoggingFacility facility.");
                else
                    throw;
            }

            Console.WriteLine("Start resolving dependencies for Executer");

            // Getting a Executer object from DI and running it
            using (var executer = bootstrapper.IocManager.ResolveAsDisposable<Executer>())
            {
                Console.WriteLine($"Running Content.Cleaner executer. Date {Clock.Now:O}");
                Console.WriteLine("------------------------------------------------------");

                _ = executer.Object.RunAsync().Result;

            } //Disposes executer and all it's dependencies

            Console.WriteLine("------------------------------------------------------");
            Console.WriteLine($"Done running Content.Cleaner executer. Date {Clock.Now:O}");
        }
    }
}
