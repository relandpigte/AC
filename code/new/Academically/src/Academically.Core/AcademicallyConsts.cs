namespace Academically
{
    public class AcademicallyConsts
    {
        public const string LocalizationSourceName = "Academically";
        public const string ConnectionStringName = "Default";
        public const bool MultiTenancyEnabled = false;
        public const string PasswordSpecialChars = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        public const string PasswordRegexValidator = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[" + PasswordSpecialChars + @"])[A-Za-z\d" + PasswordSpecialChars + "]{8,32}$";
        public const string DefaultSmsSender = "Academ";
        public const string AuthenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";
    }
}
