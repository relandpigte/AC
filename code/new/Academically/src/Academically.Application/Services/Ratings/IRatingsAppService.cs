using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Ratings.Dto;
using System.Threading.Tasks;

namespace Academically.Services.Ratings
{
    public interface IRatingsAppService : IApplicationService
    {
        Task<StudentRatingSummaryDto> GetStudentRatingSummary(long studentId);
        Task<TutorRatingSummaryDto> GetTutorRatingSummary(long tutorId);
        Task<PagedResultDto<StudentRatingDto>> GetStudentRatings(PagedStudentRatingRequestDto input);
        Task<PagedResultDto<TutorRatingDto>> GetTutorRatings(PagedTutorRatingRequestDto input);
    }
}
