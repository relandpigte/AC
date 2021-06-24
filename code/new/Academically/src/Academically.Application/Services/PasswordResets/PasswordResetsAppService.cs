using Academically.Domain.Services.PasswordResets;
using Academically.Services.PasswordResets.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.PasswordResets
{
    public class PasswordResetsAppService : AcademicallyAppServiceBase, IPasswordResetsAppService
    {
        private readonly IPasswordResetsDomainService _passwordResetsDomainService;

        public PasswordResetsAppService(IPasswordResetsDomainService passwordResetsDomainService)
        {
            _passwordResetsDomainService = passwordResetsDomainService;
        }

        public async Task Create(string emailAddress)
        {
            await _passwordResetsDomainService.InsertAsync(emailAddress);
        }

        public async Task Validate(Guid id)
        {
            await _passwordResetsDomainService.ValidateAsync(id);
        }

        public async Task ResetPassword(PasswordResetInputDto input)
        {
            await _passwordResetsDomainService.ResetPasswordAsync(input.Id, input.NewPassword);
        }
    }
}
