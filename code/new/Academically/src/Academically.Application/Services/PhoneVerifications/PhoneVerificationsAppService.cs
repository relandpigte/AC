using System.Threading.Tasks;
using Abp.Authorization;
using Academically.Authorization;
using Academically.Domain.Services.PhoneVerifications;
using Academically.Services.PhoneVerifications.Dto;

namespace Academically.Services.PhoneVerifications
{
    [AbpAuthorize(PermissionNames.Pages_Widgets_Verifications, PermissionNames.Pages_TutorApplications_ContactNumber)]
    public class PhoneVerificationsAppService : AcademicallyAppServiceBase, IPhoneVerificationsAppService
    {
        private readonly IPhoneVerificationsDomainService _phoneVerificationsDomainService;

        public PhoneVerificationsAppService(
            IPhoneVerificationsDomainService phoneVerificationsDomainService
            )
        {
            _phoneVerificationsDomainService = phoneVerificationsDomainService;
        }

        public async Task<PhoneVerificationDto> GetLastUnverified()
        {
            var phoneVerification = await _phoneVerificationsDomainService.GetLastUnverified(AbpSession.UserId.Value);
            var output = ObjectMapper.Map<PhoneVerificationDto>(phoneVerification);
            return output;
        }

        public async Task Create(string recipient)
        {
            await _phoneVerificationsDomainService.InsertAsync(AbpSession.UserId.Value, recipient);
        }

        public async Task Verify(string code)
        {
            await _phoneVerificationsDomainService.VerifyAsync(AbpSession.UserId.Value, code);
        }
    }
}
