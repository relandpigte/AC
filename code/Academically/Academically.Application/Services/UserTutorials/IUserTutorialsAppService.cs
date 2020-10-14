using Abp.Application.Services;
using Academically.Services.UserTutorials.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserTutorials
{
    public interface IUserTutorialsAppService : IApplicationService
    {
        Task CreateAsync(SaveUserTutorialDto inputs);
        Task<IEnumerable<UserTutorialDto>> GetAsync();
        Task<IEnumerable<SupportLevelDto>> GetSupportLevelsAsync();
    }
}
