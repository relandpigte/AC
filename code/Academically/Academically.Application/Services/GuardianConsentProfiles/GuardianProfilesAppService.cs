using Abp.Domain.Repositories;
using Academically.DomainServices.Timezone;
using Academically.Entities;
using Academically.Services.GuardianProfiles.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.GuardianConsentProfiles
{
    public class GuardianProfilesAppService : AcademicallyAppServiceBase, IGuardianProfilesAppService
    {
        private readonly IRepository<GuardianConsentProfile, Guid> _guardianProfileRepository;

        public GuardianProfilesAppService(IRepository<GuardianConsentProfile, Guid> guardianProfileRepository)
        {
            _guardianProfileRepository = guardianProfileRepository;
        }

        public async Task SaveAsync(GuardianConsentProfileDto input)
        {
            var guardianProfile = await _guardianProfileRepository.FirstOrDefaultAsync(e => e.Id == input.Id);

            if(guardianProfile == null)
            {
                guardianProfile = new GuardianConsentProfile();
            }

            ObjectMapper.Map(input, guardianProfile);

            await _guardianProfileRepository.InsertOrUpdateAsync(guardianProfile);
        } 
    }
}
