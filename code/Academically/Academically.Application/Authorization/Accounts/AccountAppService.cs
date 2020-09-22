using System;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.Zero.Configuration;
using Academically.Authorization.Accounts.Dto;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Entities;
using Academically.Entities.Enums;

namespace Academically.Authorization.Accounts
{
    public class AccountAppService : AcademicallyAppServiceBase, IAccountAppService
    {
        // from: http://regexlib.com/REDetails.aspx?regexp_id=1923
        public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IRepository<Registration, Guid> _registrationsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfileRepository;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            IRepository<Registration, Guid> registrationsRepository,
            IRepository<UserProfile, Guid> userProfileRepository
            )
        {
            _userRegistrationManager = userRegistrationManager;
            _registrationsRepository = registrationsRepository;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
        {
            var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
            if (tenant == null)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
            }

            if (!tenant.IsActive)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
            }

            return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id);
        }

        public async Task<RegisterOutput> Register(RegisterInput input)
        {
            var user = await _userRegistrationManager.RegisterAsync(
                    input.Name,
                    input.Surname,
                    input.EmailAddress,
                    input.UserName,
                    input.Password,
                    true, // Assumed email address is always confirmed. Change this if you want to implement email confirmation.
                    StaticRoleNames.Tenants.Student
                );

            var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

            var registration = await _registrationsRepository.GetAsync(input.RegistrationId);
            registration.DateConfirmed = Clock.Now;
            registration.RegistrationStatus = RegistrationStatus.Confirmed;

            if(user.Id != 0)
            {
                var userProfile = new UserProfile();
                userProfile.UserId = user.Id;
                userProfile.DateOfBirth = registration.DateOfBirth;

                await _userProfileRepository.InsertAsync(userProfile);
            }

            return new RegisterOutput
            {
                CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
            };
        }
    }
}
