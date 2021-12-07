using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.StudentCourses.Dto
{
    public class PagedCourseStudentResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string SearchFilter { get; set; }
        public Guid CourseIdFilter { get; set; }
        public int? MinimumProgressFilter { get; set; }
    }
}

