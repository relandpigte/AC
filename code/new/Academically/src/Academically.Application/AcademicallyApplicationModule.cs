using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Academically.Authorization;
using Academically.Services.CalendarEvents.Notifications;

namespace Academically
{
    [DependsOn(
        typeof(AcademicallyCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class AcademicallyApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<AcademicallyAuthorizationProvider>();
            Configuration.Notifications.Providers.Add<CalendarEventsNotificationProvider>();

            // Enable auditing for the application
            Configuration.Auditing.IsEnabled = true;

            // Disable background worker
            Configuration.BackgroundJobs.IsJobExecutionEnabled = true;
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(AcademicallyApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
