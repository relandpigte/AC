using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Extensions;
using Academically.Services.UserAvailabilities.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserAvailabilities
{
    public class UserAvailabilitiesAppService : AcademicallyAppServiceBase, IUserAvailabilitiesAppService
    {
        private readonly IRepository<UserAvailability, Guid> _userAvailabilitiesRepository;

        public UserAvailabilitiesAppService(
            IRepository<UserAvailability, Guid> userAvailabilitiesRepository
        )
        {
            _userAvailabilitiesRepository = userAvailabilitiesRepository;
        }

        public async Task<IEnumerable<UserAvailabilityDto>> GetAll(int userId)
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

        [AbpAuthorize(PermissionNames.Pages_Calendar_Schedules)]
        public async Task CreateEdit(IEnumerable<UserAvailabilityDto> inputs)
        {
            foreach (var input in inputs)
            {
                var userAvailability = ObjectMapper.Map<UserAvailability>(input);
                userAvailability.UserId = AbpSession.UserId.Value;
                await _userAvailabilitiesRepository.InsertOrUpdateAsync(userAvailability);
            }
        }
    }
}
