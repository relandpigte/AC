using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.CourseAssignments.Dto
{
    public class PagedCourseAssignmentResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string SearchFilter { get; set; }
        public Guid CourseIdFilter { get; set; }
    }
}

