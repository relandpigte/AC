using Abp.Application.Services.Dto;

namespace Academically.Services.StudentArticles.Dto
{
    public class GetAllStudentArticleDto : PagedResultRequestDto
    {
        public bool IsSavedFilter { get; set; }
    }
}
