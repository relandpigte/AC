using System;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Users.Dto;

namespace Academically.Services.UserProfiles.Dto
{
    [AutoMap(typeof(UserProfile))]
    public class UserProfileDto
    {
        public DateTime? DateOfBirth { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ZipOrPostCode { get; set; }
        public string StateOrProvince { get; set; }
        public string Country { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string ProfilePictureFileName { get; set; }
        public string About { get; set; }
        public long UserId { get; set; }
        public string TimezoneId { get; set; }

        public UserDto User { get; set; }
    }
}
