using Abp.Application.Services;
using Academically.Services.PassportVerifications.Dto;
using System.Threading.Tasks;

namespace Academically.Services.PassportVerifications
{
    public interface IPassportVerificationsAppService : IApplicationService
    {
        Task Create(CreatePassportVerificationDto input);
    }
}
