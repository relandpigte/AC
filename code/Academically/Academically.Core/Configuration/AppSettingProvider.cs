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
                new SettingDefinition(AppSettingNames.Aws_Region, GetFromSettings("Aws:Region")),
                new SettingDefinition(AppSettingNames.Aws_S3_AssetsBucket, GetFromSettings("Aws:S3:AssetsBucket")),
                new SettingDefinition(AppSettingNames.Aws_S3_Folders_ProfilePictures, GetFromSettings("Aws:S3:Folders:ProfilePictures")),
                new SettingDefinition(AppSettingNames.Aws_S3_Folders_UserTutorialPictures, GetFromSettings("Aws:S3:Folders:UserTutorialPictures")),
                new SettingDefinition(AppSettingNames.Address_SuggestUrl, GetFromSettings("Address:SuggestUrl")),
                new SettingDefinition(AppSettingNames.Address_GetDetailsUrl, GetFromSettings("Address:GetDetailsUrl")),
                new SettingDefinition(AppSettingNames.Address_ApiKey, GetFromSettings("Address:ApiKey")),
                new SettingDefinition(AppSettingNames.Address_UrlParameters, GetFromSettings("Address:UrlParameters")),
                new SettingDefinition(AppSettingNames.Services_Tutorial, GetFromSettings("Services:Tutorial")),
                new SettingDefinition(AppSettingNames.RankingWeightings_AreaOfStudyScore, GetFromSettings("RankingWeightings:AreaOfStudyScore")),
                new SettingDefinition(AppSettingNames.RankingWeightings_AreaOfStudyLevelScore, GetFromSettings("RankingWeightings:AreaOfStudyLevelScore")),
                new SettingDefinition(AppSettingNames.RankingWeightings_AreaOfStudyLevelAndAboveScore, GetFromSettings("RankingWeightings:AreaOfStudyLevelAndAboveScore")),
                new SettingDefinition(AppSettingNames.RankingWeightings_MethodologyScore, GetFromSettings("RankingWeightings:MethodologyScore")),
            };
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }
    }
}
