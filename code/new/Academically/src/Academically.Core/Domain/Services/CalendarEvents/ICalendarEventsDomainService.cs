using Abp.Domain.Services;
using Academically.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Domain.Services.CalendarEvents
{
    public interface ICalendarEventsDomainService : IDomainService
    {
        Task InsertAsync(CalendarEvent calendarEvent, IEnumerable<long> userIds);
        Task UpdateAsync(CalendarEvent calendarEvent);
    }
}
