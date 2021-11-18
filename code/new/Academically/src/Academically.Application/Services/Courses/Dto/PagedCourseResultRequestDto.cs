using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Courses.Dto
{
    public class PagedCourseResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string SearchFilter { get; set; }
        public CourseStatus? StatusFilter { get; set; }
    }
}
