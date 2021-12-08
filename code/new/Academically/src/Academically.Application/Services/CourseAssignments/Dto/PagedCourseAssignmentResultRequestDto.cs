using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.CourseAssignments.Dto
{
    public class PagedCourseAssignmentResultRequestDto : PagedAndSortedResultRequestDto
    {
        public Guid StudentCourseIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public Guid? CourseSectionIdFilter { get; set; }
        public DateTime? CreationTimeFilter { get; set; }
    }
}

