using System;
using System.Collections.Generic;
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
        private readonly IRepository<TutorVerificationStep, Guid> _tutorVerificationStepsRepository;

        public TutorWizardAppService(
            IRepository<TutorVerification, Guid> tutorVerificationsRepository,
            IRepository<TutorVerificationStep, Guid> tutorVerificationStepsRepository
            )
        {
            _tutorVerificationsRepository = tutorVerificationsRepository;
            _tutorVerificationStepsRepository = tutorVerificationStepsRepository;
        }

        public async Task<TutorVerificationStepDto> GetCurrentStep()
        {
            var tutorVerification = await GetCurrent(AbpSession.UserId.Value);
            var currentStep = new TutorVerificationStep();

            if (tutorVerification == null)
            {
                currentStep = new TutorVerificationStep()
                {
                    Status = TutorVerificationStepStatus.Incomplete,
                    Step = BecomeATutorStep.AboutYou,
                };

                tutorVerification = new TutorVerification()
                {
                    CurrentStep = BecomeATutorStep.AboutYou,
                    Status = TutorVerificationStatus.Pending,
                    TutorVerificationSteps = new List<TutorVerificationStep>
                    {
                        currentStep
                    }
                };
                await _tutorVerificationsRepository.InsertAsync(tutorVerification);
            }
            else
            {
                currentStep = tutorVerification.TutorVerificationSteps.FirstOrDefault(e => e.Step == tutorVerification.CurrentStep);
            }

            return ObjectMapper.Map<TutorVerificationStepDto>(currentStep);
        }

        public async Task<TutorVerificationStepDto> GetPendingStep(long userId)
        {
            var tutorVerification = await GetCurrent(userId);
            var currentStep = tutorVerification.TutorVerificationSteps
                .OrderBy(e => e.Step)
                .FirstOrDefault(e => e.Status == TutorVerificationStepStatus.Saved);

            return ObjectMapper.Map<TutorVerificationStepDto>(currentStep);
        }

        public async Task<TutorVerificationDto> GetTutorVerificationAsync()
        {
            var tutorVerification = await GetCurrent(AbpSession.UserId.Value);

            if (!tutorVerification.TutorVerificationSteps.Any())
            {
                var tutorVerificationStep = new TutorVerificationStep()
                {
                    Step = BecomeATutorStep.AboutYou,
                    Status = TutorVerificationStepStatus.Incomplete
                };
                tutorVerification.TutorVerificationSteps.Add(tutorVerificationStep);
            }

            return ObjectMapper.Map<TutorVerificationDto>(tutorVerification);
        }

        [AbpAuthorize(PermissionNames.Pages_TutorWizard_AboutYou)]
        public async Task<AboutYouDto> GetAboutYou(long? userId)
        {
            var user = await UserManager.GetUserByIdAsync(userId ?? AbpSession.UserId.Value);
            var output = ObjectMapper.Map<AboutYouDto>(user);
            return output;
        }

        [AbpAuthorize(PermissionNames.Pages_TutorWizard_AboutYou)]
        public async Task UpdateAboutYou(AboutYouDto input)
        {
            var user = await UserManager.GetUserByIdAsync(input.UserId ?? AbpSession.UserId.Value);
            ObjectMapper.Map(input, user);
            await UserManager.UpdateAsync(user);

            await UpdateCurrentStepStatus();
        }

        public async Task<TutorVerificationStepDto> UpdateStep(BecomeATutorStep step)
        {
            var tutorVerification = await GetCurrent(AbpSession.UserId.Value);
            var tutorVerificationStep = tutorVerification.TutorVerificationSteps.FirstOrDefault(e => e.Step == step);

            if (tutorVerificationStep == null)
            {
                tutorVerificationStep = new TutorVerificationStep()
                {
                    Step = step,
                    Status = step == BecomeATutorStep.CompleteApplication
                        ? TutorVerificationStepStatus.Saved : TutorVerificationStepStatus.Incomplete,
                };
                tutorVerification.TutorVerificationSteps.Add(tutorVerificationStep);
            }
            else
            {
                tutorVerificationStep.Status = TutorVerificationStepStatus.Saved;
            }

            if (tutorVerificationStep.Step > tutorVerification.CurrentStep)
            {
                tutorVerification.CurrentStep = step;
                tutorVerification.Status = step == BecomeATutorStep.CompleteApplication
                    ? TutorVerificationStatus.Completed : tutorVerification.Status;
            }

            await _tutorVerificationsRepository.UpdateAsync(tutorVerification);

            return ObjectMapper.Map<TutorVerificationStepDto>(tutorVerificationStep);
        }

        public async Task UpdateAddress(UpdateAddressDto input)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            ObjectMapper.Map(input, user);
            await UserManager.UpdateAsync(user);

            await UpdateCurrentStepStatus();
        }

        private async Task<TutorVerification> GetCurrent(long userId)
        {
            return await _tutorVerificationsRepository
                .GetAll()
                .Include(e => e.TutorVerificationSteps)
                .FirstOrDefaultAsync(e => e.CreatorUserId == userId);
        }

        private async Task UpdateCurrentStepStatus(TutorVerificationStepStatus status = TutorVerificationStepStatus.Saved)
        {
            var tutorVerification = await GetCurrent(AbpSession.UserId.Value);
            var step = tutorVerification.TutorVerificationSteps.FirstOrDefault(e => e.Step == tutorVerification.CurrentStep);

            step.Status = status;
            await _tutorVerificationStepsRepository.UpdateAsync(step);
        }
    }
}
