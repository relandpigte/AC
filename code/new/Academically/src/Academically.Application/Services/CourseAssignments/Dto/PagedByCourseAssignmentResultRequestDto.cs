using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.CourseAssignments.Dto
{
    public class PagedByCourseAssignmentResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string SearchFilter { get; set; }
        public Guid CourseIdFilter { get; set; }
    }
}

