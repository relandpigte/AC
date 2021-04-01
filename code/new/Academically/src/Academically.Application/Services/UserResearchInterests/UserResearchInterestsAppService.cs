using System;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserResearchInterests.Dto;

namespace Academically.Services.UserResearchInterests
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchInterests)]
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

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchInterests_Create)]
        public async Task Create(UserResearchInterestDto input)
        {
            var userResearchInterest = ObjectMapper.Map<UserResearchInterest>(input);
            foreach (var disciplineTaxonomy in input.DisciplineTaxonomies)
            {
                userResearchInterest.UserResearchInterestDisciplineTaxonomies.Add(new UserResearchInterestDisciplineTaxonomy()
                {
                    DisciplineTaxonomyId = disciplineTaxonomy.Id,
                });
            }
            await _userResearchInterestsRepository.InsertAsync(userResearchInterest);
        }
    }
}
