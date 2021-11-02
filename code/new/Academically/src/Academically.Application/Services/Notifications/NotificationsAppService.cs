using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Notifications;
using Academically.Services.Notifications.Dto;

namespace Academically.Services.Notifications
{
    public class NotificationsAppService : AcademicallyAppServiceBase, INotificationsAppService
    {
        private const int MAX_RECEBT_NOTIFICATIONS = 5;

        private readonly IUserNotificationManager _userNotificationManager;

        public NotificationsAppService(IUserNotificationManager userNotificationManager)
        {
            _userNotificationManager = userNotificationManager;
        }

        public async Task<IEnumerable<UserNotification>> GetRecent()
        {
            var userIdentifier = new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value);
            return await _userNotificationManager.GetUserNotificationsAsync(userIdentifier, maxResultCount: MAX_RECEBT_NOTIFICATIONS);
        }

        public async Task<PagedResultDto<UserNotification>> GetAll(PagedNotificationRequestDto input)
        {
            var userIdentifier = new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value);
            var totalCount = await _userNotificationManager.GetUserNotificationCountAsync(userIdentifier, input.StateFilter);

            var userNotifications = await _userNotificationManager.GetUserNotificationsAsync(
                userIdentifier,
                state: input.StateFilter,
                skipCount: input.SkipCount,
                maxResultCount: input.MaxResultCount
                );

            return new PagedResultDto<UserNotification>(totalCount, userNotifications);
        }

        public async Task UpdateNotificationReadState(System.Guid id)
        {
            await _userNotificationManager.UpdateUserNotificationStateAsync(AbpSession.TenantId, id, UserNotificationState.Read);
        }
    }
}
