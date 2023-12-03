using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.StudentArticles.Dto;
using Academically.Services.StudentVideos.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.StudentArticles
{
    public class StudentArticlesAppService : AcademicallyAppServiceBase, IStudentArticlesAppService
    {
        private readonly IRepository<StudentArticle, Guid> _studentArticlesRepository;

        public StudentArticlesAppService(IRepository<StudentArticle, Guid> studentArticlesRepository)
        {
            _studentArticlesRepository = studentArticlesRepository;
        }
        public async Task<GetStudentArticleDto> CreateAsync(StudentArticleDto input)
        {
            var studentArticle = ObjectMapper.Map<StudentArticle>(input);
            await _studentArticlesRepository.InsertAsync(studentArticle);
            return ObjectMapper.Map<GetStudentArticleDto>(studentArticle);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _studentArticlesRepository.DeleteAsync(id);
        }

        public async Task<PagedResultDto<StudentArticleDto>> GetAllAsync(GetAllStudentArticleDto input)
        {
            var query = _studentArticlesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId)
                .WhereIf(input.IsSavedFilter, e => e.SaveOnly)
                .WhereIf(!input.IsSavedFilter, e => !e.SaveOnly);
            var totalCount = await query.CountAsync();
            var studentVideos = await query.PageBy(input)
                .OrderBy(e => e.Article.Name)
                .Include(e => e.Article)
                    .ThenInclude(e => e.ThumbnailDocument)
                .Include(e => e.Article)
                    .ThenInclude(e => e.Children)
                .Select(e => ObjectMapper.Map<StudentArticleDto>(e))
                .ToListAsync();
            return new PagedResultDto<StudentArticleDto>(totalCount, studentVideos);
        }

        public async Task<GetStudentArticleDto> GetByArticleAsync(Guid articleId)
        {
            return await _studentArticlesRepository.GetAll()
               .Where(e => e.ArticleId == articleId && e.CreatorUserId == AbpSession.UserId)
               .OrderByDescending(e => e.CreationTime)
               .Select(e => ObjectMapper.Map<GetStudentArticleDto>(e))
               .FirstOrDefaultAsync();
        }
    }
}
