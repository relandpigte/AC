using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Timing;
using Abp.UI;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Academically.Domain.Services.PhoneVerifications
{
    public class PhoneVerificationsDomainService : AcademicallyDomainServiceBase, IPhoneVerificationsDomainService
    {
        private readonly IRepository<PhoneVerification, Guid> _phoneVerificationsRepository;
        private readonly IRepository<User, long> _usersRepository;

        public PhoneVerificationsDomainService(
            IRepository<PhoneVerification, Guid> phoneVerificationsRepository,
            IRepository<User, long> usersRepository
            )
        {
            _phoneVerificationsRepository = phoneVerificationsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<PhoneVerification> GetLastUnverified(long userId)
        {
            var phoneVerification = await _phoneVerificationsRepository.GetAll()
                .Where(e => e.UserId == userId && !e.DateConfirmed.HasValue)
                .OrderByDescending(e => e.DateSent)
                .FirstOrDefaultAsync();
            return phoneVerification;
        }

        public async Task InsertAsync(long userId, string recipient)
        {
            var phoneVerification = new PhoneVerification()
            {
                UserId = userId,
                Recipient = recipient,
                Code = GenerateVerificationCode(),
            };
            await _phoneVerificationsRepository.InsertAsync(phoneVerification);
        }

        public async Task VerifyAsync(long userId, string code)
        {
            var phoneVerification = await GetLastUnverified(userId);
            if (phoneVerification == null || phoneVerification.Code != code)
            {
                throw new UserFriendlyException(L("PhoneNumberVerificationCodeInvalidErrorTitle"), L("PhoneNumberVerificationCodeInvalidErrorMessage"));
            }

            phoneVerification.DateConfirmed = Clock.Now;
            await _phoneVerificationsRepository.UpdateAsync(phoneVerification);

            var user = await _usersRepository.GetAsync(userId);
            if (user.PhoneNumber.IsNullOrWhiteSpace())
            {
                user.PhoneNumber = phoneVerification.Recipient;
            }
            user.IsPhoneNumberConfirmed = true;
            await _usersRepository.UpdateAsync(user);
        }

        private string GenerateVerificationCode()
        {
            var rand = new Random();
            return rand.Next(0, 1000000).ToString("D6");
        }
    }
}
