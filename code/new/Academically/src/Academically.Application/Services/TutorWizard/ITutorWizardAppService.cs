using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.TutorWizard.Dto;

namespace Academically.Services.TutorWizard
{
    public interface ITutorWizardAppService : IApplicationService
    {
        Task<TutorVerificationStepDto> GetCurrentStep();
        Task<TutorVerificationDto> GetTutorVerificationAsync();

        Task<AboutYouDto> GetAboutYou();
        Task UpdateAboutYou(AboutYouDto input);
        Task UpdateAddress(UpdateAddressDto input);

        Task<TutorVerificationStepDto> UpdateStep(BecomeATutorStep step);
    }
}
