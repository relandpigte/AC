using Abp.Domain.Repositories;
using Abp.UI;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Domain.Services.PasswordResets
{
    public class PasswordResetsDomainService : AcademicallyDomainServiceBase, IPasswordResetsDomainService
    {
        private const int MAX_PASSWORD_RESET_VALID_HOURS = 24;

        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<PasswordReset, Guid> _passwordResetsRepository;

        public PasswordResetsDomainService(
           IPasswordHasher<User> passwordHasher,
           IRepository<User, long> usersRepository,
           IRepository<PasswordReset, Guid> passwordResetsRepository
           )
        {
            _passwordHasher = passwordHasher;
            _usersRepository = usersRepository;
            _passwordResetsRepository = passwordResetsRepository;
        }

        public async Task InsertAsync(string email)
        {
            await ValidateEmail(email);

            var passwordReset = new PasswordReset()
            {
                Email = email,
                DateSent = DateTime.UtcNow,
                IsResetted = false,
            };
            await _passwordResetsRepository.InsertAsync(passwordReset);
        }

        public async Task ValidateAsync(Guid id)
        {
            var passwordReset = await ValidatePasswodReset(id);
            await ValidateEmail(passwordReset.Email);
        }

        public async Task ResetPasswordAsync(Guid id, string password)
        {
            var passwordReset = await ValidatePasswodReset(id);
            var user = await ValidateEmail(passwordReset.Email);

            user.Password = _passwordHasher.HashPassword(user, password);
            passwordReset.IsResetted = true;
            passwordReset.ResetDate = DateTime.Now;
            await _passwordResetsRepository.UpdateAsync(passwordReset);
        }

        private async Task<User> ValidateEmail(string email)
        {
            var user = await _usersRepository.FirstOrDefaultAsync(e => e.EmailAddress == email);
            if (user == null)
            {
                throw new UserFriendlyException(L("InvalidRequestDomainError"), L("PasswordResetEmailDomainErrorMessage"));
            }

            return user;
        }

        public async Task<PasswordReset> ValidatePasswodReset(Guid id)
        {
            var passwordReset = await _passwordResetsRepository.GetAsync(id);
            if (passwordReset == null)
            {
                throw new UserFriendlyException(L("InvalidRequestDomainError"), L("PasswordResetNullDomainErrorMessage"));
            }
            else
            {
                ValidatePasswordResetExpiration(passwordReset);
            }

            return passwordReset;
        }

        private void ValidatePasswordResetExpiration(PasswordReset passwordReset)
        {
            var now = DateTime.Now;
            if (!(passwordReset.DateSent > now.AddHours(-MAX_PASSWORD_RESET_VALID_HOURS) && passwordReset.DateSent <= now)
                || (passwordReset.IsResetted))
            {
                throw new UserFriendlyException(L("PasswordResetLinkExpiredDomainError"));
            }
        }
    }
}
