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
            var rootResearchMethods = GetChildren(researchMethods, null);

            return rootResearchMethods;
        }

        private IEnumerable<ResearchMethodDto> GetChildren(IEnumerable<ResearchMethod> researchMethods, Guid? parentId)
        {
            var children = researchMethods.Where(e => e.ParentId == parentId)
                .Select(e => ObjectMapper.Map<ResearchMethodDto>(e))
                .ToList();
            foreach (var child in children)
            {
                child.Children = GetChildren(researchMethods, child.Id);
            }
            return children;
        }
    }
}
