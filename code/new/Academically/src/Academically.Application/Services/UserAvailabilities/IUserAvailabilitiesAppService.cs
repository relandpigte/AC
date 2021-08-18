using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserAvailabilities.Dto;

namespace Academically.Services.UserAvailabilities
{
    public interface IUserAvailabilitiesAppService : IApplicationService
    {
        Task<IEnumerable<UserAvailabilityDto>> GetAll(int userId);
        Task CreateEdit(IEnumerable<UserAvailabilityDto> inputs);
    }
}
