using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.PassportVerifications.Dto
{
    [AutoMapTo(typeof(PassportVerification))]
    public class CreatePassportVerificationDto
    {
        public IFormFile PassportPhoto { get; set; }
    }
}
