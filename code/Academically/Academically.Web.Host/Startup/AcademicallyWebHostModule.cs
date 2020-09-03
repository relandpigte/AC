using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Academically.Configuration;
using Academically.Application.Shared.Services;
using Academically.Aws.Services;

namespace Academically.Web.Host.Startup
{
    [DependsOn(
       typeof(AcademicallyWebCoreModule))]
    public class AcademicallyWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public AcademicallyWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AcademicallyWebHostModule).GetAssembly());
            IocManager.Register<IEmailService, SESService>(Abp.Dependency.DependencyLifeStyle.Singleton);
        }
    }
}
