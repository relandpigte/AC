using Abp.Configuration;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.CalendarEvents.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.CalendarEvents
{
    public class CalendarEventsAppService : AcademicallyAppServiceBase, ICalendarEventsAppService
    {
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly ISettingManager _settingManager;

        public CalendarEventsAppService(
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            ISettingManager settingManager
            )
        {
            _calendarEventsRepository = calendarEventsRepository;
            _settingManager = settingManager;
        }

        public async Task<IEnumerable<CalendarEventDto>> GetAll(GetAllCalendarEventsRequestDto input)
        {
            var oneTimeEvents = await _calendarEventsRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserId
                    && e.Recurrence == CalendarEventRecurrence.OneTime
                    && e.Type == input.Type
                    && e.StartTime >= input.StartTime
                    && e.EndTime <= input.EndTime)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();
            var recurringEvents = await _calendarEventsRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserId && e.Recurrence != CalendarEventRecurrence.OneTime && e.Type == input.Type)
                .Select(e => ObjectMapper.Map<CalendarEventDto>(e))
                .ToListAsync();
            var calendarEvents = new List<CalendarEventDto>();
            calendarEvents.AddRange(oneTimeEvents);
            calendarEvents.AddRange(recurringEvents);

            return calendarEvents.OrderBy(e => e.StartTime).ThenBy(e => e.EndTime);
        }

        public async Task Create(CalendarEventDto input)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var calendarEvent = ObjectMapper.Map<CalendarEvent>(input);
            await _calendarEventsRepository.InsertAsync(calendarEvent);
        }

        public async Task Update(CalendarEventDto input)
        {
            var calendarEvent = await _calendarEventsRepository.GetAsync(input.Id.Value);
            ObjectMapper.Map(input, calendarEvent);
            await _calendarEventsRepository.UpdateAsync(calendarEvent);
        }
    }
}
