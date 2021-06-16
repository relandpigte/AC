using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.CalendarEvents.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.CalendarEvents
{
    public interface ICalendarEventsAppService : IApplicationService
    {
        Task<IEnumerable<CalendarEventDto>> GetAll(GetAllCalendarEventsRequestDto input);
        Task Create(CalendarEventDto input);
        Task Update(CalendarEventDto input);
    }
}
