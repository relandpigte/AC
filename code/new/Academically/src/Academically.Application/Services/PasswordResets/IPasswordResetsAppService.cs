using System;
using System.Threading.Tasks;
using Academically.Services.PasswordResets.Dto;

namespace Academically.Services.PasswordResets
{
    public interface IPasswordResetsAppService
    {
        Task Create(string emailAddress);
        Task Validate(Guid id);
        Task ResetPassword(PasswordResetInputDto input);
    }
}
