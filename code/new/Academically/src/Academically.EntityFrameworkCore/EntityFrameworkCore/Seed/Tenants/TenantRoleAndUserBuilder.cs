using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.EntityFrameworkCore.Seed.Tenants.DataSeeder;

namespace Academically.EntityFrameworkCore.Seed.Tenants
{
    public class TenantRoleAndUserBuilder
    {
        private readonly AcademicallyDbContext _context;
        private readonly int _tenantId;

        public TenantRoleAndUserBuilder(AcademicallyDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            CreateRolesAndUsers();
            RunDataSeeders();
        }

        private void CreateRolesAndUsers()
        {
            #region SuperAdmin

            var superAdminRole = CreateRoleIfNotExisting(StaticRoleNames.Tenants.SuperAdmin);
            GrantPermissions(
                superAdminRole,
                PermissionNames.Pages_Dashboard,
                PermissionNames.Pages_Users,
                PermissionNames.Pages_Users_Create,
                PermissionNames.Pages_Users_Update,
                PermissionNames.Pages_Users_Delete,
                PermissionNames.Pages_Users_ResetPassword,
                PermissionNames.Pages_Roles,
                PermissionNames.Pages_Roles_Create,
                PermissionNames.Pages_Roles_Update,
                PermissionNames.Pages_Roles_Delete,
                PermissionNames.Pages_Suggestions,
                PermissionNames.Pages_Suggestions_ServiceSubjects,
                PermissionNames.Pages_Suggestions_ServiceSubjects_Approve,
                PermissionNames.Pages_Suggestions_ServiceSubjects_Reject,
                PermissionNames.Pages_TutorApplications,
                PermissionNames.Pages_TutorApplications_List,
                PermissionNames.Pages_TutorApplications_Approve,
                PermissionNames.Pages_TutorApplications_Reject,
                PermissionNames.Pages_TutorApplications_AboutYou,
                PermissionNames.Pages_TutorApplications_Education,
                PermissionNames.Pages_TutorApplications_Research,
                PermissionNames.Pages_TutorApplications_Languages,
                PermissionNames.Pages_TutorApplications_ServicesOffered,
                PermissionNames.Pages_TutorApplications_ProfilePicture,
                PermissionNames.Pages_TutorApplications_PhotoId,
                PermissionNames.Pages_TutorApplications_Address,
                PermissionNames.Pages_TutorApplications_ContactNumber,
                PermissionNames.Pages_TutorApplications_References,
                PermissionNames.Pages_TutorApplications_DbsCheck,
                PermissionNames.Pages_TutorApplications_TermsOfUse,
                PermissionNames.Pages_TutorApplications_PrivacyPolicy,
                PermissionNames.Pages_TutorApplications_Declaration,
                PermissionNames.Pages_TutorWizard,
                PermissionNames.Pages_TutorWizard_AboutYou,
                PermissionNames.Pages_TutorWizard_Education,
                PermissionNames.Pages_TutorWizard_Research,
                PermissionNames.Pages_TutorWizard_Languages,
                PermissionNames.Pages_TutorWizard_ServicesOffered,
                PermissionNames.Pages_TutorWizard_ProfilePicture,
                PermissionNames.Pages_TutorWizard_PhotoId,
                PermissionNames.Pages_TutorWizard_Address,
                PermissionNames.Pages_TutorWizard_ContactNumber,
                PermissionNames.Pages_TutorWizard_References,
                PermissionNames.Pages_TutorWizard_DbsCheck,
                PermissionNames.Pages_TutorWizard_TermsOfUse,
                PermissionNames.Pages_TutorWizard_PrivacyPolicy,
                PermissionNames.Pages_TutorWizard_Declaration,
                PermissionNames.Pages_Topics_Usage
            );

            #endregion

            #region Admin

            var adminRole = CreateRoleIfNotExisting(StaticRoleNames.Tenants.Admin);
            GrantPermissions(
                adminRole,
                PermissionNames.Pages_Dashboard,
                PermissionNames.Pages_Users,
                PermissionNames.Pages_Users_Create,
                PermissionNames.Pages_Users_Update,
                PermissionNames.Pages_Users_Delete,
                PermissionNames.Pages_Users_ResetPassword,
                PermissionNames.Pages_Roles,
                PermissionNames.Pages_Roles_Create,
                PermissionNames.Pages_Roles_Update,
                PermissionNames.Pages_Roles_Delete,
                PermissionNames.Pages_Suggestions,
                PermissionNames.Pages_Suggestions_ServiceSubjects,
                PermissionNames.Pages_Suggestions_ServiceSubjects_Approve,
                PermissionNames.Pages_Suggestions_ServiceSubjects_Reject,
                PermissionNames.Pages_TutorApplications,
                PermissionNames.Pages_TutorApplications_List,
                PermissionNames.Pages_TutorApplications_Approve,
                PermissionNames.Pages_TutorApplications_Reject,
                PermissionNames.Pages_TutorApplications_AboutYou,
                PermissionNames.Pages_TutorApplications_Education,
                PermissionNames.Pages_TutorApplications_Research,
                PermissionNames.Pages_TutorApplications_Languages,
                PermissionNames.Pages_TutorApplications_ServicesOffered,
                PermissionNames.Pages_TutorApplications_ProfilePicture,
                PermissionNames.Pages_TutorApplications_PhotoId,
                PermissionNames.Pages_TutorApplications_Address,
                PermissionNames.Pages_TutorApplications_ContactNumber,
                PermissionNames.Pages_TutorApplications_References,
                PermissionNames.Pages_TutorApplications_DbsCheck,
                PermissionNames.Pages_TutorApplications_TermsOfUse,
                PermissionNames.Pages_TutorApplications_PrivacyPolicy,
                PermissionNames.Pages_TutorApplications_Declaration,
                PermissionNames.Pages_TutorWizard,
                PermissionNames.Pages_TutorWizard_AboutYou,
                PermissionNames.Pages_TutorWizard_Education,
                PermissionNames.Pages_TutorWizard_Research,
                PermissionNames.Pages_TutorWizard_Languages,
                PermissionNames.Pages_TutorWizard_ServicesOffered,
                PermissionNames.Pages_TutorWizard_ProfilePicture,
                PermissionNames.Pages_TutorWizard_PhotoId,
                PermissionNames.Pages_TutorWizard_Address,
                PermissionNames.Pages_TutorWizard_ContactNumber,
                PermissionNames.Pages_TutorWizard_References,
                PermissionNames.Pages_TutorWizard_DbsCheck,
                PermissionNames.Pages_TutorWizard_TermsOfUse,
                PermissionNames.Pages_TutorWizard_PrivacyPolicy,
                PermissionNames.Pages_TutorWizard_Declaration,
                PermissionNames.Pages_Topics_Usage
            );

            var adminUser = _context.Users.IgnoreQueryFilters().FirstOrDefault(u => u.TenantId == _tenantId && u.UserName == AbpUserBase.AdminUserName);
            if (adminUser == null)
            {
                adminUser = User.CreateTenantAdminUser(_tenantId, "admin@defaulttenant.com");
                adminUser.Password = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions())).HashPassword(adminUser, "123qwe");
                adminUser.IsEmailConfirmed = true;
                adminUser.IsActive = true;

