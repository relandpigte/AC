using System.Threading.Tasks;
using Academically.Configuration.Dto;

namespace Academically.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
        Task ChangeNotificationSettings(ChangeNotificationSettingsDto input);
    }
}
