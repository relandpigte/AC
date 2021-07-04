using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserResearchInterests.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserResearchInterests
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchInterests,PermissionNames.Pages_TutorApplications_Research)]
    public class UserResearchInterestsAppService : AcademicallyAppServiceBase, IUserResearchInterestsAppService
    {
        private readonly IRepository<UserResearchInterest, Guid> _userResearchInterestsRepository;
        private readonly IRepository<UserResearchInterestDisciplineTaxonomy, Guid> _userResearchInterestDisciplineTaxonomiesRepository;

        public UserResearchInterestsAppService(
            IRepository<UserResearchInterest, Guid> userResearchInterestsRepository,
            IRepository<UserResearchInterestDisciplineTaxonomy, Guid> userResearchInterestDisciplineTaxonomiesRepository
            )
        {
            _userResearchInterestsRepository = userResearchInterestsRepository;
            _userResearchInterestDisciplineTaxonomiesRepository = userResearchInterestDisciplineTaxonomiesRepository;
        }

        public async Task<PagedResultDto<UserResearchInterestDto>> GetPaged(PagedUserResearchInterestRequestDto input)
        {
            var query = _userResearchInterestsRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserIdFilter);

            var totalCount = await query.CountAsync();
            var userResearchInterests = await query
                .Include(e => e.UserResearchInterestDisciplineTaxonomies)
                    .ThenInclude(e => e.DisciplineTaxonomy)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<UserResearchInterestDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserResearchInterestDto>(totalCount, userResearchInterests);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchInterests_Create)]
        public async Task Create(UserResearchInterestDto input)
        {
            var disciplineTaxonomyIds = input.UserResearchInterestDisciplineTaxonomies
                .Select(e => e.DisciplineTaxonomy.Id)
                .Distinct();
            input.UserResearchInterestDisciplineTaxonomies = null;
            var userResearchInterest = ObjectMapper.Map<UserResearchInterest>(input);
            foreach (var disciplineTaxonomyId in disciplineTaxonomyIds)
            {
                userResearchInterest.UserResearchInterestDisciplineTaxonomies.Add(new UserResearchInterestDisciplineTaxonomy()
                {
                    DisciplineTaxonomyId = disciplineTaxonomyId,
                });
            }
            await _userResearchInterestsRepository.InsertAsync(userResearchInterest);
        }

        public async Task Edit(UserResearchInterestDto input)
        {
            var userResearchInterest = await _userResearchInterestsRepository.GetAsync(input.Id.Value);
            await _userResearchInterestDisciplineTaxonomiesRepository.DeleteAsync(e => e.UserResearchInterestId == userResearchInterest.Id);
            ObjectMapper.Map(input, userResearchInterest);
            await _userResearchInterestsRepository.UpdateAsync(userResearchInterest);
        }

        public async Task Delete(Guid id)
        {
            await _userResearchInterestDisciplineTaxonomiesRepository.DeleteAsync(e => e.UserResearchInterestId == id);
            await _userResearchInterestsRepository.DeleteAsync(id);
        }
    }
}
