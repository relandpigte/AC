using Abp.Domain.Repositories;
using Academically.Authorization.Users;
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
        private readonly IRepository<User, long> _usersRepository;

        public GuardianProfilesAppService(
            IRepository<GuardianConsentProfile, Guid> guardianProfileRepository, 
            IRepository<UserProfile, Guid> userProfilesRepository, 
            IRepository<User, long> usersRepository,
            IRepository<UserTutorial, Guid> userTutorialsRepository)
        {
            _guardianProfilesRepository = guardianProfileRepository;
            _userProfilesRepository = userProfilesRepository;
            _userTutorialsRepository = userTutorialsRepository;
            _usersRepository = usersRepository;
        }

        public async Task SaveAsync(GuardianConsentProfileDto input)
        {
            var guardianProfile = await _guardianProfilesRepository.FirstOrDefaultAsync(e => e.Id == input.Id);

            if(guardianProfile == null)
            {
                guardianProfile = new GuardianConsentProfile();
                guardianProfile.ReferenceId = AbpSession.UserId.Value.ToString() ;
            }
            
            ObjectMapper.Map(input, guardianProfile);

            await _guardianProfilesRepository.InsertOrUpdateAsync(guardianProfile);
        } 

        public async Task GrantAccessToTutorialAsync(GuardianConsentProfileDto input)
        {
            var guardianConsent = await _guardianProfilesRepository.FirstOrDefaultAsync(e => e.Id == input.Id);
            var student = await _usersRepository.FirstOrDefaultAsync(e => e.Id == Convert.ToInt64(guardianConsent.ReferenceId));
            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == student.Id);
            
            userProfile.IsConsented = true;
            await _userProfilesRepository.UpdateAsync(userProfile);

            ObjectMapper.Map(input, guardianConsent);
            await _guardianProfilesRepository.UpdateAsync(guardianConsent);
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
