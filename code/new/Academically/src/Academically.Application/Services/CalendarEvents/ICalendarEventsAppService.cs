using Abp.Application.Services;
using Academically.Services.CalendarEvents.Dto;
using Academically.Services.Projects.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.CalendarEvents
{
    public interface ICalendarEventsAppService : IApplicationService
    {
        Task<IEnumerable<CalendarEventDto>> GetAll(GetAllCalendarEventsRequestDto input);
        Task<IEnumerable<ProjectDto>> GetUserProjects(long userId);
        Task Create(CalendarEventDto input);
        Task Update(CalendarEventDto input);
        Task Reschedule(RescheduleCalendarEventDto input);
        Task Accept(Guid id, long tutorId);
        Task Decline(RescheduleCalendarEventDto input);
    }
}