                _context.Users.Add(adminUser);
                _context.SaveChanges();

                _context.UserRoles.Add(new UserRole(_tenantId, adminUser.Id, adminRole.Id));
                _context.SaveChanges();
            }

            #endregion

            #region Tutor

            var tutorRole = CreateRoleIfNotExisting(StaticRoleNames.Tenants.Tutor);
            GrantPermissions(
                tutorRole,
                PermissionNames.Pages_Dashboard,
                PermissionNames.Pages_Dashboard_Overview,
                PermissionNames.Pages_Dashboard_Overview_RecentProjects,
                PermissionNames.Pages_Dashboard_Overview_RecentActivity,
                PermissionNames.Pages_Dashboard_Overview_ProfileSummary,
                PermissionNames.Pages_Dashboard_MyProjects,
                PermissionNames.Pages_Dashboard_Usage,
                PermissionNames.Pages_Dashboard_Courses,
                PermissionNames.Pages_Dashboard_Coaching,
                PermissionNames.Pages_Dashboard_Events,
                PermissionNames.Pages_Dashboard_Workshop,
                PermissionNames.Pages_Profile,
                PermissionNames.Pages_Profile_Services,
                PermissionNames.Pages_Profile_Services_Create,
                PermissionNames.Pages_Profile_Services_Update,
                PermissionNames.Pages_Profile_Services_Delete,
                PermissionNames.Pages_Profile_Services_SuggestSubject,
                PermissionNames.Pages_Profile_Introduction,
                PermissionNames.Pages_Profile_Introduction_Video,
                PermissionNames.Pages_Profile_Introduction_Metrics,
                PermissionNames.Pages_Profile_Introduction_Reviews,
                PermissionNames.Pages_Profile_Education,
                PermissionNames.Pages_Profile_Education_Create,
                PermissionNames.Pages_Profile_Education_Update,
                PermissionNames.Pages_Profile_Education_Delete,
                PermissionNames.Pages_Profile_Education_Qualifications,
                PermissionNames.Pages_Profile_Education_Qualifications_Create,
                PermissionNames.Pages_Profile_Education_Qualifications_Update,
                PermissionNames.Pages_Profile_Education_Qualifications_Delete,
                PermissionNames.Pages_Profile_Research,
                PermissionNames.Pages_Profile_Research_ResearchInterests,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Create,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Update,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Delete,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Create,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Update,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Delete,
                PermissionNames.Pages_Profile_Research_ResearchPublications,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Create,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Update,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Delete,
                PermissionNames.Pages_Profile_LanguageSpoken,
                PermissionNames.Pages_Profile_LanguageSpoken_Create,
                PermissionNames.Pages_Profile_IndustryExperience,
                PermissionNames.Pages_AccountSettings,
                PermissionNames.Pages_AccountSettings_General,
                PermissionNames.Pages_AccountSettings_Billing,
                PermissionNames.Pages_AccountSettings_Security,
                PermissionNames.Pages_AccountSettings_Notifications,
                PermissionNames.Pages_Widgets_Verifications,
                PermissionNames.Pages_Calendar,
                PermissionNames.Pages_Calendar_BlockOuts,
                PermissionNames.Pages_Calendar_Bookings,
                PermissionNames.Pages_Calendar_Schedules,
                PermissionNames.Pages_Projects,
                PermissionNames.Pages_Projects_Overview,
                PermissionNames.Pages_Projects_Browse,
                PermissionNames.Pages_Projects_MyProjects,
                PermissionNames.Pages_Projects_UsageAndFinancials,
                PermissionNames.Pages_Projects_Offer,
                PermissionNames.Pages_Projects_OfferHistory,
                PermissionNames.Pages_Conversations,
                PermissionNames.Pages_Home,
                PermissionNames.Pages_Home_Courses,
                PermissionNames.Pages_Courses,
                PermissionNames.Pages_PageBuilder,
                PermissionNames.Pages_Notifications,
                PermissionNames.Pages_StudentPortal,
                PermissionNames.Pages_Videos,
                PermissionNames.Pages_Videos_TutorPortal,
                PermissionNames.Pages_Videos_StudentPortal,
                PermissionNames.Pages_Articles,
                PermissionNames.Pages_Articles_TutorPortal,
                PermissionNames.Pages_Articles_StudentPortal,
                PermissionNames.Pages_Events,
                PermissionNames.Pages_Events_TutorPortal,
                PermissionNames.Pages_Events_StudentPortal,
                PermissionNames.Pages_Forums,
                PermissionNames.Pages_Forums_Create,
                PermissionNames.Pages_Forums_Update,
                PermissionNames.Pages_Forums_Delete,
                PermissionNames.Pages_Community
            );

