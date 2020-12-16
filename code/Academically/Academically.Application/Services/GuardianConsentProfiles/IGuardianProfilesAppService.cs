using Abp.Application.Services;
using Academically.Services.GuardianProfiles.Dto;
using System.Threading.Tasks;

namespace Academically.Services.GuardianConsentProfiles
{
    public interface IGuardianProfilesAppService : IApplicationService
    {
        Task SaveAsync(GuardianConsentProfileDto input);
    }
}
