using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.Articles.Dto;
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

		public ArticlesAppService(
            IRepository<Article, Guid> articlesRepository,
            IDocumentsDomainService documentsDomainService
            )
		{
            _articlesRepository = articlesRepository;
            _documentsDomainService = documentsDomainService;

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

        public async Task<Dictionary<string, List<ArticleDto>>> GetByTopicAsync()
        {
            var articles = await _articlesRepository.GetAll()
                .Where(e => e.ParentId == null)
                .Include(e => e.Children)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return articles.GroupByTopicExt();
        }

        public async Task<Dictionary<string, List<ArticleDto>>> GetByDatesAsync(DateGrains grain, int itemsPerGroup = 6)
        {
            var articles = await _articlesRepository.GetAll()
                .Where(e => e.ParentId == null)
                .Include(e => e.Children)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return articles.GroupByDateRangeExt(grain, itemsPerGroup);
        }
    }
}

