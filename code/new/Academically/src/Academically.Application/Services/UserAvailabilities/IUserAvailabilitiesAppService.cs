using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Entities;
using Academically.Services.UserAvailabilities.Dto;

namespace Academically.Services.UserAvailabilities
{
    public interface IUserAvailabilitiesAppService : IApplicationService
    {
        Task<IEnumerable<UserAvailabilityDto>> GetAll(long userId);
        Task CreateEdit(IEnumerable<UserAvailabilityDto> inputs);
        Task<UserAvailabilitySetting> SaveAvailabilitySettingsAsync(UserAvailabilitySettingDto input);
        Task<UserAvailabilitySetting> GetAvailabilitySettings();
    }
}
