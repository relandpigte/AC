using Abp.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;

namespace Academically.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
