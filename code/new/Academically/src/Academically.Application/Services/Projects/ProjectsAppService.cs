using Abp;
using Abp.Application.Services.Dto;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Localization;
using Abp.Notifications;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Notifications;
using Academically.Services.Documents.Dto;
using Academically.Services.ProjectOffers.Dto;
using Academically.Services.Projects.Dto;
using Academically.Services.UserServices.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Projects
{
    public class ProjectsAppService : AcademicallyAppServiceBase, IProjectsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<CalendarEvent, Guid> _calendarEventsRepository;
        private readonly IRepository<ResearchMethod, Guid> _researchMethodsRepository;
        private readonly IRepository<Subject, Guid> _subjectsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<UserService, Guid> _userServicesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IEmailService _emailService;
        private readonly INotificationPublisher _notificationPublisher;
        private readonly ISettingManager _settingManager;
        private readonly IRepository<ProjectInvitation, Guid> _projectInvitationsRepository;
        private readonly IRepository<ProjectDocument, Guid> _projectDocumentsRepository;
        private readonly IRepository<ProjectAvailability, Guid> _projectAvailabilitiesRepository;

        public ProjectsAppService(
            RoleManager roleManager,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<CalendarEvent, Guid> calendarEventsRepository,
            IRepository<ResearchMethod, Guid> researchMethodsRepository,
            IRepository<Subject, Guid> subjectsRepository,
            IRepository<User, long> usersRepository,
            IRepository<UserService, Guid> userServicesRepository,
            IDocumentsDomainService documentsDomainService,
            IEmailService emailService,
            INotificationPublisher notificationPublisher,
            ISettingManager settingManager,
            IRepository<ProjectInvitation, Guid> projectInvitationsRepository,
            IRepository<ProjectDocument, Guid> projectDocumentsRepository,
            IRepository<ProjectAvailability, Guid> projectAvailabilitiesRepository
            )
        {
            _roleManager = roleManager;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _calendarEventsRepository = calendarEventsRepository;
            _researchMethodsRepository = researchMethodsRepository;
            _subjectsRepository = subjectsRepository;
            _usersRepository = usersRepository;
            _userServicesRepository = userServicesRepository;
            _documentsDomainService = documentsDomainService;
            _emailService = emailService;
            _notificationPublisher = notificationPublisher;
            _settingManager = settingManager;
            _projectInvitationsRepository = projectInvitationsRepository;
            _projectDocumentsRepository = projectDocumentsRepository;
            _projectAvailabilitiesRepository = projectAvailabilitiesRepository;
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

        public async Task<PagedResultDto<ProjectDto>> GetAllFormHome(PagedResultRequestDto input)
        {
            var query = _projectsRepository.GetAll();
            var totalCount = await query.CountAsync();
            var projects = await query.OrderByDescending(e => e.CreationTime)
                .Include(e => e.CreatorUser)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ProjectDto>(e))
                .ToListAsync();

            return new PagedResultDto<ProjectDto>()
            {
                TotalCount = totalCount,
                Items = projects,
            };
        }

        public async Task<IEnumerable<string>> GetAcademicLevels()
        {
            return await Task.FromResult(new List<string>()
            {
                "Secondary School",
                "Pre-degree",
                "Undergraduate",
                "Graduate",
                "Postgraduate",
                "Doctorate",
            });
        }

        public async Task<IEnumerable<string>> GetAcademicLevelQualifications(string academicLevel)
        {
            var qualifications = new List<string>();
            switch (academicLevel)
            {
                case "Secondary School":
                    qualifications = new List<string>()
                    {
                        "iGCSE",
                        "GCSE",
                    };
                    break;
                case "Pre-degree":
                    qualifications = new List<string>()
                    {
                        "A Level",
                        "AP",
                        "IB",
                    };
                    break;
                case "Undergraduate":
                    qualifications = new List<string>()
                    {
                        "HNC",
                        "HND",
                        "Foundation Degree",
                    };
                    break;
                case "Graduate":
                    qualifications = new List<string>()
                    {
                        "BA",
                        "BSc",
                        "BEng",
                    };
                    break;
                case "Postgraduate":
                    qualifications = new List<string>()
                    {
                        "MSc",
                        "MA",
                        "MEng",
                        "MPhil",
                        "PGCE",
                        "PGDip",
                        "PGCert",
                    };
                    break;
                case "Doctorate":
                    qualifications = new List<string>()
                    {
                        "PhD",
                        "DPhil",
                    };
                    break;
            }
            return await Task.FromResult(qualifications);
        }

        public async Task<IEnumerable<string>> GetResearchMethods()
        {
            return await _researchMethodsRepository.GetAll()
                .Select(e => e.Name)
                .Distinct()
                .OrderBy(e => e)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetSubjects()
        {
            return await _subjectsRepository.GetAll()
                .Select(e => e.Name)
                .Distinct()
                .OrderBy(e => e)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetUrgencyLevels()
        {
            return await Task.FromResult(new List<string>()
            {
                "High",
                "Medium",
                "Low",
            });
        }

        public async Task<ProjectDto> GetAsync(Guid id)
        {
            var project = await _projectsRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(u => u.UserEducations)
                .Include(p => p.CreatorUser.ProfilePictureDocument)
                .Include(p => p.Offers)
                .Include(p => p.CreatorUser.CoverPhotoDocument)
                .Include(p => p.ProjectDocuments)
                    .ThenInclude(e => e.Document)
                .Include(p => p.ProjectAvailabilities)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return null;

            var projectDto = ObjectMapper.Map<ProjectDto>(project);

            projectDto.CreatorUser.RoleNames = await UserManager.GetRolesAsync(project.CreatorUser);
            projectDto.CanSubmitOffer = !project.Offers.Any(p => p.CreatorUserId == AbpSession.UserId.Value);

            if (project.CreatorUser.ProfilePictureDocumentId.HasValue)
                projectDto.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(project.CreatorUser.ProfilePictureDocumentId.Value);

            if (project.CreatorUser.CoverPhotoDocumentId.HasValue)
                projectDto.CreatorUser.CoverPhotoUrl = await _documentsDomainService.GetFileUrlAsync(project.CreatorUser.CoverPhotoDocumentId.Value);

            foreach (var doc in projectDto.ProjectDocuments) doc.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(doc.DocumentId);

            return projectDto;
        }

        public async Task<IEnumerable<ProjectDto>> GetForUserAsync()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var userRoles = await UserManager.GetRolesAsync(user);
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

        public async Task<PagedResultDto<GetAvailalbeTutorDto>> GetAvailableTutors(PagedAvailalbeTutorRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var tutorRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Tutor);
            var tutorsQuery = _usersRepository.GetAll()
                .Where(e => e.Roles.Any(e => e.RoleId == tutorRole.Id))
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter)
                    || e.Surname.ToLower().Contains(input.SearchFilter)
                    || e.About.ToLower().Contains(input.SearchFilter)
                    || e.UserServices.Any(e => e.UserServiceSubjects.Any(e => e.Subject.Name.ToLower().Contains(input.SearchFilter)))
                    || e.UserServices.Any(e => e.UserServiceDisciplineTaxonomies.Any(e => e.DisciplineTaxonomy.Name.ToLower().Contains(input.SearchFilter))));

            var tutors = await tutorsQuery
                .Include(e => e.ProfilePictureDocument)
                .Include(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .OrderBy(e => e.Name)
                    .ThenBy(e => e.Surname)
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToListAsync();
            return await GetTutorsFromQuery(tutors, input);
        }

        public async Task<Guid> CreateAsync(CreateProjectDto input)
        {
            var project = ObjectMapper.Map<Project>(input);
            return await _projectsRepository.InsertAndGetIdAsync(project);
        }

        public async Task<ProjectDto> UploadProjectDocuments([FromForm] UploadProjectDocumentsDto input)
        {
            var project = await _projectsRepository.GetAll()
                            .Include(p => p.ProjectDocuments)
                            .Include(p => p.ProjectAvailabilities)
                            .FirstOrDefaultAsync(p => p.Id == input.ProjectId);
            if (project == null)
                return null;

            var documentIds = project.ProjectDocuments.Select(p => p.DocumentId).ToList();
            await this._projectDocumentsRepository.DeleteAsync(d => d.ProjectId == project.Id);
            documentIds.ForEach(async id => await this._documentsDomainService.DeleteAsync(id));
            project.HasFiles = false;

            var documents = new List<ProjectDocumentDto>();
            if (input.Documents != null && input.Documents.Any())
            {
                foreach (var doc in input.Documents)
                {
                    var document = await _documentsDomainService.CreateAsync(project.CreatorUserId.Value, doc, DocumentType.Project);
                    await _projectDocumentsRepository.InsertAsync(new ProjectDocument()
                    {
                        ProjectId = project.Id,
                        DocumentId = document.Id,
                    });
                    await CurrentUnitOfWork.SaveChangesAsync();
                    documents.Add(new ProjectDocumentDto()
                    {
                        ProjectId = project.Id,
                        DocumentId = document.Id,
                        DocumentUrl = await _documentsDomainService.GetFileUrlAsync(document.Id),
                        Project = ObjectMapper.Map<ProjectDto>(project),
                        Document = ObjectMapper.Map<DocumentDto>(document),
                    });
                }
                project.HasFiles = true;
            }

            var projectDto = ObjectMapper.Map<ProjectDto>(await _projectsRepository.UpdateAsync(project));
            projectDto.ProjectDocuments = documents;

            return projectDto;
        }

        public async Task SendProjectInvitation(Guid id, long tutorId)
        {
            var project = await _projectsRepository.GetAsync(id);
            var student = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var tutor = await UserManager.GetUserByIdAsync(tutorId);
            string clientRootAddress = (await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress)).Trim('/');
            string projectLink = $"{clientRootAddress}/app/projects/browse/{id}";

            string subject = L("ProjectInvitationEmailSubject");
            string body = L("ProjectInvitationEmailMessage", tutor.FullName, student.FullName, project.Name, projectLink);

            await _emailService.SendAsync(tutor.FullName, tutor.EmailAddress, subject, body);

            var notificationData = new LocalizableMessageNotificationData(new LocalizableString("ProjectInvitationNotificationMessage", AcademicallyConsts.LocalizationSourceName));
            notificationData["0"] = student.FullName;
            notificationData["1"] = project.Name;
            notificationData.Properties.Add("Link", projectLink);
            notificationData.Properties.Add("CreatorUserId", AbpSession.UserId.Value);

            await _notificationPublisher.PublishAsync(
                NotificationNames.Notifications_Projects_Invitation,
                notificationData,
                userIds: new[] { new UserIdentifier(tutor.TenantId, tutor.Id) }
            );
            var invitationSent = _projectInvitationsRepository.FirstOrDefault(e => e.ProjectId == project.Id && e.TutorId == tutor.Id && e.CreatorUserId == AbpSession.UserId.Value);
            if (invitationSent == null)
            {
                var projectInvitation = ObjectMapper.Map<ProjectInvitation>(
                new ProjectInvitationsDto
                {
                    ProjectId = project.Id,
                    TutorId = tutor.Id,
                    CreatorUserId = AbpSession.UserId.Value
                });
                await _projectInvitationsRepository.InsertAsync(projectInvitation);
            }
        }

        public async Task<ProjectDto> UpdateAsync(UpdateProjectDto input)
        {
            var project = await _projectsRepository.GetAsync(input.Id);
            if (project == null)
                return null;

            await _projectAvailabilitiesRepository.DeleteAsync(a => a.ProjectId == input.Id);
            await CurrentUnitOfWork.SaveChangesAsync();

            project = await _projectsRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, project);
            project = await _projectsRepository.UpdateAsync(project);

            return ObjectMapper.Map<ProjectDto>(project);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _projectsRepository.DeleteAsync(id);
        }

        public async Task<PagedResultDto<GetAvailalbeTutorDto>> GetProjectInvitationTutors(PagedAvailalbeTutorRequestDto input, Guid projectId)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var tutorRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Tutor);
            var tutorsQuery = _projectInvitationsRepository.GetAll().Where(e => e.CreatorUserId == AbpSession.UserId.Value && e.ProjectId == projectId)
                    .Include(e => e.Tutor)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Tutor.Name.ToLower().Contains(input.SearchFilter)
                    || e.Tutor.Surname.ToLower().Contains(input.SearchFilter)
                    || e.Tutor.UserServices.Any(e => e.UserServiceSubjects.Any(e => e.Subject.Name.ToLower().Contains(input.SearchFilter)))
                    || e.Tutor.UserServices.Any(e => e.UserServiceDisciplineTaxonomies.Any(e => e.DisciplineTaxonomy.Name.ToLower().Contains(input.SearchFilter))));
            var tutors = await tutorsQuery
                .Include(e => e.Tutor.ProfilePictureDocument)
                .Include(e => e.Tutor.UserEducations)
                    .ThenInclude(e => e.University)
                .OrderBy(e => e.Tutor.Name)
                    .ThenBy(e => e.Tutor.Surname)
                .PageBy(input)
                .Take(input.MaxResultCount)
                .Select(e => e.Tutor)
                .ToListAsync();
            return await GetTutorsFromQuery(tutors, input);
        }

        private async Task<PagedResultDto<GetAvailalbeTutorDto>> GetTutorsFromQuery(List<User> tutors, PagedAvailalbeTutorRequestDto input)
        {
            var totalCount = tutors.Count();

            var outputs = new List<GetAvailalbeTutorDto>();
            foreach (var tutor in tutors)
            {
                var tutorOutput = ObjectMapper.Map<UserDto>(tutor);
                if (tutor.UserEducations != null && tutor.UserEducations.Any())
                {
                    tutorOutput.CurrentUniversity = tutor.UserEducations
                        .OrderByDescending(e => e.EndYear)
                            .ThenByDescending(e => e.StartYear)
                       .FirstOrDefault()
                       .University.HeProvider;
                }
                var userServicesOutput = await _userServicesRepository.GetAll()
                    .Where(e => e.CreatorUserId == tutor.Id)
                    .Include(e => e.UserServiceSubjects)
                        .ThenInclude(e => e.Subject)
                    .Include(e => e.UserServiceDisciplineTaxonomies)
                        .ThenInclude(e => e.DisciplineTaxonomy)
                     .Select(e => ObjectMapper.Map<UserServiceForListDto>(e))
                    .ToListAsync();

                outputs.Add(new GetAvailalbeTutorDto()
                {
                    Tutor = tutorOutput,
                    Services = userServicesOutput,
                });
            }
            return new PagedResultDto<GetAvailalbeTutorDto>(totalCount, outputs);
        }
    }
}
