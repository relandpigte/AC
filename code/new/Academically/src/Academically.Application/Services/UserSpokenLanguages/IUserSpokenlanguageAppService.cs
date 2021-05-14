using Abp.Application.Services;
using Academically.Services.UserSpokenLanguages.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserSpokenLanguages
{
    public interface IUserSpokenlanguageAppService : IApplicationService
    {
        Task<IEnumerable<UserSpokenLanguageDto>> GetUserSpokenLanguages(long userId);
    }
}
