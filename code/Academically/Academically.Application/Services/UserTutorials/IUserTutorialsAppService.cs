using Abp.Application.Services;
using Academically.Services.UserTutorials.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserTutorials
{
    public interface IUserTutorialsAppService : IApplicationService
    {
        Task CreateAsync(UserTutorialDto inputs);
        Task<IEnumerable<SupportLevelDto>> GetSupportLevelsAsync();
    }
}
