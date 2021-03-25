using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Authorization.Users;
using Abp.Extensions;
using Academically.Domain.Entities;

namespace Academically.Authorization.Users
{
    public class User : AbpUser<User>
    {
        public bool IsPublic { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ZipOrPostCode { get; set; }
        public string StateOrProvince { get; set; }
        public string Country { get; set; }
        public string WebsiteUrl { get; set; }
        public string About { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Guid? CoverPhotoDocumentId { get; set; }
        public Guid? ProfilePictureDocumentId { get; set; }

        [ForeignKey("CoverPhotoDocumentId")]
        public virtual Document CoverPhotoDocument { get; set; }

        [ForeignKey("ProfilePictureDocumentId")]
        public virtual Document ProfilePictureDocument { get; set; }

        public const string DefaultPassword = "123qwe";

        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }

        public static User CreateTenantAdminUser(int tenantId, string emailAddress)
        {
            var user = new User
            {
                TenantId = tenantId,
                UserName = AdminUserName,
                Name = AdminUserName,
                Surname = AdminUserName,
                EmailAddress = emailAddress,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();

            return user;
        }
    }
}
