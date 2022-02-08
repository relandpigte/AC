using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Articles.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                .WhereIf(input.StausFilter.HasValue, e => e.Status == input.StausFilter.Value);
            var totalCount = await query.CountAsync();
            var articles = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .ToListAsync();

            var outputs = new List<ArticleDto>();
            foreach (var article in articles)
            {
                var output = ObjectMapper.Map<ArticleDto>(article);
                if (article.ThumbnailDocument != null)
                {
                    output.ThumbnailDocumentUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocument);
                }
                outputs.Add(output);
            }

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = outputs,
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
                .ToListAsync();

            var outputs = new List<ArticleDto>();
            foreach (var article in articles)
            {
                var output = ObjectMapper.Map<ArticleDto>(article);
                if (article.ThumbnailDocument != null)
                {
                    output.ThumbnailDocumentUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocument);
                }
                outputs.Add(output);
            }

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = outputs,
            };
        }

        public async Task<ArticleDto> Get(Guid id)
        {
            var article = await _articlesRepository.GetAll()
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Parent)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<ArticleDto>(article);

            if (article.ThumbnailDocument != null)
            {
                output.ThumbnailDocumentUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocument);
            }

            return output;
        }

        public async Task<ArticleDto> Create(ArticleDto input)
        {
            var article = ObjectMapper.Map<Article>(input);
            input.Id = await _articlesRepository.InsertAndGetIdAsync(article);
            return input;
        }

        public async Task<ArticleDto> UpdateDetails([FromForm] UpdateArticleDetailsDto input)
        {
            var article = await _articlesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, article);

            if (input.ThumbnailDocumentFile != null)
            {
                var oldDocumentId = article.ThumbnailDocumentId;
                var articleThumbnailDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.ThumbnailDocumentFile, DocumentType.ArticleThumbnail);
                article.ThumbnailDocumentId = articleThumbnailDocument.Id;

                if (oldDocumentId.HasValue)
                {
                    await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                }
            }

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
    }
}

