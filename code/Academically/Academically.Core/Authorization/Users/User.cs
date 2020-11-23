using System;
using System.Collections.Generic;
using Abp.Authorization.Users;
using Abp.Extensions;
using Academically.Entities;

namespace Academically.Authorization.Users
{
    public class User : AbpUser<User>
    {
        public const string DefaultPassword = "123qwe";

        public virtual DateTime? LastLoginTime { get; set; }

        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }

        public bool? IsRecommended { get; set; }
        public virtual ICollection<UserEducation> UserEducations { get; set; }
        public virtual ICollection<UserDisciplineTaxonomyStudyLevel> UserDisciplineTaxonomyStudyLevels { get; set; }
        public virtual ICollection<UserSupportService> UserSupportServices { get; set; }
        public virtual ICollection<UserDisciplineTaxonomy> UserDisciplineTaxonomies { get; set; }

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
