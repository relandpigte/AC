using System;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.UserProfiles.Dto
{
    public class SaveProfileDetailDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ZipOrPostCode { get; set; }
        public string StateOrProvince { get; set; }
        public string Country { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }

        public IFormFile ProfilePicture { get; set; }
    }
}
