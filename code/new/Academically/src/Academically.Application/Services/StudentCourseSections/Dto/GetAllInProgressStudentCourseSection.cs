using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.StudentCourseSections.Dto
{
	public class GetAllInProgressStudentCourseSection : PagedResultRequestDto
	{
        public Guid CourseSectionIdFilter { get; set; }
    }
}

