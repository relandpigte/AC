using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Projects.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Projects
{
    public interface IProjectsAppService : IApplicationService
    {
        Task<PagedResultDto<ProjectDto>> GetAllAsync(PagedProjectRequestDto input);
        Task<IEnumerable<string>> GetAcademicLevels();
        Task<IEnumerable<string>> GetAcademicLevelQualifications(string academicLevel);
        Task<IEnumerable<string>> GetResearchMethods();
        Task<IEnumerable<string>> GetSubjects();
        Task<IEnumerable<string>> GetUrgencyLevels();
        Task<PagedResultDto<GetAvailalbeTutorDto>> GetAvailableTutors(PagedAvailalbeTutorRequestDto input);
        Task<ProjectDto> GetAsync(Guid id);
        Task<IEnumerable<ProjectDto>> GetForUserAsync();
        Task<Guid> CreateAsync(CreateProjectDto input);
        Task<ProjectDto> UpdateAsync(UpdateProjectDto input);
        Task DeleteAsync(Guid id);
    }
}