using Abp;
using Abp.Castle.Logging.Log4Net;
using Abp.Dependency;
using Abp.Timing;
using Castle.Facilities.Logging;
using System;

namespace Academically.Functions.Event.Notifier
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var bootstrapper = AbpBootstrapper.Create<ConsoleModule>())
            {
                bootstrapper.IocManager.IocContainer
                    .AddFacility<LoggingFacility>(f => 
                        f.UseAbpLog4Net().WithConfig("log4net.config")
                    );

                bootstrapper.Initialize();

                //Getting a Executer object from DI and running it
                using (var executer = bootstrapper.IocManager.ResolveAsDisposable<Executer>())
                {
                    Console.WriteLine($"Running Event Notifier executer. Date {Clock.Now:O}");
                    _ = executer.Object.RunAsync().Result;

                } //Disposes executer and all it's dependencies

                Console.WriteLine($"Done running Event Notifier executer. Date {Clock.Now:O}");
            }
        }
    }
}
