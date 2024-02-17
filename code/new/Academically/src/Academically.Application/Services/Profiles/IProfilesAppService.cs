using Abp.Application.Services;
using Academically.Application.Shared.Dto;
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.Profiles
{
    public interface IProfilesAppService : IApplicationService
    {
        Task<UserDto> Get(long id);
        Task<VerificationStatusDto> GetVerificationStatus(long id);
        Task<ProfileMetricDto> GetMetrics(long id);
        Task<IEnumerable<LocationSuggestion>> GetLocationSuggestions(string keyword);
        Task<LocationDetail> GetLocation(string id);
        Task Update(UserDto input);
        Task UpdateProfileAsync(UpdateProfileDto input);
        Task UpdateWebsiteUrl(string websiteUrl);
        Task UpdateAbout(string about);
        Task<string> UpdateCoverPhoto(UpdateCoverPhotoRequestDto input);
        Task<string> UpdateProfilePicture(UpdateProfilePictureRequestDto input);
        Task<string> UpdateIntroVideo(UpdateIntroVideoRequestDto input);
        Task DeleteCoverPhoto();
        Task DeleteProfilePicture();
        Task DeleteIntroVideo();
        Task DeleteAccount();
        Task<LearnerProfileMetricDto> GetLearnerMetrics();
        Task<TutorProfileMetricDto> GetTutorMetrics(long? userId);
        Task<IEnumerable<UserDto>> GetAllStudentsByOwnerId(long? userId);
        Task<List<decimal>> GetWeeklyRevenue();
        Task<List<decimal>> GetMonthlyRevenue();
        Task<List<decimal>> GetAnnualRevenue();
    }
}
