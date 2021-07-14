using Microsoft.AspNetCore.Http;

namespace Academically.Services.Profiles.Dto
{
    public class UpdateIntroVideoRequestDto
    {
        public IFormFile IntroVideo { get; set; }
    }
}
