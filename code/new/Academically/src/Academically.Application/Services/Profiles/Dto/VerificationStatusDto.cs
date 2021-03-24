using Academically.Domain.Enums;

namespace Academically.Services.Profiles.Dto
{
    public class VerificationStatusDto
    {
        public bool IsEmailConfirmed { get; set; }
        public bool IsPhoneNumberConfirmed { get; set; }
        public PassportVerificationStatus PassportVerificationStatus { get; set; }
    }
}
