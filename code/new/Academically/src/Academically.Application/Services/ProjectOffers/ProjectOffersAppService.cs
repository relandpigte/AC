using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Academically.Domain.Entities;
using Academically.Services.ProjectOffers.Dto;
using Academically.Services.Projects.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Linq.Extensions;
using Academically.Domain.Services.Documents;
using Academically.Authorization.Users;

namespace Academically.Services.ProjectOffers
{
    public class ProjectOffersAppService : AcademicallyAppServiceBase, IProjectOffersAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;

        public ProjectOffersAppService(
            UserManager userManager,
            IDocumentsDomainService documentsDomainService,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<UserEducation, Guid> userEducationsRepository
            )
        {
            _userManager = userManager;
            _projectOffersRepository = projectOffersRepository;
            _documentsDomainService = documentsDomainService;
            _userEducationsRepository = userEducationsRepository;
        }

        public async Task CreateAsync(CreateProjectOfferDto input)
        {
            var projectOffer = ObjectMapper.Map<ProjectOffer>(input);
            await _projectOffersRepository.InsertAsync(projectOffer);
        }

        public async Task<PagedResultDto<ProjectOfferDto>> GetAllAsync(PagedProjectOfferRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var query = _projectOffersRepository.GetAll()
                .WhereIf(input.UserIdFilter > 0, e => e.CreatorUserId == input.UserIdFilter)
                .WhereIf(input.ProjectIdFilter != null, e => e.ProjectId == input.ProjectIdFilter)
                .WhereIf(!input.SearchFilter.IsNullOrWhiteSpace(), e => e.Project.Name.ToLower().Contains(input.SearchFilter)
                    || e.Project.ServiceNameLevel1.Contains(input.SearchFilter)
                    || e.Project.ServiceNameLevel2.Contains(input.SearchFilter)
                    || e.Project.ServiceNameLevel3.Contains(input.SearchFilter))
                .OrderByDescending(e => e.CreationTime);

            var totalCount = await query.CountAsync();

            var projectOffers = await query
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .Include(e => e.CreatorUser.ProfilePictureDocument)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ProjectOfferDto>(e))
                .ToListAsync();

            return new PagedResultDto<ProjectOfferDto>(totalCount, projectOffers);
        }

        public async Task<ProjectOfferDto> GetAsync(Guid id)
        {
            var projectOffer = await _projectOffersRepository.GetAll()
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .Include(p => p.CreatorUser.ProfilePictureDocument)
                .Include(p => p.CreatorUser.CoverPhotoDocument)
                .Include(p => p.Project)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (projectOffer == null)
                return null;

            var projectOfferDto = ObjectMapper.Map<ProjectOfferDto>(projectOffer); ;
            projectOfferDto.CreatorUser.RoleNames = await _userManager.GetRolesAsync(projectOffer.CreatorUser);

            if (projectOffer.CreatorUser.ProfilePictureDocumentId.HasValue)
                projectOfferDto.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(projectOffer.CreatorUser.ProfilePictureDocumentId.Value);

            if (projectOffer.CreatorUser.CoverPhotoDocumentId.HasValue)
                projectOfferDto.CreatorUser.CoverPhotoUrl = await _documentsDomainService.GetFileUrlAsync(projectOffer.CreatorUser.CoverPhotoDocumentId.Value);

            return projectOfferDto;
        }
    }
}
