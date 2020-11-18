using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.DomainServices.PasswordResets
{
    public interface IPasswordResetsDomainService : IDomainService
    {
        Task InsertAsync(string email);
        Task ValidateAsync(Guid id);
        Task ResetPasswordAsync(Guid id, string password);
    }
}
