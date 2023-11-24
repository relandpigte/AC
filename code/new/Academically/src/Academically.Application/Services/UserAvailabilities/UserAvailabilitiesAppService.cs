using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Extensions;
using Academically.Services.UserAvailabilities.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserAvailabilities
{
    public class UserAvailabilitiesAppService : AcademicallyAppServiceBase, IUserAvailabilitiesAppService
    {
        private readonly IRepository<UserAvailability, Guid> _userAvailabilitiesRepository;
        private readonly IRepository<UserAvailabilitySetting, Guid> _userAvailabilitySettingRepository;

        public UserAvailabilitiesAppService(
            IRepository<UserAvailability, Guid> userAvailabilitiesRepository,
            IRepository<UserAvailabilitySetting, Guid> userAvailabilitySettingRepository
        )
        {
            _userAvailabilitiesRepository = userAvailabilitiesRepository;
            _userAvailabilitySettingRepository = userAvailabilitySettingRepository;
        }

        public async Task<IEnumerable<UserAvailabilityDto>> GetAll(long userId)
        {
            var userAvailabilities = await _userAvailabilitiesRepository.GetAll()
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<UserAvailabilityDto>(e))
                .ToListAsync();
            if (!userAvailabilities.Any() || userAvailabilities.Count == 0)
            {
                userAvailabilities = new List<UserAvailabilityDto>();
                foreach (var dayOfWeek in EnumExtensions.GetValues<DayOfWeek>())
                {
                    userAvailabilities.Add(new UserAvailabilityDto()
                    {
                        DayOfWeek = dayOfWeek,
                        StartTime = "08:00",
                        EndTime = "17:00",
                        IsAvailable = dayOfWeek != DayOfWeek.Saturday && dayOfWeek != DayOfWeek.Sunday,
                    });;
                }
            }
            return userAvailabilities;
        }
        
        public async Task<IEnumerable<UserAvailabilityDto>> GetAvailabilitiesByUser(long userId)
        {
            return await _userAvailabilitiesRepository.GetAll()
                .Where(x => x.UserId == userId)
                .Select(e => ObjectMapper.Map<UserAvailabilityDto>(e))
                .ToListAsync();
        }

        [AbpAuthorize(PermissionNames.Pages_Calendar_Schedules)]
        public async Task CreateEdit(IEnumerable<UserAvailabilityDto> inputs)
        {
            var preservedIds = inputs.Select(i => i.Id).Where(i => i != null).ToList();
            foreach (var input in inputs)
            {
                var userAvailability = ObjectMapper.Map<UserAvailability>(input);
                userAvailability.UserId = AbpSession.UserId.Value;
                var created = await _userAvailabilitiesRepository.InsertOrUpdateAsync(userAvailability);
                preservedIds.Add(created.Id);
            }
            await _userAvailabilitiesRepository.DeleteAsync(a => !preservedIds.Contains(a.Id));
        }

        public async Task<UserAvailabilitySetting> SaveAvailabilitySettingsAsync(UserAvailabilitySettingDto input)
        {
            var availabilitySetting = await GetAvailabilitySettings() ?? new UserAvailabilitySetting();

            ObjectMapper.Map(input, availabilitySetting);
            return await _userAvailabilitySettingRepository.InsertOrUpdateAsync(availabilitySetting);
        }
        
        public async Task<UserAvailabilitySetting> GetAvailabilitySettings()
        {
            return await _userAvailabilitySettingRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .SingleOrDefaultAsync();
        }
    }
}
