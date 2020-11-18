using Abp.Application.Services;
using Academically.Services.PasswordResets.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.PasswordResets
{
    public interface IPasswordResetsAppService : IApplicationService
    {
        Task Create(string emailAddress);
        Task Validate(Guid id);
        Task ResetPassword(PasswordResetInputDto input);
    }
}
