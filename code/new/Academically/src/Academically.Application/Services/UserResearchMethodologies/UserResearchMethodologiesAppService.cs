using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserResearchMethodologies.Dto;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserResearchMethodologies
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchMethodologies)]
    public class UserResearchMethodologiesAppService : AcademicallyAppServiceBase, IUserResearchMethodologiesAppService
    {
        private readonly IRepository<UserResearchMethodology, Guid> _userResearchMethodologiesRepository;

        public UserResearchMethodologiesAppService(
            IRepository<UserResearchMethodology, Guid> userResearchMethodologiesRepository
            )
        {
            _userResearchMethodologiesRepository = userResearchMethodologiesRepository;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Create)]
        public async Task Create(UserResearchMethodologyDto input)
        {
            var researchMethodIds = input.UserResearchMethodologyResearchMethods
                .Select(e => e.ResearchMethod.Id)
                .Distinct();
            input.UserResearchMethodologyResearchMethods = null;
            var userResearchMethodology = ObjectMapper.Map<UserResearchMethodology>(input);
            foreach (var researchMethodId in researchMethodIds)
            {
                userResearchMethodology.UserResearchMethodologyResearchMethods.Add(new UserResearchMethodologyResearchMethod()
                {
                    ResearchMethodId = researchMethodId,
                });
            }
            await _userResearchMethodologiesRepository.InsertAsync(userResearchMethodology);
        }
    }
}
