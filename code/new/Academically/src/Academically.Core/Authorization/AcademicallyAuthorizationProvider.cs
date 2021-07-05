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
            profileServices.CreateChildPermission(PermissionNames.Pages_Profile_Services_Create, L("Create"));
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

            var profileLanguagesPermission = profilePermission.CreateChildPermission(PermissionNames.Pages_Profile_LanguageSpoken, L("LanguageSpoken"));
            profileLanguagesPermission.CreateChildPermission(PermissionNames.Pages_Profile_LanguageSpoken_Create, L("Create"));

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
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Education, L("Education"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Research, L("Research"));
            
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_ProfilePicture, L("ProfilePicture"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_PhotoId, L("PhotoId"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Address, L("Address"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_ContactNumber, L("ContactNumber"));

            var tutorWizardLanguagesPermission = tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Languages, L("Languages"));
            tutorWizardLanguagesPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Languages_Create, L("Create"));

            var tutorWizardServicesOfferedPermission = tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_ServicesOffered, L("ServicesOffered"));
            tutorWizardServicesOfferedPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_ServicesOffered_Create, L("Create"));

            var tutorWizardReferencesPermission = tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_References, L("References"));
            tutorWizardReferencesPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_References_Create, L("Create"));
            tutorWizardReferencesPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_References_Update, L("Update"));
            tutorWizardReferencesPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_References_Delete, L("Delete"));

            var tutorWizardDbsCheckPermission = tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_DbsCheck, L("DbsCheck"));
            tutorWizardDbsCheckPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_DbsCheck_Create, L("Create"));
            tutorWizardDbsCheckPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_DbsCheck_Update, L("Update"));
            tutorWizardDbsCheckPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_DbsCheck_Delete, L("Delete"));
            
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_TermsOfUse, L("TermsOfUse"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_PrivacyPolicy, L("PrivacyPolicy"));
            tutorWizardPermission.CreateChildPermission(PermissionNames.Pages_TutorWizard_Declaration, L("Declaration"));


            context.CreatePermission(PermissionNames.Pages_Widgets_Verifications, L("Verifications"));


            var calendarPermissions = context.CreatePermission(PermissionNames.Pages_Calendar, L("Calendar"));
            calendarPermissions.CreateChildPermission(PermissionNames.Pages_Calendar_BlockOuts, L("BlockOuts"));
            calendarPermissions.CreateChildPermission(PermissionNames.Pages_Calendar_Bookings, L("Bookings"));


            var serviceWizardPermission = context.CreatePermission(PermissionNames.Pages_ServiceWizard, L("ServiceWizard"));
            serviceWizardPermission.CreateChildPermission(PermissionNames.Pages_ServiceWizard_Category, L("Category"));
            serviceWizardPermission.CreateChildPermission(PermissionNames.Pages_ServiceWizard_Level, L("Level"));
            serviceWizardPermission.CreateChildPermission(PermissionNames.Pages_ServiceWizard_Services, L("Services"));
            serviceWizardPermission.CreateChildPermission(PermissionNames.Pages_ServiceWizard_CreateProject, L("CreateProject"));


            var projectsPermission = context.CreatePermission(PermissionNames.Pages_Projects, L("Projects"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_Overview, L("Overview"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_Browse, L("Browse"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_MyProjects, L("MyProjects"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_UsageAndFinancials, L("UsageAndFinancials"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_Offer, L("Offer"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_OfferHistory, L("OfferHistory"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_Proposals, L("Proposals"));
            projectsPermission.CreateChildPermission(PermissionNames.Pages_Projects_Hired, L("Hired"));

            var tutorApplicationsPermission = context.CreatePermission(PermissionNames.Pages_TutorApplications, L("TutorApplications"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_List, L("TutorApplicationsList"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Approve, L("Approve"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Reject, L("Reject"));

            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_AboutYou, L("AboutYou"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Education, L("Education"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Research, L("Research"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Languages, L("Languages"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_ServicesOffered, L("ServicesOffered"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_ProfilePicture, L("ProfilePicture"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_PhotoId, L("PhotoId"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Address, L("Address"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_ContactNumber, L("ContactNumber"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_References, L("References"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_DbsCheck, L("DbsCheck"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_TermsOfUse, L("TermsOfUse"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_PrivacyPolicy, L("PrivacyPolicy"));
            tutorApplicationsPermission.CreateChildPermission(PermissionNames.Pages_TutorApplications_Declaration, L("Declaration"));

            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AcademicallyConsts.LocalizationSourceName);
        }
    }
}
