using Academically.Authorization.Users;
using SourceCloud.Core.Services;
using System.Threading.Tasks;

namespace Academically.Services.Payments
{
    public class PaymentsAppService : AcademicallyAppServiceBase, IPaymentsAppService
    {
        private readonly IPaymentService _paymentService;

        public PaymentsAppService(
            IPaymentService paymentService
            )
        {
            _paymentService = paymentService;
        }

        public async Task<string> OnboardUser(string code)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            user.StripeUserId = await _paymentService.OnboardAsync(code);
            await UserManager.UpdateAsync(user);
            return user.StripeUserId;
        }
    }
}
