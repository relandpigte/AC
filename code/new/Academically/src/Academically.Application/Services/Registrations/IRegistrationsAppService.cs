using Abp.Application.Services;
using Academically.Services.Registrations.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Registrations
{
    public interface IRegistrationsAppService : IApplicationService
    {
        Task<RegistrationDto> Get(Guid id);
        Task Create(RegistrationDto input);
    }
}
