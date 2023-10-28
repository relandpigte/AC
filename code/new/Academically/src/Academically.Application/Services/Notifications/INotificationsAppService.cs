using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Notifications;
using Academically.Services.Notifications.Dto;

namespace Academically.Services.Notifications
{
    public interface INotificationsAppService : IApplicationService
    {
        Task<IEnumerable<UserNotification>> GetRecent();
        Task<PagedResultDto<UserNotification>> GetAllPaged(PagedNotificationRequestDto input);
        Task UpdateNotificationReadState(Guid id);

        Task<NotificationDto> Get(string notificationId);
        Task<IList<NotificationDto>> GetLatest(int take);
        Task<IList<NotificationDto>> GetAll();
        Task Create(CreateNotificationDto input);
        Task Read(string notificationId);
        Task Unread(string notificationId);
    }
}
