using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserTutorials.Dto;

namespace Academically.Services.UserTutorials
{
    public interface IUserTutorialsAppService : IApplicationService
    {
        Task<Guid> CreateAsync(SaveUserTutorialDto inputs);
        Task<UserTutorialDto> GetAsync(Guid id);
        Task<IEnumerable<UserTutorialDto>> GetRecent();
    }
}
