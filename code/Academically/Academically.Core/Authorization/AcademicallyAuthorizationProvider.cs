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

            var dashboardNavigationPermission = dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Navigations, L("Navigations"));
            dashboardNavigationPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Navigations_UserManagement, L("UserManagement"));
            dashboardNavigationPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Navigations_Financials, L("Financials"));
            dashboardNavigationPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Navigations_Settings, L("Settings"));
            dashboardNavigationPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Navigation_AcademicSupport, L("AcademicSupport"));

            var dashboardWidgetPermission = dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets, L("Widgets"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_ProfileSummary, L("ProfileSummary"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_Polls, L("Polls"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_Verifications, L("Verifications"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_RecentProjectsReceivingHelp, L("RecentProjectsReceivingHelp"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_RecentProjectsProvidingHelp, L("RecentProjectsProvidingHelp"));
            dashboardWidgetPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Widgets_MessageHub, L("MessageHub"));


            var userPermission = context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Create, L("CreateUser"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Update, L("UpdateUser"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Delete, L("DeleteUser"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_ResetPassword, L("ResetPassword"));


            var rolePermission = context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Create, L("CreateRole"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Update, L("UpdateRole"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Delete, L("DeleteRole"));

            var peerSupportPermission = context.CreatePermission(PermissionNames.Pages_PeerSupport, L("PeerSupport"));
            peerSupportPermission.CreateChildPermission(PermissionNames.Pages_PeerSupport_Tutorial, L("Tutorial"));
            peerSupportPermission.CreateChildPermission(PermissionNames.Pages_PeerSupport_Proposals, L("Proposals"));

            var profilePermission = context.CreatePermission(PermissionNames.Pages_Profile, L("Profile"));

            profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Details, L("Details"));

            var profileEducationPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Educations, L("Educations"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Educations_Create, L("CreateUserEducation"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Educations_Update, L("UpdateUserEducation"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Educations_Delete, L("DeleteUserEducation"));

            var profilePublicationsPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Publications, L("Publications"));
            profilePublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Publications_Create, L("CreateUserPublication"));
            profilePublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Publications_Update, L("UpdateUserPublication"));
            profilePublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Publications_Delete, L("DeleteUserPublication"));



            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AcademicallyConsts.LocalizationSourceName);
        }
    }
}
