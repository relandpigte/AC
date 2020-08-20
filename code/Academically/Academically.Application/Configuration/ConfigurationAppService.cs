using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Academically.Configuration.Dto;

namespace Academically.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : AcademicallyAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
