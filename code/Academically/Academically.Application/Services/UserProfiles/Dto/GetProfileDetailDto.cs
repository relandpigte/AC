using System;

namespace Academically.Services.UserProfiles.Dto
{
    public class GetProfileDetailDto
    {
        public long UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ZipOrPostCode { get; set; }
        public string StateOrProvince { get; set; }
        public string Country { get; set; }

        public string ProfilePictureUrl { get; set; }
        public DateTime DateJoined { get; set; }
        public string Role { get; set; }
    }
}
