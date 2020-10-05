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

        public async Task<IEnumerable<GetAllDisciplineTaxonomyDto>> GetAll(long? userId)
        {
            List<DisciplineTaxonomy> disciplineTaxonomies;
            if (userId.HasValue)
            {
                var userDisciplineTaxonomyIds = GetUserDisciplineTaxonomies(userId.Value);
                disciplineTaxonomies = await _disciplieTaxonomiesRespository.GetAll()
                    .Where(e => !userDisciplineTaxonomyIds.Any(t => e.ParentIdMap.Contains(t)))
                    .ToListAsync();
            } else
            {
                disciplineTaxonomies = await _disciplieTaxonomiesRespository.GetAll().ToListAsync();
            }
            var rootTaxonomies = GetChildren(disciplineTaxonomies, null)
                .Select(e => ObjectMapper.Map<GetAllDisciplineTaxonomyDto>(e));

            return rootTaxonomies;
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> Search(long? userId, string keyword)
        {
            List<DisciplineTaxonomyDto> disciplineTaxonomies;
            if (userId.HasValue)
            {
                var userDisciplineTaxonomyIds = GetUserDisciplineTaxonomies(userId.Value);
                disciplineTaxonomies = await _disciplieTaxonomiesRespository.GetAll()
                    .WhereIf(!keyword.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(keyword.ToLower()))
                    .Where(e => !userDisciplineTaxonomyIds.Any(t => e.ParentIdMap.Contains(t)))
                    .OrderBy(e => e.Name)
                    .Take(10)
                    .Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                    .ToListAsync();
            } else
            {
                disciplineTaxonomies = await _disciplieTaxonomiesRespository.GetAll()
                    .WhereIf(!keyword.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(keyword.ToLower()))
                    .OrderBy(e => e.Name)
                    .Take(10)
                    .Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                    .ToListAsync();
            }
            return disciplineTaxonomies;
        }

        private IQueryable<string> GetUserDisciplineTaxonomies(long userId)
        {
            return _userDisciplieTaxonomiesRespository.GetAll()
                .Where(e => e.UserId == userId)
                .Select(e => e.DisciplineTaxonomyId.ToString());
        }

        private List<DisciplineTaxonomy> GetChildren(IEnumerable<DisciplineTaxonomy> taxonomies, Guid? parentId)
        {
            var children = taxonomies.Where(e => e.ParentId == parentId).ToList();
            foreach (var child in children)
            {
                child.Children = GetChildren(taxonomies, child.Id);
            }
            return children;
        }
    }
}
