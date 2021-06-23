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

namespace Academically.Services.ProjectOffers
{
    public class ProjectOffersAppService : AcademicallyAppServiceBase, IProjectOffersAppService
    {
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;

        public ProjectOffersAppService(
            IDocumentsDomainService documentsDomainService,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<UserEducation, Guid> userEducationsRepository
            )
        {
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
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CreatorUser.UserEducations)
                    .ThenInclude(e => e.University)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ProjectOfferDto>(e))
                .ToListAsync();

            return new PagedResultDto<ProjectOfferDto>(totalCount, projectOffers);
        }

        public async Task<ProjectOfferDto> GetAsync(Guid id)
        {
            var projectOffer = await _projectOffersRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(u => u.UserEducations)
                .Include(p => p.CreatorUser.ProfilePictureDocument)
                .Include(p => p.CreatorUser.CoverPhotoDocument)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return ObjectMapper.Map<ProjectOfferDto>(projectOffer);
        }
    }
}
