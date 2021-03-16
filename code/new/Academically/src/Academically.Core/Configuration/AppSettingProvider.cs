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
                new SettingDefinition(AppSettingNames.Aws_Region, GetFromSettings(AppSettingNames.Aws_Region.ToAppSettingKey())),
                new SettingDefinition(AppSettingNames.Aws_S3_AssetsBucket, GetFromSettings(AppSettingNames.Aws_S3_AssetsBucket.ToAppSettingKey())),
                new SettingDefinition(AppSettingNames.Aws_S3_Folders_CoverPhotos, GetFromSettings(AppSettingNames.Aws_S3_Folders_CoverPhotos.ToAppSettingKey())),
                new SettingDefinition(AppSettingNames.ITagg_Sms_Username, GetFromSettings(AppSettingNames.ITagg_Sms_Username.ToAppSettingKey())),
            };
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }
    }
}
