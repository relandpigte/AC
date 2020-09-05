namespace Academically.Authorization.Roles
{
    public static class StaticRoleNames
    {
        public static class Host
        {
            public const string Admin = "Admin";
        }

        public static class Tenants
        {
            public const string Admin = "Admin";
            public const string SuperAdmin = "Super Admin";
            public const string AccountManager = "Account Manager";
            public const string Tutor = "Tutor";
            public const string Student = "Student";
            public const string Applicant = "Applicant";
        }
    }
}
