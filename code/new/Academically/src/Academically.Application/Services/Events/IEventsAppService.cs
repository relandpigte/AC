using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Events.Dto;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Events
{
    public interface IEventsAppService : IAsyncCrudAppService<EventDto, Guid, PagedEventResultRequestDto, CreateEventDto, UpdateEventDto>
    {
        Task<IEnumerable<AvailableServiceDto>> GetAllEvents();
        Task<IEnumerable<AvailableServiceDto>> GetEventsByKeyword(string keyword, long? creatorUserId);
        Task<PagedResultDto<EventDto>> GetEventSchedules(PagedEventScheduleResultRequestDto input);
        Task<PagedResultDto<StudentEventDto>> GetAllPurchasedAsync(PagedStudentEventResultRequestDto input);
        Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedPresentersForInviteResultRequestDto input);
        Task<IEnumerable<EventPresenterDto>> GetAllPresenters(Guid id);
        Task<IEnumerable<StudentEventDto>> GetAllAudiences(Guid id);
        Task<IEnumerable<EventDto>> GetAllRelated(Guid id);
        Task<PagedResultDto<EventInstanceDto>> GetAllEventInstances(PagedEventInstanceResultRequestDto input);
        Task<StudentEventDto> GetPurchasedAsync(Guid id);
        Task<EventPresenterDto> GetPresenterAsync(Guid id);
        Task UpdateStatusAsync(Guid id, EventStatus status);
        Task<EventDto> UpdateSettingsAsync(UpdateEventSettingsDto input);
        Task PurchaseAsync(CreateStudentEventDto input);
        Task InvitePresenterAsync(CreateEventPresenterDto input);
        Task UpdatePresenterTypeAsync(UpdatePresenterTypeDto input);
        Task UpdatePresenterStatusAsync(UpdateEventPresenterStatusDto input);
        Task RemovePresenterAsync(Guid eventPresenterId);
        Task UnsaveAsync(Guid studentEventId);
        Task UpdateAutoAdmit(Guid id, bool autoAdmitAttendees);
    }
}
