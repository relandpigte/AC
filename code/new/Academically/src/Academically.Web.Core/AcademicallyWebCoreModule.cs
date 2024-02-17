using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.SignalR;
using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.Configuration;
using Academically.Application.Shared.Configurations;
using Academically.Application.Shared.Dto;
using Academically.Application.Shared.Services;
using Academically.Authentication.JwtBearer;
using Academically.Aws.Services;
using Academically.Configuration;
using Academically.EntityFrameworkCore;
using Academically.Location.Services;
using Academically.Payment.Services;
using Academically.Sms.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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

            // Disable background worker
            Configuration.BackgroundJobs.IsJobExecutionEnabled = true;

            Configuration.Modules.AbpAspNetCore()
                 .CreateControllersForAppServices(
                     typeof(AcademicallyApplicationModule).GetAssembly()
                 );

            ConfigureTokenAuth();
            RegisterFileManagerService();
            RegisterSmsService();
            RegisterEmailService();
            RegisterPaymentProvider();
            RegisterLocationsProvider();

            // Send all exception to client side
            Configuration.Modules.AbpWebCommon().SendAllExceptionsToClients = true;
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

        private void RegisterPaymentProvider()
        {
            IocManager.Register<IPaymentService, StripePaymentService>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<StripePaymentOptions>();
            var paymentOptions = IocManager.Resolve<StripePaymentOptions>();
            paymentOptions.ClientId = _appConfiguration[AppSettingNames.Providers_Stripe_ClientId.ToAppSettingKey()];
            paymentOptions.PublicKey = _appConfiguration[AppSettingNames.Providers_Stripe_PublicKey.ToAppSettingKey()];
            paymentOptions.SecretKey = _appConfiguration[AppSettingNames.Providers_Stripe_SecretKey.ToAppSettingKey()];
        }

        private void RegisterLocationsProvider()
        {
            IocManager.Register<ILocationsService, GetAddressLocationsService>(Abp.Dependency.DependencyLifeStyle.Singleton);
            IocManager.Register<GetAddressLocationsOptions>();
            var locationOptions = IocManager.Resolve<GetAddressLocationsOptions>();
            locationOptions.ApiKey = _appConfiguration[AppSettingNames.Providers_GetAddress_ApiKey.ToAppSettingKey()];
        }
    }
}
