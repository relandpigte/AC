using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Domain.Views;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Articles.Dto;
using Academically.Services.Explore.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Articles
{
    public class ArticlesAppService : AcademicallyAppServiceBase, IArticlesAppService
    {
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<StudentArticle, Guid> _studentArticleRepository;
        private readonly IExploreRepository _exploreRepository;

        public ArticlesAppService(
            IRepository<Article, Guid> articlesRepository,
            IDocumentsDomainService documentsDomainService,
            IRepository<StudentArticle, Guid> studentArticleRepository,
            IExploreRepository exploreRepository
            )
        {
            _articlesRepository = articlesRepository;
            _documentsDomainService = documentsDomainService;
            _studentArticleRepository = studentArticleRepository;
            _exploreRepository = exploreRepository;
        }

        public async Task<PagedResultDto<ArticleDto>> GetAll(PagedArticleResultRequestDto input)
        {
            var query = _articlesRepository.GetAll()
                .Where(e => e.ParentId == null)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value);
            var totalCount = await query.CountAsync();
            var articles = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = articles,
            };
        }

        public async Task<PagedResultDto<ArticleDto>> GetAllForSeries(PagedSeriesArticleResultRequestDto input)
        {
            var query = _articlesRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StausFilter.HasValue, e => e.Status == input.StausFilter.Value);
            var totalCount = await query.CountAsync();
            var articles = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = articles,
            };
        }

        public async Task<PagedResultDto<ArticleDto>> GetAllForHome(PagedResultRequestDto input)
        {
            var query = _articlesRepository.GetAll()
                .Where(e => e.ParentId == null && e.Status == ArticleStatus.Published);
            var totalCount = await query.CountAsync();
            var articles = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = articles,
            };
        }

        public async Task<ArticleDto> Get(Guid id)
        {
            var article = await _articlesRepository.GetAll()
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Parent)
                .Where(e => e.Id == id)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .FirstOrDefaultAsync();
            return article;
        }

        public async Task<ArticleDto> Create(ArticleDto input)
        {
            var article = ObjectMapper.Map<Article>(input);
            input.Id = await _articlesRepository.InsertAndGetIdAsync(article);
            return input;
        }

        public async Task<ArticleDto> UpdateDetails(UpdateArticleDetailsDto input)
        {
            var article = await _articlesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, article);
            await _articlesRepository.UpdateAsync(article);
            return ObjectMapper.Map<ArticleDto>(article);
        }

        public async Task<ArticleDto> UpdateSettings(UpdateArticleSettingsDto input)
        {
            var article = await _articlesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, article);
            await _articlesRepository.UpdateAsync(article);
            return ObjectMapper.Map<ArticleDto>(article);
        }

        public async Task UpdateStatusAsync(Guid id, ArticleStatus status)
        {
            var article = await _articlesRepository.GetAsync(id);
            article.Status = status;
            await _articlesRepository.UpdateAsync(article);
        }

        public async Task DeleteAsync(Guid id)
        {
            var children = await _articlesRepository.GetAll()
                .Where(e => e.ParentId == id)
                .ToListAsync();
            foreach (var child in children)
            {
                await _articlesRepository.DeleteAsync(child.Id);
            }
            await _articlesRepository.DeleteAsync(id);
        }

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByTopicAsync(PagedExploreGroupByTopicResultRequestDto input)
        {
            var topics = new List<string>();
            string allTopicsInString;
            IEnumerable<string> distinctTopics = new List<string>();


            if (!string.IsNullOrEmpty(input.Topic))
            {
                distinctTopics = distinctTopics.Append(input.Topic);
            }
            else
            {
                // Get all topics
                topics = await _articlesRepository.GetAll()
                    .Where(x => !string.IsNullOrEmpty(x.Categories))
                    .Where(e => e.ParentId == null)
                    .Where(e => e.IsVisible)
                    .Where(e => e.Status == ArticleStatus.Published)
                    .Select(x => x.Categories).ToListAsync();
                allTopicsInString = string.Join(",", topics.ToArray());
                distinctTopics = allTopicsInString.Split(",").OrderBy(x => x).Distinct();
            }

            // Loop on all topics
            var result = new Dictionary<string, PagedResultDto<ArticleDto>>();
            foreach (var topic in distinctTopics)
            {
                var query = _articlesRepository.GetAll()
               .Where(e => e.ParentId == null)
               .Where(e => e.IsVisible)
               .Where(e => e.Status == ArticleStatus.Published)
               .Where(c => c.Categories.Contains(topic));
                var totalCount = await query.CountAsync();
                var articles = await query
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.Children)
                    .Include(e => e.CreatorUser)
                    .PageBy(input)
                    .OrderByDescending(v => v.CreationTime)
                    .Select(e => ObjectMapper.Map<ArticleDto>(e))
                    .ToListAsync();

               
                result.Add(topic, new PagedResultDto<ArticleDto>(totalCount, await GetArticleDetailsAsync(articles)));
            }
            return result;
        }

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByDatesAsync(PagedExploreGroupByDateResultRequestDto input)
        {
            var query = _articlesRepository.GetAll()
                .Where(e => e.ParentId == null)
                .Where(e => e.Status == ArticleStatus.Published)
                .Where(e => e.IsVisible)
                //.WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId != input.UserIdFilter.Value)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value)
                ;
            var totalCount = await query.CountAsync();
            var articles = await query.OrderBy(e => e.Name)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            

            return (await GetArticleDetailsAsync(articles)).GroupByDateRangePagedExt(input.Grain.Value, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            var topArticlesQuery = _studentArticleRepository.GetAll()
                .Include(x => x.Article)
                .Where(e => e.Article.IsVisible)
                .Where(e => e.Article.ParentId == null)
                .Where(e => e.Article.Status == ArticleStatus.Published)
                .Select(x => new
                {
                    x.ArticleId,
                    Point = x.SaveOnly ? 1 : 5
                })
                .GroupBy(x => new { x.ArticleId })
                .Select(g => new { g.Key.ArticleId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity);

            var totalCount = topArticlesQuery.Count();

            var topArticles = await topArticlesQuery.PageBy(input)
                .Join(_articlesRepository.GetAll()
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.CreatorUser)
                    .Include(e => e.Children),
                        outer => outer.ArticleId,
                        inner => inner.Id,
                        (inner, outer) => new ArticlePopularityViewModel(outer, inner.Popularity))
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return (await GetArticleDetailsAsync(topArticles)).GroupByPopularityPagedExt(totalCount);
        }

        private async Task<List<ArticleDto>> GetArticleDetailsAsync(List<ArticleDto> topArticles)
        {
            foreach (var article in topArticles)
            {
                if (article.ThumbnailDocumentId.HasValue)
                    article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocumentId.Value);
                if (article.CreatorUser.ProfilePictureDocumentId.HasValue)
                    article.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(article.CreatorUser.ProfilePictureDocumentId.Value);

                article.ArticlesCount = article.Children.Count();
            }
            return topArticles;

        }
    }
}

