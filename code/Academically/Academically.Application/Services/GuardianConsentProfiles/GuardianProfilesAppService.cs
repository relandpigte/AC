using Abp.Domain.Repositories;
using Academically.DomainServices.Timezone;
using Academically.Entities;
using Academically.Services.GuardianProfiles.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.GuardianConsentProfiles
{
    public class GuardianProfilesAppService : AcademicallyAppServiceBase, IGuardianProfilesAppService
    {
        private readonly IRepository<GuardianConsentProfile, Guid> _guardianProfilesRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;

        public GuardianProfilesAppService(
            IRepository<GuardianConsentProfile, Guid> guardianProfileRepository, 
            IRepository<UserProfile, Guid> userProfilesRepository, 
            IRepository<UserTutorial, Guid> userTutorialsRepository)
        {
            _guardianProfilesRepository = guardianProfileRepository;
            _userProfilesRepository = userProfilesRepository;
            _userTutorialsRepository = userTutorialsRepository;
        }

        public async Task SaveAsync(GuardianConsentProfileDto input)
        {
            var guardianProfile = await _guardianProfilesRepository.FirstOrDefaultAsync(e => e.Id == input.Id);

            if(guardianProfile == null)
            {
                guardianProfile = new GuardianConsentProfile();
            }
            
            ObjectMapper.Map(input, guardianProfile);

            await _guardianProfilesRepository.InsertOrUpdateAsync(guardianProfile);
        } 

        public async Task GrantAccessToTutorialAsync(GuardianConsentProfileDto input)
        {
            var userTutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == input.ReferenceId);
            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.Id == userTutorial.StudentId);
            var guardianProfile = await _guardianProfilesRepository.FirstOrDefaultAsync(e => e.Id == input.Id);

            userProfile.IsConsented = true;
            await _userProfilesRepository.UpdateAsync(userProfile);

            ObjectMapper.Map(input, guardianProfile);
            await _guardianProfilesRepository.UpdateAsync(guardianProfile);
        }

        public async Task<GuardianConsentProfileDto> GetAsync(Guid id)
        {
            var guardianConsentProfile = await _guardianProfilesRepository.GetAll()
                .Where(e => e.Id == id)
                .Select(e => ObjectMapper.Map<GuardianConsentProfileDto>(e))
                .FirstOrDefaultAsync();

            return guardianConsentProfile;
        }
    }
}
