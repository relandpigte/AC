using Abp.Application.Services.Dto;
using Abp.Notifications;

namespace Academically.Services.Notifications.Dto
{
    public class PagedNotificationRequestDto : PagedResultRequestDto
    {
        public string SearchFilter { get; set; }
        public UserNotificationState? StateFilter { get; set; }
    }
}
