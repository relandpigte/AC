using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Services.Registrations;
using Academically.Services.Registrations.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Registrations
{
    public class RegistrationsAppService : AcademicallyAppServiceBase, IRegistrationsAppService
    {
        private readonly IRepository<User, long> _usersRepository; 
        private readonly IRegistrationsDomainService _registrationsDomainService;

        public RegistrationsAppService(
            IRegistrationsDomainService registrationsDomainService,
            IRepository<User, long> usersRepository
            )
        {
            _registrationsDomainService = registrationsDomainService;
            _usersRepository = usersRepository;
        }

        public async Task<RegistrationDto> Get(Guid id)
        {
            var registration = await _registrationsDomainService.GetAsync(id);
            var outout = ObjectMapper.Map<RegistrationDto>(registration);
            return outout;
        }

        public async Task<bool> CheckEmailUniqueness(string email)
        {
            email = email.ToLower();
            return await _usersRepository
                .GetAll()
                .WhereIf(AbpSession.UserId.HasValue, e => e.Id != AbpSession.UserId.Value)
                .AnyAsync(e => e.EmailAddress.ToLower() == email);
        }

        public async Task Create(RegistrationDto input)
        {
            var existingUser = await _usersRepository.GetAll()
                .Where(e => e.UserName == input.EmailAddress || e.EmailAddress == input.EmailAddress)
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                throw new UserFriendlyException(L("UserExistsErrorTitle"), L("UserExistsErrorMessage"));
            }

            var registration = ObjectMapper.Map<Registration>(input);
            await _registrationsDomainService.InsertAsync(registration);
        }
    }
}
