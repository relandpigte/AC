using Abp.Application.Services.Dto;

namespace Academically.Services.StudentCourses.Dto
{
    public class PagedStudentCourseResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string SearchFilter { get; set; }
    }
}

