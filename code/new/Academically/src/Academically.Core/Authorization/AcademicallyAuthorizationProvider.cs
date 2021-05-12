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

            dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_MyProjects, L("MyProjects"));
            dashboardPermission.CreateChildPermission(PermissionNames.Pages_Dashboard_Usage, L("Usage"));


            var profilePermission = context.CreatePermission(PermissionNames.Pages_Profile, L("Profile"));

            var profileIntoductionPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction, L("Introduction"));
            profileIntoductionPermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction_Metrics, L("Metrics"));
            profileIntoductionPermission.CreateChildPermission(PermissionNames.Pages_Profile_Introduction_Reviews, L("Reviews"));

            var profileServices = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Services, L("Services"));
            profileServices.CreateChildPermission(PermissionNames.Pages_Profile_Services_SuggestSubject, L("SuggestSubject"));

            var profileEducationPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Education, L("Education"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Create, L("Create"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Update, L("Update"));
            profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Delete, L("Delete"));

            var profileEducationQualificationsPermission = profileEducationPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications, L("Qualifications"));
            profileEducationQualificationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications_Create, L("Create"));
            profileEducationQualificationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications_Update, L("Update"));
            profileEducationQualificationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Education_Qualifications_Delete, L("Delete"));

            var profileResearchPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_Research, L("Research"));

            var profileResearchInterestsPermission = profileResearchPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchInterests, L("ResearchInterests"));
            profileResearchInterestsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchInterests_Create, L("Create"));
            profileResearchInterestsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchInterests_Update, L("Update"));
            profileResearchInterestsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchInterests_Delete, L("Delete"));

            var profileResearchMethodologiesPermission = profileResearchPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchMethodologies, L("ResearchMethodologies"));
            profileResearchMethodologiesPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Create, L("Create"));
            profileResearchMethodologiesPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Update, L("Update"));
            profileResearchMethodologiesPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchMethodologies_Delete, L("Delete"));

            var profileResearchPublicationsPermission = profileResearchPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchPublications, L("Publications"));
            profileResearchPublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchPublications_Create, L("Create"));
            profileResearchPublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchPublications_Update, L("Update"));
            profileResearchPublicationsPermission.CreateChildPermission(PermissionNames.Pages_Profile_Research_ResearchPublications_Delete, L("Delete"));

            profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_IndustryExperience, L("IndustryExperience"));


            var accountSettingsPermission = context.CreatePermission(PermissionNames.Pages_AccountSettings, L("AccountSettings"));
            accountSettingsPermission.CreateChildPermission(PermissionNames.Pages_AccountSettings_General, L("General"));
            accountSettingsPermission.CreateChildPermission(PermissionNames.Pages_AccountSettings_Billing, L("Billing"));
            accountSettingsPermission.CreateChildPermission(PermissionNames.Pages_AccountSettings_Security, L("Security"));
            accountSettingsPermission.CreateChildPermission(PermissionNames.Pages_AccountSettings_Notifications, L("Notifications"));


            var userPermission = context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Create, L("Create"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Update, L("Update"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_Delete, L("Delete"));
            userPermission.CreateChildPermission(PermissionNames.Pages_Users_ResetPassword, L("ResetPassword"));


            var suggestionsPermission = context.CreatePermission(PermissionNames.Pages_Suggestions, L("Suggestions"));

            var suggestionsServiceSubjectsPermission = suggestionsPermission.CreateChildPermission(PermissionNames.Pages_Suggestions_ServiceSubjects, L("ServiceSubjects"));
            suggestionsServiceSubjectsPermission.CreateChildPermission(PermissionNames.Pages_Suggestions_ServiceSubjects_Approve, L("Approve"));
            suggestionsServiceSubjectsPermission.CreateChildPermission(PermissionNames.Pages_Suggestions_ServiceSubjects_Reject, L("Reject"));


            var rolePermission = context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Create, L("Create"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Update, L("Update"));
            rolePermission.CreateChildPermission(PermissionNames.Pages_Roles_Delete, L("Delete"));


            var tutorWizardPermission = context.CreatePermission(PermissionNames.Pages_TutorWizard, L("TutorWizard"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_AboutYou, L("AboutYou"));


            context.CreatePermission(PermissionNames.Pages_Widgets_Verifications, L("Verifications"));


            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AcademicallyConsts.LocalizationSourceName);
        }
    }
}
