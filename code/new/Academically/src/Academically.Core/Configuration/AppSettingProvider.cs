using System.Collections.Generic;
using Abp.Configuration;
using Microsoft.Extensions.Configuration;

namespace Academically.Configuration
{
    public class AppSettingProvider : SettingProvider
    {
        protected IConfigurationRoot _appConfiguration;

        public AppSettingProvider(IAppConfigurationAccessor configurationAccessor)
        {
            _appConfiguration = configurationAccessor.Configuration;
        }

        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            return new[]
            {
                new SettingDefinition(AppSettingNames.UiTheme, "red", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User, isVisibleToClients: true),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.App_ClientRootAddress),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_Region),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_AssetsBucket),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_SecureAssetsBucket),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_ProfilePictures),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_CoverPhotos),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_Qualifications),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_Passports),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_Educations),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_PhotoIds),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_References),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Aws_S3_Folders_DbsCertificates),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.ITagg_Sms_Username),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.ITagg_Sms_Password),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Email_FromName),
                CreateSettingDefinitionFromAppSetting(AppSettingNames.Email_FromEmail),
            };
        }

        private SettingDefinition CreateSettingDefinitionFromAppSetting(string appSettingName)
        {
            var appSettingKey = appSettingName.ToAppSettingKey();
            return new SettingDefinition(appSettingName, GetFromSettings(appSettingKey));
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }
    }
}
