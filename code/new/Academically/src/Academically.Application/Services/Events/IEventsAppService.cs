using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Events.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Events
{
    public interface IEventsAppService : IAsyncCrudAppService<EventDto, Guid, PagedEventResultRequestDto, CreateEventDto, UpdateEventDto>
    {
        Task<PagedResultDto<EventDto>> GetEventSchedules(PagedEventScheduleResultRequestDto input);
        Task<PagedResultDto<StudentEventDto>> GetAllPurchasedAsync(PagedStudentEventResultRequestDto input);
        Task<StudentEventDto> GetPurchasedAsync(Guid id);
        Task UpdateStatusAsync(Guid id, EventStatus status);
        Task<EventDto> UpdateSettingsAsync(UpdateEventSettingsDto input);
        Task PurchaseAsync(CreateStudentEventDto input);
    }
}
