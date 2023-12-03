using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.StudentArticles.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.StudentArticles
{
    public interface IStudentArticlesAppService : IApplicationService
    {
		Task<PagedResultDto<StudentArticleDto>> GetAllAsync(GetAllStudentArticleDto input);
		Task<GetStudentArticleDto> GetByArticleAsync(Guid articleId);
		Task<GetStudentArticleDto> CreateAsync(StudentArticleDto input);
		Task DeleteAsync(Guid id);
	}
}
