using Abp.Application.Services;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.UserServices
{
    public interface IUserServicesAppService : IApplicationService
    {
        Task<IEnumerable<UserServiceDto>> Get(long userId, Guid serviceId);
        Task<IEnumerable<ServiceDto>> GetServiceTree(long userId);
        Task Create(UserServiceDto input);
    }
}
