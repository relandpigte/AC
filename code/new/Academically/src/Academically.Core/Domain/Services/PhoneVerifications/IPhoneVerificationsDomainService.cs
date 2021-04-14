using System.Threading.Tasks;
using Abp.Domain.Services;
using Academically.Domain.Entities;

namespace Academically.Domain.Services.PhoneVerifications
{
    public interface IPhoneVerificationsDomainService : IDomainService
    {
        Task<PhoneVerification> GetLastUnverified(long userId);
        Task InsertAsync(long userId, string recipient);
        Task VerifyAsync(long userId, string code);
    }
}
