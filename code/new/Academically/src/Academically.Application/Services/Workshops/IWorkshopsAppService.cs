using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Videos.Dto;
using Academically.Services.Workshops.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Workshops
{
    public interface IWorkshopsAppService : IAsyncCrudAppService<WorkshopDto, Guid, PagedWorkshopResultRequestDto, CreateWorkshopDto, UpdateWorkshopDto>
    {
        IQueryable<WorkshopDto> GetAllWorkshop();
        IQueryable<WorkshopDto> GetWorkshopByKeyword(string keyword);
        Task UpdateStatusAsync(Guid id, WorkshopStatus status);
        Task InvitePresenterAsync(CreateWorkshopPresenterDto input);
        Task UpdatePresenterTypeAsync(UpdateWorkshopPresenterTypeDto input);
        Task RemovePresenterAsync(Guid workshopPresenterId);
        Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedWorkshopPresentersForInviteResultRequestDto input);
        Task<IEnumerable<WorkshopPresenterDto>> GetAllPresenters(Guid id);
        Task<WorkshopDto> UpdateSettingsAsync(UpdateWorkshopSettingsDto input);

    }
}
