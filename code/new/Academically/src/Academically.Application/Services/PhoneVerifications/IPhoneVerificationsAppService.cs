using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.PhoneVerifications.Dto;

namespace Academically.Services.PhoneVerifications
{
    public interface IPhoneVerificationsAppService : IApplicationService
    {
        Task<PhoneVerificationDto> GetLastUnverified();
        Task Create(string recipient);
        Task Verify(string code);
    }
}
