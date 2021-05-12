using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.TutorWizard.Dto;

namespace Academically.Services.TutorWizard
{
    public interface ITutorWizardAppService : IApplicationService
    {
        Task<BecomeATutorStep> GetCurrentStep();
        Task<AboutYouDto> GetAboutYou();
        Task UpdateAboutYou(AboutYouDto input);
    }
}
