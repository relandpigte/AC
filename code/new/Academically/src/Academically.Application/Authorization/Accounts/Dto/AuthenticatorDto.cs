namespace Academically.Authorization.Accounts.Dto
{
    public class AuthenticatorDto
    {
        public bool IsEnabled { get; set; }
        public string SharedKey { get; set; }
        public string QrCodeUrl { get; set; }
    }
}
