using Abp.Application.Services;
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using System.Threading.Tasks;

namespace Academically.Services.Profiles
{
    public interface IProfilesAppService : IApplicationService
    {
        Task<UserDto> Get(long id);
        Task<VerificationStatusDto> GetVerificationStatus(long id);
        Task<ProfileMetricDto> GetMetrics(long id);
        Task Update(UserDto input);
        Task UpdateWebsiteUrl(string websiteUrl);
        Task UpdateAbout(string about);
        Task<string> UpdateCoverPhoto(UpdateCoverPhotoRequestDto input);
        Task<string> UpdateProfilePicture(UpdateProfilePictureRequestDto input);
        Task DeleteCoverPhoto();
        Task DeleteProfilePicture();
    }
}
