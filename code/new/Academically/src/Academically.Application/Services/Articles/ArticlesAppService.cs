using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
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
        private readonly IExploreRepository _exploreRepository;

        public ArticlesAppService(
            IRepository<Article, Guid> articlesRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository
            )
		{
            _articlesRepository = articlesRepository;
            _documentsDomainService = documentsDomainService;
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

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByTopicAsync(PagedExploreResultRequestDto input)
        {
            var query = _articlesRepository.GetAll()
               .Where(e => e.ParentId == null)
               .Where(e => e.Status == ArticleStatus.Published);
               //.WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId != input.UserIdFilter.Value)
               //.WhereIf(input.MovingDate.HasValue, v => v.CreationTime < input.MovingDate);
            var totalCount = await query.CountAsync();
            var articles = await query.OrderBy(e => e.Name)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();


            foreach (var article in articles)
            {
                if (article.ThumbnailDocumentId.HasValue)
                    article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocumentId.Value);
                if (article.CreatorUser.ProfilePictureDocumentId.HasValue)
                    article.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(article.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return articles.GroupByTopicsPagedExt();
        }

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByDatesAsync(PagedExploreResultRequestDto input)
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

            foreach (var article in articles)
            {
                if (article.ThumbnailDocumentId.HasValue)
                    article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocumentId.Value);
                if (article.CreatorUser.ProfilePictureDocumentId.HasValue)
                    article.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(article.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return articles.GroupByDateRangePagedExt(input.Grain, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<ArticleDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            var popularVideos = (await _exploreRepository.GetPopularArticles(input.SkipCount, input.MaxResultCount, input.UserIdFilter))
                    .Select(e => ObjectMapper.Map<ArticleDto>(e))
                    .ToList();

            foreach (var vid in popularVideos)
            {
                if (vid.ThumbnailDocumentId.HasValue)
                    vid.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(vid.ThumbnailDocumentId.Value);
                if (vid.CreatorUser.ProfilePictureDocumentId.HasValue)
                    vid.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(vid.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return popularVideos.GroupByPopularityPagedExt(input.MaxResultCount);
        }


    }
}

