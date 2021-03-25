using Microsoft.AspNetCore.Http;

namespace Academically.Services.Profiles.Dto
{
    public class UpdateCoverPhotoRequestDto
    {
        public IFormFile CoverPhoto { get; set; }
    }
}
