using System;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.UI;
using Abp.Zero.Configuration;
using Academically.Authorization.Accounts.Dto;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Authorization.Accounts
{
    public class AccountAppService : AcademicallyAppServiceBase, IAccountAppService
    {
        // from: http://regexlib.com/REDetails.aspx?regexp_id=1923
        public const string PasswordRegex = "(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$";

        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly UrlEncoder _urlEncoder;
        private readonly IRepository<Registration, Guid> _registrationsRepository;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            UrlEncoder urlEncoder,
            IRepository<Registration, Guid> registrationsRepository
            )
        {
            _userRegistrationManager = userRegistrationManager;
            _urlEncoder = urlEncoder;
            _registrationsRepository = registrationsRepository;
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
            var registration = await _registrationsRepository.GetAsync(input.RegistrationId);
            registration.DateConfirmed = Clock.Now;
            registration.RegistrationStatus = RegistrationStatus.Confirmed;

            var user = await _userRegistrationManager.RegisterAsync(
                    input.Name,
                    input.Surname,
                    input.EmailAddress,
                    input.UserName,
                    input.Password,
                    registration.DateOfBirth,
                    StaticRoleNames.Tenants.Student
                );

            var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

            return new RegisterOutput
            {
                CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
            };
        }

        public async Task<AuthenticatorDto> GetUserTwoFactorAuthentication()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var authenticatorInfo = await LoadSharedKeyAndQrCodeUriAsync(user);
            var output = new AuthenticatorDto()
            {
                IsEnabled = user.IsTwoFactorEnabled,
                SharedKey = authenticatorInfo.sharedKey,
                QrCodeUrl = authenticatorInfo.qrCodeUrl,
            };

            return output;
        }

        public async Task EnableUserTwoFactorAuthenticationAsync(string code)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var verificationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var is2faTokenValid = await UserManager.VerifyTwoFactorTokenAsync(
                user, UserManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);

            if (!is2faTokenValid)
            {
                throw new UserFriendlyException(L("TwoFactorAuthenticationVerificationCodeErrorMessage"));
            }

            await UserManager.SetTwoFactorEnabledAsync(user, true);
        }

        public async Task DisableUserTwoFactorAuthentication()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            await UserManager.SetTwoFactorEnabledAsync(user, false);
        }

        public async Task AuthenticateUserAsync(long userId, string code)
        {
            var user = await UserManager.GetUserByIdAsync(userId);
            var authenticationCode = code.Replace(" ", string.Empty).Replace("-", string.Empty);

            var result = await UserManager.VerifyTwoFactorTokenAsync(
                user, UserManager.Options.Tokens.AuthenticatorTokenProvider, authenticationCode);

            if (!result)
            {
                throw new UserFriendlyException(L("TwoFactorAuthenticationVerificationCodeErrorMessage"));
            }
        }

        private async Task<(string sharedKey, string qrCodeUrl)> LoadSharedKeyAndQrCodeUriAsync(User user)
        {
            var unformattedKey = await UserManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrEmpty(unformattedKey))
            {
                await UserManager.ResetAuthenticatorKeyAsync(user);
                unformattedKey = await UserManager.GetAuthenticatorKeyAsync(user);
            }
            var sharedKey = FormatKey(unformattedKey);

            var email = await UserManager.GetEmailAsync(user);
            var qrCodeUrl = GenerateQrCodeUri(email, unformattedKey);

            return (sharedKey, qrCodeUrl);
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
                AcademicallyConsts.AuthenticatorUriFormat,
                _urlEncoder.Encode("academically"),
                _urlEncoder.Encode(email),
                unformattedKey);
        }
    }
}
