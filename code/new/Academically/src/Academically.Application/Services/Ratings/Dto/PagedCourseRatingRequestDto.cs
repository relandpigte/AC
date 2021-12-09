using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.Ratings.Dto
{
    public class PagedCourseRatingRequestDto : PagedResultRequestDto
    {
        public Guid CourseId { get; set; }
    }
}
