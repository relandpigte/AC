using System;
using System.Threading.Tasks;
using Academically.Services.Registrations.Dto;

namespace Academically.Services.Registrations
{
    public interface IRegistrationsAppService
    {
        Task<RegistrationDto> Get(Guid id);
        Task Create(RegistrationDto input);
    }
}
