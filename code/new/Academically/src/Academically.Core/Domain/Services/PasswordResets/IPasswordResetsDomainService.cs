using System;
using System.Threading.Tasks;
using Abp.Domain.Services;

namespace Academically.Domain.Services.PasswordResets
{
    public interface IPasswordResetsDomainService : IDomainService
    {
        Task InsertAsync(string email);
        Task ValidateAsync(Guid id);
        Task ResetPasswordAsync(Guid id, string password);
    }
}
