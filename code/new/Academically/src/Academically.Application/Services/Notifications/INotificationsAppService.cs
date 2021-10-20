using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Notifications;

namespace Academically.Services.Notifications
{
    public interface INotificationsAppService : IApplicationService
    {
        Task<IEnumerable<UserNotification>> GetAll();
    }
}
