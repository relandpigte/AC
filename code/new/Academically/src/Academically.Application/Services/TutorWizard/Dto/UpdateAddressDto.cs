using Abp.AutoMapper;
using Academically.Authorization.Users;

namespace Academically.Services.TutorWizard.Dto
{
    [AutoMapTo(typeof(User))]
    public class UpdateAddressDto
    {
        public string Country { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string StateOrProvince { get; set; }
        public string ZipOrPostCode { get; set; }
    }
}
