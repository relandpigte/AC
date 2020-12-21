using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.Timezones.Dto;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Timezones
{
    public class TimezonesAppService : AcademicallyAppServiceBase, ITimezonesAppService
    {
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        public TimezonesAppService(IRepository<UserProfile, Guid> userProfilesRepository)
        {
            _userProfilesRepository = userProfilesRepository;
        }

        public IEnumerable<TimezoneInfoDto> GetTimezonesList()
        {
            var timezones = TimeZoneInfo.GetSystemTimeZones();
            var result = timezones.Select(t => ObjectMapper.Map<TimezoneInfoDto>(t));
            return result;
        }

        public async Task<TimezoneInfoDto> GetTimezoneInfo(long userId)
        {
            var timezoneInfo = new TimezoneInfoDto();
            var profile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            if (profile != null && profile.TimezoneId != null) 
            {
                var timezone = TimeZoneInfo.FindSystemTimeZoneById(profile.TimezoneId);
                ObjectMapper.Map(timezone, timezoneInfo);

                return timezoneInfo;
            } 
            
            return null;
        }
    }
}
