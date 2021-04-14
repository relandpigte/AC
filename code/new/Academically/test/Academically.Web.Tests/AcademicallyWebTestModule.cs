using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Academically.EntityFrameworkCore;
using Academically.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Academically.Web.Tests
{
    [DependsOn(
        typeof(AcademicallyWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class AcademicallyWebTestModule : AbpModule
    {
        public AcademicallyWebTestModule(AcademicallyEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AcademicallyWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(AcademicallyWebMvcModule).Assembly);
        }
    }
}