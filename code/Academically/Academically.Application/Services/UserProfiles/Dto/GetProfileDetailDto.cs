using Academically.Services.Timezones.Dto;
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
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string About { get; set; }
        public string ProfilePictureFileName { get; set; }
        public string TimezoneId { get; set; }

        public DateTime DateJoined { get; set; }
        public string Role { get; set; }

        public TimeZoneDto TimeZoneInfo { get; set; }
    }
}
