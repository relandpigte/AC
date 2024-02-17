namespace Academically.Payment.Services
{
    public class StripePaymentOptions
    {
        public string ClientId { get; set; }
        public string PublicKey { get; set; }
        public string SecretKey { get; set; }
    }
}
