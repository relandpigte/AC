using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Entities
{
    [Table("AcademicallyUserProfiles")]
    public class UserProfile : Entity<Guid>
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

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
