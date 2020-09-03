namespace Academically
{
    public class AcademicallyConsts
    {
        public const string LocalizationSourceName = "Academically";
        public const string ConnectionStringName = "Default";
        public const bool MultiTenancyEnabled = false;
        public const string PasswordSpecialChars = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        public const string PasswordRegexValidator = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[" + PasswordSpecialChars + @"])[A-Za-z\d" + PasswordSpecialChars + "]{8,32}$";
    }
}
