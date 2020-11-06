using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.ResearchMethods.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.ResearchMethods
{
    public class ResearchMethodsAppService : AcademicallyAppServiceBase, IResearchMethodsAppService
    {
        private readonly IRepository<ResearchMethod, Guid> _researchMethodsRepository;
        private readonly IRepository<UserResearchMethod, Guid> _userResearchMethodsRepository;

        public ResearchMethodsAppService(
            IRepository<ResearchMethod, Guid> researchMethodsRepository,
            IRepository<UserResearchMethod, Guid> userResearchMethodsRepository
            )
        {
            _researchMethodsRepository = researchMethodsRepository;
            _userResearchMethodsRepository = userResearchMethodsRepository;
        }

        public async Task<IEnumerable<ResearchMethodDto>> GetAll(long userId)
        {
            var userResearchMethodIds = _userResearchMethodsRepository.GetAll()
                .Where(e => e.UserId == userId)
                .Select(e => e.ResearchMethodId.ToString());
            var researchMethods = await _researchMethodsRepository.GetAll()
                .Where(e => !userResearchMethodIds.Any(t => e.ParentIdMap.Contains(t)))
                .ToListAsync();
            var rootResearchMethods = researchMethods.Where(e => e.ParentId == null)
                .Select(e => ObjectMapper.Map<ResearchMethodDto>(e));

            return rootResearchMethods;
        }
    }
}
