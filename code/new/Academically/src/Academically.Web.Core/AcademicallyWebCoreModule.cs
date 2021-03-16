using System;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.SignalR;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.Configuration;
using Academically.Authentication.JwtBearer;
using Academically.Configuration;
using Academically.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Academically.Application.Shared.Services;
using Academically.Aws.Services;
using SourceCloud.Core.Services;
using SourceCloud.Providers.ITagg;
using SourceCloud.Core.Configurations;

namespace Academically
{
    [DependsOn(
         typeof(AcademicallyApplicationModule),
         typeof(AcademicallyEntityFrameworkModule),
         typeof(AbpAspNetCoreModule)
        ,typeof(AbpAspNetCoreSignalRModule)
     )]
    public class AcademicallyWebCoreModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public AcademicallyWebCoreModule(IWebHostEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                AcademicallyConsts.ConnectionStringName
            );

            // Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            Configuration.Modules.AbpAspNetCore()
                 .CreateControllersForAppServices(
                     typeof(AcademicallyApplicationModule).GetAssembly()
                 );

            ConfigureTokenAuth();
            RegistersSmsService();

            IocManager.Register<IFileManagerService, S3Service>(Abp.Dependency.DependencyLifeStyle.Singleton);
        }

        private void ConfigureTokenAuth()
        {
            IocManager.Register<TokenAuthConfiguration>();
            var tokenAuthConfig = IocManager.Resolve<TokenAuthConfiguration>();
            tokenAuthConfig.SecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appConfiguration["Authentication:JwtBearer:SecurityKey"]));
            tokenAuthConfig.Issuer = _appConfiguration["Authentication:JwtBearer:Issuer"];
            tokenAuthConfig.Audience = _appConfiguration["Authentication:JwtBearer:Audience"];
            tokenAuthConfig.SigningCredentials = new SigningCredentials(tokenAuthConfig.SecurityKey, SecurityAlgorithms.HmacSha256);
            tokenAuthConfig.Expiration = TimeSpan.FromDays(1);
        }

        private void RegistersSmsService()
        {
            IocManager.Register<ISmsService, ITaggSmsService>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<SmsConfiguration>();
            var smsConfig = IocManager.Resolve<SmsConfiguration>();
            smsConfig.Username = _appConfiguration[AppSettingNames.ITagg_Sms_Username.ToAppSettingKey()];
            smsConfig.Password = _appConfiguration[AppSettingNames.ITagg_Sms_Password.ToAppSettingKey()];
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AcademicallyWebCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(AcademicallyWebCoreModule).Assembly);
        }
    }
}
