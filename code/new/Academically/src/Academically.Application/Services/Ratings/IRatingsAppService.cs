using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Ratings.Dto;
using System;
using System.Threading.Tasks;
using Academically.Domain.Entities;

namespace Academically.Services.Ratings
{
    public interface IRatingsAppService : IApplicationService
    {
        Task<EventRating> CreateEventRatings(CreateEventRatingsDto input);
        Task CreateServiceRatings(CreateServiceRatingDto input);
        Task<StudentRatingSummaryDto> GetStudentRatingSummary(long studentId);
        Task<TutorRatingSummaryDto> GetTutorRatingSummary(long tutorId);
        Task<CourseRatingSummaryDto> GetCourseRatingSummary(Guid courseId);
        Task<PagedResultDto<StudentRatingDto>> GetStudentRatings(PagedStudentRatingRequestDto input);
        Task<PagedResultDto<TutorRatingDto>> GetTutorRatings(PagedTutorRatingRequestDto input);
        Task<PagedResultDto<CourseRatingDto>> GetCourseRatings(PagedCourseRatingRequestDto input);
    }
}
