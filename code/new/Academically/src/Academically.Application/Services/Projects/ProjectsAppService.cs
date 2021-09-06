using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;
using Academically.Services.ProjectOffers.Dto;
using Academically.Services.Projects.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Projects
{
    public class ProjectsAppService: AcademicallyAppServiceBase, IProjectsAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public ProjectsAppService(
            UserManager userManager,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _calendarEventsRepository = calendarEventsRepository;
            _documentsDomainService = documentsDomainService;
            _userManager = userManager;
        }

        public async Task<PagedResultDto<ProjectDto>> GetAllAsync(PagedProjectRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var query = _projectsRepository.GetAll()
                .Where(e => !e.CreatorUser.IsDeleted)
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
                .Include(p => p.CreatorUser)
                    .ThenInclude(u => u.UserEducations)
                        .ThenInclude(u => u.University)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ProjectDto>(e))
                .ToListAsync();

            foreach (var project in projects)
            {
                project.AcceptedOffer = await _projectOffersRepository.GetAll()
                    .Include(e => e.CreatorUser)
                    .Where(e => e.IsAccepted && e.ProjectId == project.Id)
                    .Select(e => ObjectMapper.Map<ProjectOfferDto>(e))
                    .FirstOrDefaultAsync();
                project.TotalSessions = await _calendarEventsRepository.GetAll()
                    .CountAsync(e => e.ProjectId == project.Id);
            }

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

        public async Task<IEnumerable<ProjectDto>> GetForUserAsync()
        {
            var user = await _userManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Any(e => e == StaticRoleNames.Tenants.Tutor))
            {
                return await _projectOffersRepository.GetAll()
                    .Where(e => e.CreatorUserId == user.Id)
                    .Select(e => e.Project)
                    .Distinct()
                    .Select(e => ObjectMapper.Map<ProjectDto>(e))
                    .ToListAsync();
            }
            else
            {
                return await _projectsRepository.GetAll()
                    .Where(e => e.CreatorUserId == user.Id)
                    .Select(e => ObjectMapper.Map<ProjectDto>(e))
                    .ToListAsync();
            }
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
            await _projectsRepository.DeleteAsync(id);
        }
    }
}
