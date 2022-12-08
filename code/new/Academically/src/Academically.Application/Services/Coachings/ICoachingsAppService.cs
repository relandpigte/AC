using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Coachings.Dto;
using Academically.Services.Posts.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Coachings
{
    public interface ICoachingsAppService : IAsyncCrudAppService<CoachingDto, Guid, PagedCoachingResultRequestDto, CreateCoachingDto, UpdateCoachingDto>
    {
        Task UpdateStatusAsync(Guid id, CoachingStatus status);
        Task InvitePresenterAsync(CreateCoachingPresenterDto input);
        Task UpdatePresenterTypeAsync(UpdateCoachingPresenterTypeDto input);
        Task RemovePresenterAsync(Guid coachingPresenterId);
        Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedCoachingPresentersForInviteResultRequestDto input);
        Task<IEnumerable<CoachingPresenterDto>> GetAllPresenters(Guid id);
        Task<CoachingDto> UpdateSettingsAsync(UpdateCoachingSettingsDto input);
        Task<IEnumerable<AvailableServiceDto>> GetAllCoaching();
        Task<IEnumerable<AvailableServiceDto>> GetCoachingByKeyword(string keyword);
    }
}
