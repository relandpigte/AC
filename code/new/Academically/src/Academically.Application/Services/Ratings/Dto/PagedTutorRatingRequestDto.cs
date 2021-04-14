using Abp.Application.Services.Dto;

namespace Academically.Services.Ratings.Dto
{
    public class PagedTutorRatingRequestDto : PagedResultRequestDto
    {
        public long TutorId { get; set; }
    }
}
