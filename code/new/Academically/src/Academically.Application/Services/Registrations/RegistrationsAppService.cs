using Academically.Domain.Entities;
using Academically.Domain.Services.Registrations;
using Academically.Services.Registrations.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Registrations
{
    public class RegistrationsAppService : AcademicallyAppServiceBase, IRegistrationsAppService
    {
        private readonly IRegistrationsDomainService _registrationsDomainService;

        public RegistrationsAppService(IRegistrationsDomainService registrationsDomainService)
        {
            _registrationsDomainService = registrationsDomainService;
        }

        public async Task<RegistrationDto> Get(Guid id)
        {
            var registration = await _registrationsDomainService.GetAsync(id);
            var outout = ObjectMapper.Map<RegistrationDto>(registration);
            return outout;
        }

        public async Task Create(RegistrationDto input)
        {
            var registration = ObjectMapper.Map<Registration>(input);
            await _registrationsDomainService.InsertAsync(registration);
        }
    }
}
