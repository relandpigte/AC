using System;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.Zero.Configuration;
using Academically.Accounts.Dto;
using Academically.Authorization.Accounts.Dto;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Entities.Enums;
using Castle.Facilities.TypedFactory.Internal;
using Microsoft.AspNetCore.Identity;

namespace Academically.Authorization.Accounts
{
    public class AccountAppService : AcademicallyAppServiceBase, IAccountAppService
    {
        // from: http://regexlib.com/REDetails.aspx?regexp_id=1923
        public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";
        public const string AuthenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";

        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IRepository<Registration, Guid> _registrationsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfileRepository;
        private readonly UrlEncoder _urlEncoder;
        private readonly UserManager _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            IRepository<Registration, Guid> registrationsRepository,
            IRepository<UserProfile, Guid> userProfileRepository,
            UrlEncoder urlEncoder,
            UserManager userManager,
            SignInManager<User> signInManager
            )
        {
            _userRegistrationManager = userRegistrationManager;
            _registrationsRepository = registrationsRepository;
            _userProfileRepository = userProfileRepository;
            _urlEncoder = urlEncoder;
            _userManager = userManager;
            _signInManager = signInManager;
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

        public async Task<bool> GetUserTwoFactorAuthenticationStatus(long userId)
        {
            var user = await _userManager.GetUserByIdAsync(userId);

            return user.IsTwoFactorEnabled;
        }

        public async Task<AuthenticatorDto> GetUserTwoFactorAuthenticationAsync(long userId)
        {
            var user = await _userManager.GetUserByIdAsync(userId);
            var result = await LoadSharedKeyAndQrCodeUriAsync(user);

            return result;
        }

        public async Task<AuthenticatorDto> EnableUserTwoFactorAuthenticationAsync(long userId, string code)
        {
            var user = await _userManager.GetUserByIdAsync(userId);
            var verificationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(
                user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);

            if (!is2faTokenValid)
            {
                return new AuthenticatorDto
                {
                    StatusMessage = "Verification Code is not recognised please try again",
                    Status = false
                };
            }

            await _userManager.SetTwoFactorEnabledAsync(user, true);

            return new AuthenticatorDto
            {
                StatusMessage = "2FA is enabled, uncheck to disable, if you have a new device or need to reset then uncheck and recheck the checkbox.",
                Status = true
            };
        }

        public async Task<bool> DisableUserTwoFactorAuthentication(long userId)
        {
            var user = await _userManager.GetUserByIdAsync(userId);
            await _userManager.SetTwoFactorEnabledAsync(user, false);

            return true;
        }

        public async Task<AuthenticatorDto> AuthenticateUserAsync(long userId, string code)
        {
            var user = await _userManager.GetUserByIdAsync(userId);
            var authenticationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var result = await _userManager.VerifyTwoFactorTokenAsync(
                user, _userManager.Options.Tokens.AuthenticatorTokenProvider, authenticationCode);

            if (result)
            {
                return new AuthenticatorDto
                {
                    Status = true
                };
            }
            else
            {
                return new AuthenticatorDto
                {
                    Status = false,
                    StatusMessage = "Verification Code is not recognised please try again"
                };
            }
        }

        public async Task<AuthenticatorDto> LoadSharedKeyAndQrCodeUriAsync(User user)
        {
            var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrEmpty(unformattedKey))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            }
            var sharedKey = FormatKey(unformattedKey);

            var email = await _userManager.GetEmailAsync(user);
            var AuthenticationUri = GenerateQrCodeUri(email, unformattedKey);

            return new AuthenticatorDto
            {
                SharedKey = sharedKey,
                AuthenticationUri = AuthenticationUri,
                Status = true
            };
        }

        private string FormatKey(string unformattedKey)
        {
            var result = new StringBuilder();
            int currentPosition = 0;
            while (currentPosition + 4 < unformattedKey.Length)
            {
                result.Append(unformattedKey.Substring(currentPosition, 4)).Append(" ");
                currentPosition += 4;
            }
            if (currentPosition < unformattedKey.Length)
            {
                result.Append(unformattedKey.Substring(currentPosition));
            }

            return result.ToString().ToLowerInvariant();
        }

        private string GenerateQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(
                AuthenticatorUriFormat,
                _urlEncoder.Encode("academically"),
                _urlEncoder.Encode(email),
                unformattedKey);
        }
    }
}
