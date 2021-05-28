using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.TutorWizard.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.TutorWizard
{
    [AbpAuthorize(PermissionNames.Pages_TutorWizard)]
    public class TutorWizardAppService : AcademicallyAppServiceBase, ITutorWizardAppService
    {
        private readonly IRepository<TutorVerification, Guid> _tutorVerificationsRepository;

        public TutorWizardAppService(
            IRepository<TutorVerification, Guid> tutorVerificationsRepository
            )
        {
            _tutorVerificationsRepository = tutorVerificationsRepository;
        }

        public async Task<BecomeATutorStep> GetCurrentStep()
        {
            var tutorVerification = await GetCurrent();

            if (tutorVerification == null)
            {
                tutorVerification = new TutorVerification()
                {
                    CurrentStep = BecomeATutorStep.AboutYou,
                    Status = TutorVerificationStatus.Pending,
                };
                await _tutorVerificationsRepository.InsertAsync(tutorVerification);
            }

            return tutorVerification.CurrentStep;
        }

        [AbpAuthorize(PermissionNames.Pages_TutorWizard_AboutYou)]
        public async Task<AboutYouDto> GetAboutYou()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var output = ObjectMapper.Map<AboutYouDto>(user);
            return output;
        }

        [AbpAuthorize(PermissionNames.Pages_TutorWizard_AboutYou)]
        public async Task UpdateAboutYou(AboutYouDto input)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            ObjectMapper.Map(input, user);
            await UserManager.UpdateAsync(user);
        }

        public async Task UpdateStep(BecomeATutorStep step)
        {
            var tutorVerification = await GetCurrent();
            tutorVerification.CurrentStep = step;
            await _tutorVerificationsRepository.UpdateAsync(tutorVerification);
        }

        public async Task UpdateAddress(UpdateAddressDto input)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            ObjectMapper.Map(input, user);
            await UserManager.UpdateAsync(user);
        }

        private async Task<TutorVerification> GetCurrent()
        {
            return await _tutorVerificationsRepository
                .GetAll()
                .Where(e => e.Status == TutorVerificationStatus.Pending)
                .FirstOrDefaultAsync(e => e.CreatorUserId == AbpSession.UserId.Value);
        }
    }
}
