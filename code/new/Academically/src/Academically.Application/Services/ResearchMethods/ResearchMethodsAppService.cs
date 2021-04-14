using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.ResearchMethods.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.ResearchMethods
{
    public class ResearchMethodsAppService : AcademicallyAppServiceBase, IResearchMethodsAppService
    {
        private readonly IRepository<ResearchMethod, Guid> _researchMethodsRepository;

        public ResearchMethodsAppService(
            IRepository<ResearchMethod, Guid> researchMethodsRepository
            )
        {
            _researchMethodsRepository = researchMethodsRepository;
        }

        public async Task<IEnumerable<ResearchMethodDto>> GetAll()
        {
            var researchMethods = await _researchMethodsRepository.GetAll()
                .Include(e => e.Children)
                .OrderBy(e => e.Name)
                .ToListAsync();
            var rootResearchMethods = researchMethods.Where(e => e.ParentId == null)
                .Select(e => ObjectMapper.Map<ResearchMethodDto>(e));
            return rootResearchMethods;
        }

        public async Task<IEnumerable<ResearchMethodDto>> Search(SearchResearchMethodResultRequestDto input)
        {
            var searchFilter = input.SearchFilter?.ToLower();
            var researchMethods = await _researchMethodsRepository.GetAll()
                    .WhereIf(!searchFilter.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(searchFilter))
                    .OrderBy(e => e.Name)
                    .Take(10)
                    .Select(e => ObjectMapper.Map<ResearchMethodDto>(e))
                    .ToListAsync();
            return researchMethods;
        }
    }
}
