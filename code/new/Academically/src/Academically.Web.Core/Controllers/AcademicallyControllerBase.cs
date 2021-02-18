using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Academically.Controllers
{
    public abstract class AcademicallyControllerBase: AbpController
    {
        protected AcademicallyControllerBase()
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
