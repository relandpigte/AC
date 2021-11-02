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
        Task<PagedResultDto<UserNotification>> GetAll(PagedNotificationRequestDto input);
        Task UpdateNotificationReadState(Guid id);
    }
}
