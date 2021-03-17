using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    public interface IUserEducationsAppService : IApplicationService
    {
        Task<IEnumerable<UserEducationDto>> GetAll(long userId);
        Task Create(UserEducationDto input);
        Task Update(UserEducationDto input);
        Task Delete(Guid id);
    }
}
