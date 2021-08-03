using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Abp.Timing.Timezone;
using Abp.UI;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Domain.Services.CalendarEvents
{
    public class CalendarEventsDomainService : AcademicallyDomainServiceBase, ICalendarEventsDomainService
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly IRepository<UserCalendarEvent, Guid> _userCalendarEventsRepository;
        private readonly ISettingManager _settingManager;

        public CalendarEventsDomainService(
            IRepository<User, long> usersRepository,
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IRepository<UserCalendarEvent, Guid> userCalendarEventsRepository,
            ISettingManager settingManager
            )
        {
            _usersRepository = usersRepository;
            _calendarEventsRepository = calendarEventsRepository;
            _userCalendarEventsRepository = userCalendarEventsRepository;
            _settingManager = settingManager;
        }

        public async Task InsertAsync(CalendarEvent calendarEvent, IEnumerable<long> userIds)
        {
            var timeZone = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);
            foreach (var userId in userIds)
            {
                await CheckScheduleConflictsAsync(calendarEvent, userId, timeZone);

                calendarEvent.UserCalendarEvents.Add(new UserCalendarEvent()
                {
                    UserId = userId,
                });
            }
            await _calendarEventsRepository.InsertAsync(calendarEvent);
        }

        public async Task UpdateAsync(CalendarEvent calendarEvent)
        {
            var userCalendarEvents = await _userCalendarEventsRepository.GetAll()
                .Where(e => e.CalendarEventId == calendarEvent.Id)
                .ToListAsync();
            var timeZone = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);

            foreach (var userCalendarEvent in userCalendarEvents)
            {
                await CheckScheduleConflictsAsync(calendarEvent, userCalendarEvent.UserId, timeZone);
            }

            await _calendarEventsRepository.UpdateAsync(calendarEvent);
        }

        private async Task CheckScheduleConflictsAsync(CalendarEvent calendarEvent, long userId, string timeZone)
        {
            if (calendarEvent.Type != CalendarEventType.Cancelled && calendarEvent.Type != CalendarEventType.Blocker)
            {
                var eventConflict = await _userCalendarEventsRepository.GetAll()
                    .WhereIf(calendarEvent.Id != null || calendarEvent.Id != Guid.Empty, e => e.CalendarEventId != calendarEvent.Id)
                    .Where(e => e.UserId == userId && e.CalendarEvent.Type != CalendarEventType.Cancelled
                        && ((calendarEvent.StartTime >= e.CalendarEvent.StartTime && calendarEvent.StartTime < e.CalendarEvent.EndTime)
                        || (calendarEvent.EndTime > e.CalendarEvent.StartTime && calendarEvent.EndTime <= e.CalendarEvent.EndTime)))
                    .Include(e => e.User)
                    .Include(e => e.CalendarEvent)
                    .FirstOrDefaultAsync();
                if (eventConflict != null)
                {
                    var conflictStartTime = ConvertToTimezoneFromUtc(timeZone, eventConflict.CalendarEvent.StartTime);
                    var conflictEndTime = ConvertToTimezoneFromUtc(timeZone, eventConflict.CalendarEvent.EndTime);
                    var eventStartTime = ConvertToTimezoneFromUtc(timeZone, calendarEvent.StartTime);
                    var eventEndTime = ConvertToTimezoneFromUtc(timeZone, calendarEvent.EndTime);
                    throw new UserFriendlyException(
                        L("CalendarEventConflictDomainErrorTitle"),
                        L("CalendarEventConflictDomainErrorMessage", eventConflict.User.FullName, conflictStartTime, conflictEndTime, calendarEvent.Title, eventStartTime, eventEndTime)
                    );
                }
            }
        }

        private string ConvertToTimezoneFromUtc(string timeZone, DateTime dateTime)
        {
            return TimezoneHelper.ConvertFromUtc(dateTime, timeZone).Value.ToString(AcademicallyConsts.DisplayDateTimeFormat);
        }
    }
}
