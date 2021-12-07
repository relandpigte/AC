using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.CourseAssignments.Dto
{
    public class CreateCourseAssingmentDto
    {
        public Guid StudentCourseSectionId { get; set; }

        public IEnumerable<IFormFile> Files { get; set; }
    }
}

