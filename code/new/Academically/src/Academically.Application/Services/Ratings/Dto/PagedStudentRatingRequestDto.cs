using Abp.Application.Services.Dto;

namespace Academically.Services.Ratings.Dto
{
    public class PagedStudentRatingRequestDto : PagedResultRequestDto
    {
        public long StudentId { get; set; }
    }
}
