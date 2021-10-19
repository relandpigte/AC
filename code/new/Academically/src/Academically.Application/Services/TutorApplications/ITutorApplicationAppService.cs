using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.TutorWizard.Dto;
using Academically.Users.Dto;

namespace Academically.Services.TutorApplications
{
    public interface ITutorApplicationAppService : IApplicationService
    {
        Task<PagedResultDto<TutorVerificationDto>> GetAllAsync(PagedUserResultRequestDto input);
        Task<TutorVerificationStepDto> GetPendingStep(long userId);

        Task<TutorVerificationDto> GetAsync(long userId);
        Task<TutorVerificationStepDto> GetStepAsync(Guid verificationId, BecomeATutorStep step);
        Task<TutorVerificationStepDto> GetPreviousStepAsync(Guid verificationId, BecomeATutorStep step);
        Task<TutorVerificationStepDto> GetNextStepAsync(Guid verificationId, BecomeATutorStep step);
    }
}
