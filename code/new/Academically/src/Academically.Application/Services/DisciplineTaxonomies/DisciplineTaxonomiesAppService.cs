using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.Articles.Dto;
using Academically.Services.DisciplineTaxonomies.Dto;
using Microsoft.EntityFrameworkCore;
using Academically.Domain.Enums;

namespace Academically.Services.DisciplineTaxonomies
{
    public class DisciplineTaxonomiesAppService : AcademicallyAppServiceBase, IDisciplineTaxonomiesAppService
    {
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomiesRepository;
        private readonly IRepository<UserTopic, Guid> _userTopicRepository;

        public DisciplineTaxonomiesAppService(IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomiesRepository,
            IRepository<UserTopic, Guid> userTopicRepository)
        {
            _disciplineTaxonomiesRepository = disciplineTaxonomiesRepository;
            _userTopicRepository = userTopicRepository;
        }

        public async Task<DisciplineTaxonomyDto> Get(Guid id)
        {
            var disciplineTaxonomy = await _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.Children)
                .Include(x => x.UserTopics)
                .FirstOrDefaultAsync(x => x.Id == id);

            return ObjectMapper.Map<DisciplineTaxonomyDto>(disciplineTaxonomy);
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> GetAll(GetAllDisciplineTaxonomyRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.ParentId == request.ParentId);

            var markedIds = await GetMarkedIds(request.ExcludeFollowing);
            query = query.WhereIf(markedIds.Any(), x => !markedIds.Contains(x.Id));

            if (request.IncludeChildren)
                query = query.Include(x => x.Children);

            if (!string.IsNullOrWhiteSpace(request.Sorting))
                query = Sort(query, request.Sorting);

            var disciplineTaxonomies = await query.Select(x => ObjectMapper.Map<DisciplineTaxonomyDto>(x))
                .ToListAsync();
            return disciplineTaxonomies;
        }

        public async Task<PagedResultDto<DisciplineTaxonomyDto>> GetAllPaged(PagedDisciplineTaxonomyResultRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.ParentId == request.ParentId);

            var markedIds = await GetMarkedIds(request.ExcludeFollowing);
            query = query.WhereIf(markedIds.Any(), x => !markedIds.Contains(x.Id));

            if (request.IncludeChildren)
                query = query.Include(x => x.Children);

            var totalCount = await query.CountAsync();

            if (!string.IsNullOrWhiteSpace(request.Sorting))
                query = Sort(query, request.Sorting);

            query = query.PageBy(request);

            var disciplineTaxonomies = await query.Select(e => ObjectMapper.Map<DisciplineTaxonomyDto>(e))
                .ToListAsync();

            return new PagedResultDto<DisciplineTaxonomyDto>()
            {
                TotalCount = totalCount,
                Items = disciplineTaxonomies
            };
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> Search(SearchDisciplineTaxonomyRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.Name.ToLower().Contains(request.Keyword.ToLower()));

            var markedIds = await GetMarkedIds(request.ExcludeFollowing);
            query = query.WhereIf(markedIds.Any(), x => !markedIds.Contains(x.Id));

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            if (request.Take.HasValue)
                query = query.Take(request.Take.Value);

            return await query.Select(x => ObjectMapper.Map<DisciplineTaxonomyDto>(x)).ToListAsync();
        }

        public async Task<IEnumerable<DisciplineTaxonomyDto>> GetAllLastChildren(GetAllLastChildrenDisciplineTaxonomyRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), this.GetSearchConditionFromSearchStrategy(request.Keyword.ToLower(), request.SearchStrategy))
                .Where(x => x.Children.Count() == 0);

            var markedIds = await GetMarkedIds(request.ExcludeFollowing);
            query = query.WhereIf(markedIds.Any(), x => !markedIds.Contains(x.Id));

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            if (request.Take.HasValue)
                query = query.Take(request.Take.Value);

            var disciplineTaxonomies = await query.Select(x => ObjectMapper.Map<DisciplineTaxonomyDto>(x))
                .ToListAsync();
            return disciplineTaxonomies;
        }

        public async Task<PagedResultDto<DisciplineTaxonomyDto>> GetAllLastChildrenPaged(PagedGetAllLastChildrenDisciplineTaxonomyRequestDto request)
        {
            var query = _disciplineTaxonomiesRepository.GetAll()
                .Include(x => x.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), this.GetSearchConditionFromSearchStrategy(request.Keyword.ToLower(), request.SearchStrategy))
                .Where(x => x.Children.Count() == 0);

            var markedIds = await GetMarkedIds(request.ExcludeFollowing);
            query = query.WhereIf(markedIds.Any(), x => !markedIds.Contains(x.Id));

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            if (request.Take.HasValue)
                query = query.Take(request.Take.Value);

            var totalCount = await query.CountAsync();

            query = query.PageBy(request);

            var disciplineTaxonomies = await query.Select(x => ObjectMapper.Map<DisciplineTaxonomyDto>(x))
                .ToListAsync();

            return new PagedResultDto<DisciplineTaxonomyDto>()
            {
                TotalCount = totalCount,
                Items = disciplineTaxonomies
            };
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

        private IQueryable<DisciplineTaxonomy> Sort(IQueryable<DisciplineTaxonomy> query, string sorting)
        {
            if (sorting.Contains("recent"))
                query = query.OrderByDescending(x => x.CreationTime);
            else if (sorting.Contains("popular"))
                query = query.OrderByDescending(x => x.UserTopics.Count());
            else if (sorting.Contains("foryou"))
                query = query.OrderBy(x => x.Name);
            else
                query = query.OrderBy(x => x.Name);
            return query;
        }

        private async Task<IEnumerable<Guid>> GetMarkedIds(bool excludeFollowing)
        {
            var currentUserId = AbpSession.UserId.Value;

            return await _userTopicRepository.GetAll()
                .Where(x => x.UserId == currentUserId)
                .WhereIf(!excludeFollowing, x => x.Type == UserTopicType.NotInterested)
                .WhereIf(excludeFollowing, x => x.Type == UserTopicType.NotInterested || x.Type == UserTopicType.Following)
                .Select(x => x.DisciplineTaxonomyId)
                .ToListAsync();
        }

        private System.Linq.Expressions.Expression <Func<DisciplineTaxonomy, bool>> GetSearchConditionFromSearchStrategy(string keyword, KeywordSearchStrategy? strategy)
        {
            switch (strategy ?? null)
            {
                case KeywordSearchStrategy.StartsWith:
                    return x => x.Name.ToLower().StartsWith(keyword);
                case KeywordSearchStrategy.EndsWith:
                    return x => x.Name.ToLower().EndsWith(keyword);
                default:
                    return x => x.Name.ToLower().Contains(keyword);
            }
        }
    }
}
