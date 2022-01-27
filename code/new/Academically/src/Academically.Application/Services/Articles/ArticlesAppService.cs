using System;
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
            var videos = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<ArticleDto>(e))
                .ToListAsync();

            return new PagedResultDto<ArticleDto>()
            {
                TotalCount = totalCount,
                Items = videos,
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
                output.ThumbnailUrl = await _documentsDomainService.GetFileUrlAsync(article.ThumbnailDocument);
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

            if (input.ThumbnailFile != null)
            {
                var oldDocumentId = article.ThumbnailDocumentId;
                var articleThumbnailDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.ThumbnailFile, DocumentType.ArticleThumbnail);
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

            article.IsVisible = input.IsVisible;
            article.CustomUrl = input.CustomUrl;
            article.CommentSetting = input.CommentSetting;
            article.CommentModeration = input.CommentModeration;

            await _articlesRepository.UpdateAsync(article);
            return ObjectMapper.Map<ArticleDto>(article);
        }
    }
}

