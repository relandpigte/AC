using System.Threading.Tasks;
using Academically.Domain.Entities;
using Academically.Domain.Services.Registrations;
using Academically.Services.Registrations.Dto;

namespace Academically.Services.Registrations
{
    public class RegistrationsAppService : AcademicallyAppServiceBase, IRegistrationsAppService
    {
        private readonly IRegistrationsDomainService _registrationsDomainService;

        public RegistrationsAppService(IRegistrationsDomainService registrationsDomainService)
        {
            _registrationsDomainService = registrationsDomainService;
        }

        public async Task Create(RegistrationDto input)
        {
            var registration = ObjectMapper.Map<Registration>(input);
            await _registrationsDomainService.InsertAsync(registration);
        }
    }
}
