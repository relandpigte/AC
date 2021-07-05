using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.TutorWizard.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Linq;
using Academically.Domain.Enums;

namespace Academically.Services.TutorApplications
{
    [AbpAuthorize(PermissionNames.Pages_TutorApplications)]
    public class TutorApplicationAppService: AcademicallyAppServiceBase, ITutorApplicationAppService
    {
        private readonly IRepository<TutorVerification, Guid> _tutorVerificationsRepository;

        public TutorApplicationAppService(
            IRepository<TutorVerification, Guid> tutorVerificationsRepository
            )
        {
            _tutorVerificationsRepository = tutorVerificationsRepository;
        }

        public async Task<PagedResultDto<TutorVerificationDto>> GetAllAsync(PagedUserResultRequestDto input)
        {
            input.Keyword = input.Keyword?.ToLower();
            var query = _tutorVerificationsRepository.GetAll()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), e => e.CreatorUser.Name.Contains(input.Keyword)
                    || e.CreatorUser.Surname.Contains(input.Keyword)
                    || e.CreatorUser.EmailAddress.Contains(input.Keyword)
                    || e.CreatorUser.Id.ToString().Contains(input.Keyword))
                .Where(e => e.Status == TutorVerificationStatus.Completed)
                .OrderBy(e => e.CreatorUser.Name);

            query = query.OrderBy(input.Sorting);


            var totalCount = await query.CountAsync();

            var projectOffers = await query
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CreatorUser.UserEducations)
                    .ThenInclude(e => e.University)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<TutorVerificationDto>(e))
                .ToListAsync();

            return new PagedResultDto<TutorVerificationDto>(totalCount, projectOffers);
        }

        public async Task<TutorVerificationStepDto> GetPendingStep(long userId)
        {
            var tutorVerification = await GetCurrent(userId);
            var currentStep = tutorVerification.TutorVerificationSteps
                .OrderBy(e => e.Step)
                .FirstOrDefault(e => e.Status == TutorVerificationStepStatus.Saved);

            return ObjectMapper.Map<TutorVerificationStepDto>(currentStep);
        }

        public async Task<TutorVerificationDto> GetAsync(long userId)
        {
            var tutorVerification = await GetCurrent(userId);

            return ObjectMapper.Map<TutorVerificationDto>(tutorVerification);
        }

        private async Task<TutorVerification> GetCurrent(long userId)
        {
            return await _tutorVerificationsRepository
                .GetAll()
                .Include(e => e.TutorVerificationSteps)
                .FirstOrDefaultAsync(e => e.CreatorUserId == userId);
        }
    }
}
