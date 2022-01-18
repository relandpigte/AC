using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Services.Articles.Dto;

namespace Academically.Services.Articles
{
	public interface IArticlesAppService
	{
		Task<PagedResultDto<ArticleDto>> GetAll(PagedArticleResultRequestDto input);
		Task<ArticleDto> Get(Guid id);
		Task<ArticleDto> Create(ArticleDto input);
		Task<ArticleDto> UpdateDetails(UpdateArticleDetailsDto input);
		Task<ArticleDto> UpdateSettings(UpdateArticleSettingsDto input);
	}
}