            #endregion

            #region Student

            var studentRole = CreateRoleIfNotExisting(StaticRoleNames.Tenants.Student);
            GrantPermissions(
                studentRole,
                PermissionNames.Pages_Dashboard,
                PermissionNames.Pages_Dashboard_Overview,
                PermissionNames.Pages_Dashboard_Overview_RecentProjects,
                PermissionNames.Pages_Dashboard_Overview_RecentActivity,
                PermissionNames.Pages_Dashboard_Overview_ProfileSummary,
                PermissionNames.Pages_Dashboard_MyProjects,
                PermissionNames.Pages_Dashboard_Usage,
                PermissionNames.Pages_Dashboard_Courses,
                PermissionNames.Pages_Dashboard_Coaching,
                PermissionNames.Pages_Dashboard_Workshop,
                PermissionNames.Pages_Profile,
                PermissionNames.Pages_Profile_Introduction,
                PermissionNames.Pages_Profile_Introduction_Metrics,
                PermissionNames.Pages_Profile_Introduction_Reviews,
                PermissionNames.Pages_Profile_Education,
                PermissionNames.Pages_Profile_Education_Create,
                PermissionNames.Pages_Profile_Education_Update,
                PermissionNames.Pages_Profile_Education_Delete,
                PermissionNames.Pages_Profile_Education_Qualifications,
                PermissionNames.Pages_Profile_Education_Qualifications_Create,
                PermissionNames.Pages_Profile_Education_Qualifications_Update,
                PermissionNames.Pages_Profile_Education_Qualifications_Delete,
                PermissionNames.Pages_Profile_Research,
                PermissionNames.Pages_Profile_Research_ResearchInterests,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Create,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Update,
                PermissionNames.Pages_Profile_Research_ResearchInterests_Delete,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Create,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Update,
                PermissionNames.Pages_Profile_Research_ResearchMethodologies_Delete,
                PermissionNames.Pages_Profile_Research_ResearchPublications,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Create,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Update,
                PermissionNames.Pages_Profile_Research_ResearchPublications_Delete,
                PermissionNames.Pages_Profile_LanguageSpoken,
                PermissionNames.Pages_Profile_LanguageSpoken_Create,
                PermissionNames.Pages_Profile_IndustryExperience,
                PermissionNames.Pages_AccountSettings,
                PermissionNames.Pages_AccountSettings_General,
                PermissionNames.Pages_AccountSettings_Billing,
                PermissionNames.Pages_AccountSettings_Security,
                PermissionNames.Pages_AccountSettings_Notifications,
                PermissionNames.Pages_TutorWizard,
                PermissionNames.Pages_TutorWizard_AboutYou,
                PermissionNames.Pages_TutorWizard_Education,
                PermissionNames.Pages_TutorWizard_Research,
                PermissionNames.Pages_TutorWizard_Languages,
                PermissionNames.Pages_TutorWizard_Languages_Create,
                PermissionNames.Pages_TutorWizard_ServicesOffered,
                PermissionNames.Pages_TutorWizard_ServicesOffered_Create,
                PermissionNames.Pages_TutorWizard_ServicesOffered_Update,
                PermissionNames.Pages_TutorWizard_ServicesOffered_Delete,
                PermissionNames.Pages_TutorWizard_ProfilePicture,
                PermissionNames.Pages_TutorWizard_PhotoId,
                PermissionNames.Pages_TutorWizard_Address,
                PermissionNames.Pages_TutorWizard_ContactNumber,
                PermissionNames.Pages_TutorWizard_References,
                PermissionNames.Pages_TutorWizard_References_Create,
                PermissionNames.Pages_TutorWizard_References_Update,
                PermissionNames.Pages_TutorWizard_References_Delete,
                PermissionNames.Pages_TutorWizard_DbsCheck,
                PermissionNames.Pages_TutorWizard_DbsCheck_Create,
                PermissionNames.Pages_TutorWizard_DbsCheck_Update,
                PermissionNames.Pages_TutorWizard_DbsCheck_Delete,
                PermissionNames.Pages_TutorWizard_TermsOfUse,
                PermissionNames.Pages_TutorWizard_PrivacyPolicy,
                PermissionNames.Pages_TutorWizard_Declaration,
                PermissionNames.Pages_Widgets_Verifications,
                PermissionNames.Pages_Calendar,
                PermissionNames.Pages_Calendar_Bookings,
                PermissionNames.Pages_ServiceWizard,
                PermissionNames.Pages_ServiceWizard_Category,
                PermissionNames.Pages_ServiceWizard_Level,
                PermissionNames.Pages_ServiceWizard_Services,
                PermissionNames.Pages_ServiceWizard_CreateProject,
                PermissionNames.Pages_Projects,
                PermissionNames.Pages_Projects_Proposals,
                PermissionNames.Pages_Projects_Hired,
                PermissionNames.Pages_Projects_BrowseTutors,
                PermissionNames.Pages_Conversations,
                PermissionNames.Pages_Notifications,
                PermissionNames.Pages_Home,
                PermissionNames.Pages_Home_Courses,
                PermissionNames.Pages_StudentPortal,
                PermissionNames.Pages_Videos,
                PermissionNames.Pages_Videos_StudentPortal,
                PermissionNames.Pages_Articles,
                PermissionNames.Pages_Articles_StudentPortal,
                PermissionNames.Pages_Forums,
                PermissionNames.Pages_Forums_Create,
                PermissionNames.Pages_Forums_Update,
                PermissionNames.Pages_Forums_Delete,
                PermissionNames.Pages_Events,
                PermissionNames.Pages_Events_StudentPortal,
                PermissionNames.Pages_Community
            );

