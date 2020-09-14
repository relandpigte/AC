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
                new SettingDefinition(AppSettingNames.App_ClientRootAddress, GetFromSettings("App:ClientRootAddress")),
                new SettingDefinition(AppSettingNames.Email_FromName, GetFromSettings("Email:FromName")),
                new SettingDefinition(AppSettingNames.Email_FromEmail, GetFromSettings("Email:FromEmail")),
                new SettingDefinition(AppSettingNames.Email_SupportEmail, GetFromSettings("Email:SupportEmail")),
            };
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }
    }
}
