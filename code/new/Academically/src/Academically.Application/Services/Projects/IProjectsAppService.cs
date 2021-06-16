using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Projects.Dto;

namespace Academically.Services.Projects
{
    public interface IProjectsAppService : IApplicationService
    {
        Task<PagedResultDto<ProjectDto>> GetAllAsync(PagedProjectRequestDto input);
        Task CreateAsync(CreateProjectDto input);
        Task<ProjectDto> UpdateAsync(UpdateProjectDto input);
        Task DeleteAsync(Guid id);
    }
}