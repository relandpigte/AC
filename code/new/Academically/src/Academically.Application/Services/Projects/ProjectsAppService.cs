using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Projects.Dto;

using Abp.Authorization;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Services.UserPublications.Dto;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Academically.Domain.Services.Documents;
using Academically.Authorization.Users;

namespace Academically.Services.Projects
{
    public class ProjectsAppService: AcademicallyAppServiceBase, IProjectsAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public ProjectsAppService(
            UserManager userManager,
            IRepository<Project, Guid> projectsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _projectsRepository = projectsRepository;
            _documentsDomainService = documentsDomainService;
            _userManager = userManager;
        }

        public async Task<PagedResultDto<ProjectDto>> GetAllAsync(PagedProjectRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var query = _projectsRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(u => u.UserEducations)
                    .ThenInclude(u => u.University)
                .WhereIf(input.UserIdFilter > 0, e => e.CreatorUserId == input.UserIdFilter)
                .WhereIf(!input.SearchFilter.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(input.SearchFilter)
                    || e.ServiceNameLevel1.Contains(input.SearchFilter)
                    || e.ServiceNameLevel2.Contains(input.SearchFilter)
                    || e.ServiceNameLevel3.Contains(input.SearchFilter))
                .OrderByDescending(e => e.CreationTime);

            var totalCount = await query.CountAsync();

            var projects = await query
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.UserEducations)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ProjectDto>(e))
                .ToListAsync();

            return new PagedResultDto<ProjectDto>(totalCount, projects);
        }

        public async Task<ProjectDto> GetAsync(Guid id)
        {
            var project = await _projectsRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(u => u.UserEducations)
                .Include(p => p.CreatorUser.ProfilePictureDocument)
                .Include(p => p.Offers)
                .Include(p => p.CreatorUser.CoverPhotoDocument)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return null;

            var projectDto = ObjectMapper.Map<ProjectDto>(project);

            projectDto.CreatorUser.RoleNames = await _userManager.GetRolesAsync(project.CreatorUser);
            projectDto.CanSubmitOffer = !project.Offers.Any(p => p.CreatorUserId == AbpSession.UserId.Value);

            if (project.CreatorUser.ProfilePictureDocumentId.HasValue)
                projectDto.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(project.CreatorUser.ProfilePictureDocumentId.Value);

            if (project.CreatorUser.CoverPhotoDocumentId.HasValue)
                projectDto.CreatorUser.CoverPhotoUrl = await _documentsDomainService.GetFileUrlAsync(project.CreatorUser.CoverPhotoDocumentId.Value);

            return projectDto;
        }

        public async Task CreateAsync(CreateProjectDto input)
        {
            var project = ObjectMapper.Map<Project>(input);
            await _projectsRepository.InsertAsync(project);
        }

        public async Task<ProjectDto> UpdateAsync(UpdateProjectDto input)
        {
            var project = await _projectsRepository.GetAsync(input.Id);
            if (project == null)
                return null;

            ObjectMapper.Map(input, project);

            await _projectsRepository.UpdateAsync(project);

            return ObjectMapper.Map<ProjectDto>(project);
        }

        public async Task DeleteAsync(Guid id)
        {
            var project = await _projectsRepository.GetAsync(id);
            if (project != null)
                await _projectsRepository.UpdateAsync(project);
        }
    }
}
