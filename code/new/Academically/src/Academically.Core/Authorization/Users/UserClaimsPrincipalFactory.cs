using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Abp.Authorization;
using Academically.Authorization.Roles;
using Abp.Domain.Uow;

namespace Academically.Authorization.Users
{
    public class UserClaimsPrincipalFactory : AbpUserClaimsPrincipalFactory<User, Role>
    {
        public UserClaimsPrincipalFactory(
            UserManager userManager,
            RoleManager roleManager,
            IOptions<IdentityOptions> optionsAccessor,
            IUnitOfWorkManager manager)
            : base(
                  userManager,
                  roleManager,
                  optionsAccessor,
                  manager)
        {
        }
    }
}
