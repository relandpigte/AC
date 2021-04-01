using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.DisciplineTaxonomies
{
    public class DisciplineTaxonomiesAppService : AcademicallyAppServiceBase, IDisciplineTaxonomiesAppService
    {
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomiesRepository;

        public DisciplineTaxonomiesAppService(
             IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomiesRepository
            )
        {
            _disciplineTaxonomiesRepository = disciplineTaxonomiesRepository;
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> Search(string keyword)
        {
            var disciplineTaxonomies = await _disciplineTaxonomiesRepository.GetAll()
                    .WhereIf(!keyword.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(keyword.ToLower()))
                    .OrderBy(e => e.Name)
                    .Take(10)
                    .Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                    .ToListAsync();
            return disciplineTaxonomies;
        }
    }
}