            #endregion

            #region Student

            var eventAttendeeRole = CreateRoleIfNotExisting(StaticRoleNames.Tenants.EventAttendee);
            GrantPermissions(
                eventAttendeeRole,
                PermissionNames.Pages_Events_StudentPortal
            );

            #endregion
        }

        private void RunDataSeeders()
        {
            new AcademicLevelsBuilder(_context);
            new CurrenciesBuilder(_context);
        }

        private Role CreateRoleIfNotExisting(string roleName)
        {
            var role = _context.Roles.IgnoreQueryFilters().FirstOrDefault(r => r.TenantId == _tenantId && r.Name == roleName);
            if (role == null)
            {
                role = _context.Roles.Add(new Role(_tenantId, roleName, roleName) { IsStatic = true }).Entity;
                _context.SaveChanges();
            }
            return role;
        }

        private void GrantPermissions(Role role, params string[] permissionNames)
        {
            var grantedAdminPermissions = _context.Permissions.IgnoreQueryFilters()
                .OfType<RolePermissionSetting>()
                .Where(p => p.TenantId == _tenantId && p.RoleId == role.Id)
                .Select(p => p.Name)
                .ToList();

            var permissions = PermissionFinder
                .GetAllPermissions(new AcademicallyAuthorizationProvider())
                .Where(p => p.MultiTenancySides.HasFlag(MultiTenancySides.Tenant) &&
                            !grantedAdminPermissions.Contains(p.Name) &&
                            permissionNames.Contains(p.Name))
                .ToList();

            if (permissions.Any())
            {
                _context.Permissions.AddRange(
                    permissions.Select(permission => new RolePermissionSetting
                    {
                        TenantId = _tenantId,
                        Name = permission.Name,
                        IsGranted = true,
                        RoleId = role.Id
                    })
                );
                _context.SaveChanges();
            }

        }
    }
}
