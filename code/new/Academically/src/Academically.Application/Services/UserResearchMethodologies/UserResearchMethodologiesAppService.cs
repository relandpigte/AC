using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserResearchMethodologies.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserResearchMethodologies
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchMethodologies)]
    public class UserResearchMethodologiesAppService : AcademicallyAppServiceBase, IUserResearchMethodologiesAppService
    {
        private readonly IRepository<UserResearchMethodology, Guid> _userResearchMethodologiesRepository;
        private readonly IRepository<UserResearchMethodologyResearchMethod, Guid> _userResearchMethodologyResearchMethodsRepository;

        public UserResearchMethodologiesAppService(
            IRepository<UserResearchMethodology, Guid> userResearchMethodologiesRepository,
            IRepository<UserResearchMethodologyResearchMethod, Guid> userResearchMethodologyResearchMethodsRepository
            )
        {
            _userResearchMethodologiesRepository = userResearchMethodologiesRepository;
            _userResearchMethodologyResearchMethodsRepository = userResearchMethodologyResearchMethodsRepository;
        }

        public async Task<PagedResultDto<UserResearchMethodologyDto>> GetPaged(PagedUserResearchMethodologiesRequestDto input)
        {
            var query = _userResearchMethodologiesRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserIdFilter);

            var totalCount = await query.CountAsync();
            var userResearchMethodologies = await query
                .Include(e => e.UserResearchMethodologyResearchMethods)
                    .ThenInclude(e => e.ResearchMethod)
                .Select(e => ObjectMapper.Map<UserResearchMethodologyDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserResearchMethodologyDto>(totalCount, userResearchMethodologies);
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

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Update)]
        public async Task Edit(UserResearchMethodologyDto input)
        {
            var userResearchMethodology = await _userResearchMethodologiesRepository.GetAsync(input.Id.Value);
            await _userResearchMethodologyResearchMethodsRepository.DeleteAsync(e => e.UserResearchMethodologyId == userResearchMethodology.Id);
            ObjectMapper.Map(input, userResearchMethodology);
            await _userResearchMethodologiesRepository.UpdateAsync(userResearchMethodology);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Delete)]
        public async Task Delete(Guid id)
        {
            await _userResearchMethodologyResearchMethodsRepository.DeleteAsync(e => e.UserResearchMethodologyId == id);
            await _userResearchMethodologiesRepository.DeleteAsync(id);
        }
    }
}
