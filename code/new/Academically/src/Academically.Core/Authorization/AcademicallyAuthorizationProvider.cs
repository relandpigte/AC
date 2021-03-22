using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Academically.Authorization
{
    public class AcademicallyAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            var dashboardPermission = context.CreatePermission(PermissionNames.Pages_Dashboard, L("Dashboard"));

            var dashbardOverviewPermissions = dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Overview, L("Overview"));
            dashbardOverviewPermissions.CreateChildPermission(PermissionNames.Pages_Dashboard_Overview_RecentProjects, L("RecentProjects"));
            dashbardOverviewPermissions.CreateChildPermission(PermissionNames.Pages_Dashboard_Overview_RecentActivity, L("RecentActivity"));
            dashbardOverviewPermissions.CreateChildPermission(PermissionNames.Pages_Dashboard_Overview_ProfileSummary, L("ProfileSummary"));
            dashbardOverviewPermissions.CreateChildPermission(PermissionNames.Pages_Dashboard_Overview_Verifications, L("Verifications"));

            dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_MyProjects, L("MyProjects"));
            dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Usage, L("Usage"));


            var profilePermission = context.CreatePermission(PermissionNames.Pages_Profile, L("Profile"));

            var profileIntoductionPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction, L("Introduction"));
            profileIntoductionPermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction_Metrics, L("Metrics"));
            profileIntoductionPermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction_Reviews, L("Reviews"));

            profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Services, L("Services"));

            var profileEducationPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Education, L("Education"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Create, L("Create"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Update, L("Update"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Delete, L("Delete"));

            var profileEducationQualificationsPermission = profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications, L("Qualifications"));
            profileEducationQualificationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications_Create, L("Create"));

            profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Research, L("Research"));
            profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_IndustryExperience, L("IndustryExperience"));


            var userPermission = context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Create, L("Create"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Update, L("Update"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Delete, L("Delete"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_ResetPassword, L("ResetPassword"));


            var rolePermission = context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Create, L("Create"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Update, L("Update"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Delete, L("Delete"));


            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AcademicallyConsts.LocalizationSourceName);
        }
    }
}
