using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.Articles.Dto;
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

        public async Task<IEnumerable<DisciplineTaxonomyDto>> GetAll(Guid? parentId, bool includeChildren, string sorting)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Where(x => x.ParentId == parentId);

            if (includeChildren)
            {
                query = _disciplineTaxonomiesRepository.GetAll()
                    .Include(x => x.Children)
                    .Where(x => x.ParentId == parentId);
            }

            if (!string.IsNullOrWhiteSpace(sorting))
            {
                if (sorting.Contains("recent"))
                    query = query.OrderByDescending(x => x.CreationTime);
                else if (sorting.Contains("popular"))
                    query = query.OrderByDescending(x => x.UserTopics.Count());
                else if (sorting.Contains("foryou"))
                    query = query.OrderBy(x => x.Name);
                else
                    query = query.OrderBy(x => x.Name);
            }

            var disciplineTaxonomies = await query.Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                .ToListAsync();
            return disciplineTaxonomies;
        }

        public async Task<PagedResultDto<DisciplineTaxonomyDto>> GetAllPaged(PagedDisciplineTaxonomyResultRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Where(x => x.ParentId == request.ParentId);

            if (request.IncludeChildren)
            {
                query = _disciplineTaxonomiesRepository.GetAll()
                    .Include(x => x.Children)
                    .Where(x => x.ParentId == request.ParentId);
            }

            var totalCount = await query.CountAsync();

            if (!string.IsNullOrWhiteSpace(request.Sorting))
            {
                if (request.Sorting.Contains("recent"))
                    query = query.OrderByDescending(x => x.CreationTime);
                else if (request.Sorting.Contains("popular"))
                    query = query.OrderByDescending(x => x.UserTopics.Count());
                else if (request.Sorting.Contains("foryou"))
                    query = query.OrderBy(x => x.Name);
                else
                    query = query.OrderBy(x => x.Name);
            }

            query = query.PageBy(request);

            var disciplineTaxonomies = await query.Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                .ToListAsync();

            return new PagedResultDto<DisciplineTaxonomyDto>()
            {
                TotalCount = totalCount,
                Items = disciplineTaxonomies
            };
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> GetAllLastChildren()
        {
            var disciplineTaxonomies = await _disciplineTaxonomiesRepository.GetAll()
                .Where(x => x.Children.Count() == 0)
                .OrderBy(x => x.Name)
                .ToListAsync(); 

            var result = disciplineTaxonomies.Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e));
            return result;
        }

        public async Task<IEnumerable<GetDisciplineTaxonomyChildrenCountDto>> GetChildrenCount(List<Guid> disciplineTaxonomyIds)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
               .Where(x => disciplineTaxonomyIds.Any(y => y == x.Id))
               .Select(x => new GetDisciplineTaxonomyChildrenCountDto
               {
                   DisciplineTaxonomyId = x.Id,
                   ChildCount = x.Children.Count()
               });

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<GetDisciplineTaxonomyFollowerCountDto>> GetFollowerCount(List<Guid> disciplineTaxonomyIds)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
               .Where(x => disciplineTaxonomyIds.Any(y => y == x.Id))
               .Select(x => new GetDisciplineTaxonomyFollowerCountDto
               {
                   DisciplineTaxonomyId = x.Id,
                   FollowerCount = x.UserTopics.Count()
               });

            return await query.ToListAsync();
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
