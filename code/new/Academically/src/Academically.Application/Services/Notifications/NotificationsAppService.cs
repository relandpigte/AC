using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Abp.Notifications;

namespace Academically.Services.Notifications
{
    public class NotificationsAppService : AcademicallyAppServiceBase, INotificationsAppService
    {
        private const int MAX_LATEST_NOTIFICATIONS = 5;

        private readonly IUserNotificationManager _userNotificationManager;

        public NotificationsAppService(IUserNotificationManager userNotificationManager)
        {
            _userNotificationManager = userNotificationManager;
        }

        public async Task<IEnumerable<UserNotification>> GetAll()
        {
            var userIdentifier = new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value);
            return await _userNotificationManager.GetUserNotificationsAsync(userIdentifier, maxResultCount: MAX_LATEST_NOTIFICATIONS);
        }
    }
}
