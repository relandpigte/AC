using Academically.Application.Shared.Services;
using Stripe;
using System.Threading.Tasks;

namespace Academically.Payment.Services
{
    public class StripePaymentService : IPaymentService
    {
        private const string GRANT_TYPE_AUTHORIZATION_CODE = "authorization_code";
        private readonly StripePaymentOptions _configuration;

        public StripePaymentService(
            StripePaymentOptions configuration
            )
        {
            _configuration = configuration;
        }

        public async Task<string> OnboardAsync(string code)
        {
            var tokenService = new OAuthTokenService();
            var createTokenOptions = new OAuthTokenCreateOptions
            {
                GrantType = GRANT_TYPE_AUTHORIZATION_CODE,
                Code = code,
            };
            var requestOptions = new RequestOptions
            {
                ApiKey = _configuration.SecretKey,
            };
            var response = await tokenService.CreateAsync(createTokenOptions, requestOptions);
            return response.StripeUserId;
        }
    }
}
