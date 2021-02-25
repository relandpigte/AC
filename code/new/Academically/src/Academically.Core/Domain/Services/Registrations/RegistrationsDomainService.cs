using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;

namespace Academically.Domain.Services.Registrations
{
    public class RegistrationsDomainService : AcademicallyDomainServiceBase, IRegistrationsDomainService
    {
        private const int MAX_REGISTRATION_VALID_HOURS = 24;

        private readonly IRepository<Registration, Guid> _registrationsRepository;

        public RegistrationsDomainService(IRepository<Registration, Guid> registrationsRepository)
        {
            _registrationsRepository = registrationsRepository;
        }

        public async Task InsertAsync(Registration registration)
        {
            registration.DateRegistered = Clock.Now;
            await _registrationsRepository.InsertAsync(registration);
        }
    }
}
