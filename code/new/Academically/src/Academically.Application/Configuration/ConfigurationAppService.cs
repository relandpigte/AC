using System.Threading.Tasks;
using Abp;
using Abp.Authorization;
using Abp.Notifications;
using Abp.Runtime.Session;
using Academically.Configuration.Dto;
using Academically.Notifications;

namespace Academically.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : AcademicallyAppServiceBase, IConfigurationAppService
    {
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;

        public ConfigurationAppService(
            INotificationSubscriptionManager notificationSubscriptionManager
            )
        {
            _notificationSubscriptionManager = notificationSubscriptionManager;
        }

        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }

        public async Task ChangeNotificationSettings(ChangeNotificationSettingsDto input)
        {
            if (input.IsNewBookingEnabled)
            {
                await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value),
                    NotificationNames.Notifications_CalendarEvents_NewBooking);
            }
            else
            {
                await _notificationSubscriptionManager.UnsubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value),
                    NotificationNames.Notifications_CalendarEvents_NewBooking);
            }
        }
    }
}
