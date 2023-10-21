using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Articles.Dto;
using Academically.Services.Posts.Dto;

namespace Academically.Services.Articles
{
    public interface IArticlesAppService
	{
		Task<PagedResultDto<ArticleDto>> GetAll(PagedArticleResultRequestDto input);
		Task<PagedResultDto<ArticleDto>> GetAllForSeries(PagedSeriesArticleResultRequestDto input);
		Task<PagedResultDto<ArticleDto>> GetAllForHome(PagedResultRequestDto input);
		Task<ArticleDto> Get(Guid id);
		Task<ArticleDto> Create(ArticleDto input);
		Task<ArticleDto> UpdateDetails(UpdateArticleDetailsDto input);
		Task<ArticleDto> UpdateSettings(UpdateArticleSettingsDto input);
		Task UpdateStatusAsync(Guid id, ArticleStatus status);
		Task DeleteAsync(Guid id);
		Task<IEnumerable<AvailableServiceDto>> GetAllArticles();
		Task<IEnumerable<AvailableServiceDto>> GetArticlesByKeyword(string keyword, long? creatorUserId);
		Task<IEnumerable<ArticleDto>> GetEnrolledArticlesByUser();
	}
}

