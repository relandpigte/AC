using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Registrations.Dto;

namespace Academically.Services.Registrations
{
    public interface IRegistrationsAppService : IApplicationService
    {
        Task<RegistrationDto> Get(Guid id);
        Task Create(RegistrationDto input);
    }
}
