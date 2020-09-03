using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.UI;
using Academically.Entities;
using Academically.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace Academically.DomainServices.Registrations
{
    public class RegistrationsDomainService : AcademicallyDomainServiceBase, IRegistrationsDomainService
    {
        private const int MAX_REGISTRATION_VALID_HOURS = 24;

        private readonly IRepository<Registration, Guid> _registrationsRepository;

        public RegistrationsDomainService(IRepository<Registration, Guid> registrationsRepository)
        {
            _registrationsRepository = registrationsRepository;
        }

        public async Task<Registration> GetAsync(Guid id)
        {
            var registration = await GetAndValidateAsync(id);
            return registration;
        }

        public async Task InsertAsync(Registration registration)
        {
            registration.DateRegistered = Clock.Now;
            await _registrationsRepository.InsertAsync(registration);
        }

        private async Task<Registration> GetAndValidateAsync(Guid id)
        {
            var registration = await _registrationsRepository.GetAll().FirstOrDefaultAsync(e => e.Id == id);
            if (registration == null)
            {
                throw new UserFriendlyException(L("InvalidRequestDomainError"), L("RegistrationRequestNullDomainErrorMessage"));
            }

            ValidateRegistrationExpiration(registration);

            return registration;
        }


        private void ValidateRegistrationExpiration(Registration registration)
        {
            var now = Clock.Now;
            if (!(registration.DateRegistered > now.AddHours(-MAX_REGISTRATION_VALID_HOURS) && registration.DateRegistered <= now)
                || (registration.RegistrationStatus == RegistrationStatus.Confirmed))
            {
                throw new UserFriendlyException(L("InvalidRequestDomainError"), L("RegistrationCompletionLinkExpiredDomainError"));
            }
        }
    }
}
