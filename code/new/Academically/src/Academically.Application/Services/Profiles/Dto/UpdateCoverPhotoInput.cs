using Microsoft.AspNetCore.Http;

namespace Academically.Services.Profiles.Dto
{
    public class UpdateCoverPhotoInput
    {
        public IFormFile CoverPhoto { get; set; }
    }
}
