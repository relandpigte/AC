using Microsoft.AspNetCore.Http;

namespace Academically.Services.Profiles.Dto
{
    public class UpdateProfilePictureRequestDto
    {
        public IFormFile ProfilePicture { get; set; }
    }
}
