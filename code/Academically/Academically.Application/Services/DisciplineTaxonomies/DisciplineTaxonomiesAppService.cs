using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.DisciplineTaxonomies
{
    [AbpAuthorize(PermissionNames.Pages_Profile_AreasOfStudy)]
    public class DisciplineTaxonomiesAppService : AcademicallyAppServiceBase, IDisciplineTaxonomiesAppService
    {
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplieTaxonomiesRespository;
        private readonly IRepository<UserDisciplineTaxonomy, Guid> _userDisciplieTaxonomiesRespository;

        public DisciplineTaxonomiesAppService(
            IRepository<DisciplineTaxonomy, Guid> disciplieTaxonomiesRespository,
            IRepository<UserDisciplineTaxonomy, Guid> userDisciplieTaxonomiesRespository
            )
        {
            _disciplieTaxonomiesRespository = disciplieTaxonomiesRespository;
            _userDisciplieTaxonomiesRespository = userDisciplieTaxonomiesRespository;
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> Search(string keyword)
        {
            var userDisciplineTaxonomies = await _userDisciplieTaxonomiesRespository.GetAll()
                .Where(e => e.UserId == AbpSession.UserId.Value)
                .Select(e => e.DisciplineTaxonomyId)
                .ToListAsync();
            var disciplineTaxonomies = await _disciplieTaxonomiesRespository.GetAll()
                .WhereIf(!keyword.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(keyword.ToLower()))
                .Where(e => !userDisciplineTaxonomies.Any(t => t == e.Id))
                .OrderBy(e => e.Name)
                .Take(10)
                .Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                .ToListAsync();
            return disciplineTaxonomies;
        }
    }
}
