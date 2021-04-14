using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.SignalR;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.Configuration;
using Academically.Authentication.JwtBearer;
using Academically.Configuration;
using Academically.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SourceCloud.Core.Configurations;
using SourceCloud.Core.Services;
using SourceCloud.Provider.Aws;
using SourceCloud.Provider.ITagg;
using System;
using System.Text;

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
            RegisterFileManagerService();
            RegisterSmsService();
            RegisterEmailService();
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

        private void RegisterFileManagerService()
        {
            IocManager.Register<IFileManagerService, S3Service>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<FileManagerConfiguration>();
            var fileManagerConfig = IocManager.Resolve<FileManagerConfiguration>();
            fileManagerConfig.Bucket = _appConfiguration[AppSettingNames.Aws_S3_AssetsBucket.ToAppSettingKey()];
            fileManagerConfig.SecuredBucket = _appConfiguration[AppSettingNames.Aws_S3_SecureAssetsBucket.ToAppSettingKey()];
            fileManagerConfig.Region = _appConfiguration[AppSettingNames.Aws_Region.ToAppSettingKey()];
        }

        private void RegisterSmsService()
        {
            IocManager.Register<ISmsService, ITaggSmsService>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<SmsConfiguration>();
            var smsConfig = IocManager.Resolve<SmsConfiguration>();
            smsConfig.Username = _appConfiguration[AppSettingNames.ITagg_Sms_Username.ToAppSettingKey()];
            smsConfig.Password = _appConfiguration[AppSettingNames.ITagg_Sms_Password.ToAppSettingKey()];
        }

        private void RegisterEmailService()
        {
            IocManager.Register<IEmailService, SESService>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<EmailConfiguration>();
            var emailConfig = IocManager.Resolve<EmailConfiguration>();
            emailConfig.FromName = _appConfiguration[AppSettingNames.Email_FromName.ToAppSettingKey()];
            emailConfig.FromEmail = _appConfiguration[AppSettingNames.Email_FromEmail.ToAppSettingKey()];
        }
    }
}
