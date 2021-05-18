using Microsoft.AspNetCore.Http;

namespace Academically.Services.PhotoIdVerifications.Dto
{
    public class CreatePhotoIdVerificationDto
    {
        public IFormFile PhotoId { get; set; }
    }
}
