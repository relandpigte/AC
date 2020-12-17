using Abp.Application.Services;
using Academically.Services.GuardianProfiles.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.GuardianConsentProfiles
{
    public interface IGuardianProfilesAppService : IApplicationService
    {
        Task SaveAsync(GuardianConsentProfileDto input);
        Task<GuardianConsentProfileDto> GetAsync(Guid id);
        Task GrantAccessToTutorialAsync(GuardianConsentProfileDto input);
    }
}
