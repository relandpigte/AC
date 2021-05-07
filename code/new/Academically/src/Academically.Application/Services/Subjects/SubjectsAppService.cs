using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.UI;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Subjects.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Subjects
{
    public class SubjectsAppService : AcademicallyAppServiceBase, ISubjectsAppService
    {
        private readonly IRepository<Subject, Guid> _subjectsRepository;

        public SubjectsAppService(
            IRepository<Subject, Guid> subjectsRepository
            )
        {
            _subjectsRepository = subjectsRepository;
        }

        public async Task<IEnumerable<SubjectSuggestionDto>> GetSuggestions()
        {
            var suggestions = await _subjectsRepository.GetAll()
                .Where(e => e.ReviewStatus == SubjectReviewStatus.Pending)
                .Include(e => e.CreatorUser)
                .Include(e => e.ServiceSubjects)
                    .ThenInclude(e => e.Service)
                .OrderBy(e => e.CreationTime)
                .ToListAsync();

            var outputs = new List<SubjectSuggestionDto>();
            foreach (var suggestion in suggestions)
            {
                var output = ObjectMapper.Map<SubjectSuggestionDto>(suggestion);
                output.ServiceName = suggestion.ServiceSubjects.FirstOrDefault().Service.Name;
                outputs.Add(output);
            }

            return outputs;
        }

        public async Task SuggestSubject(SuggestSubjectDto input)
        {
            var subject = await _subjectsRepository.GetAll()
                .Where(e => e.Name.ToLower() == input.Name.ToLower())
                .Where(e => e.ServiceSubjects.Any(s => s.ServiceId == input.ServiceId))
                .FirstOrDefaultAsync();
            if (subject != null)
            {
                throw new UserFriendlyException(L("SubjectExistsErrorMessage"));
            }
            subject = new Subject()
            {
                Name = input.Name,
            };
            subject.ServiceSubjects.Add(new ServiceSubject()
            {
                ServiceId = input.ServiceId,
            });
            await _subjectsRepository.InsertAsync(subject);
        }

        public async Task ApproveSuggestion(Guid id)
        {
            var subject = await _subjectsRepository
                .GetAll()
                .Include(e => e.ServiceSubjects)
                .FirstOrDefaultAsync(e => e.Id == id);
            subject.ReviewerUserId = AbpSession.UserId.Value;
            subject.ReviewTime = Clock.Now;
            subject.ReviewStatus = SubjectReviewStatus.Approved;

            await _subjectsRepository.UpdateAsync(subject);
        }

        public async Task RejectSuggestion(Guid id)
        {
            var subject = await _subjectsRepository
                .GetAll()
                .Include(e => e.ServiceSubjects)
                .FirstOrDefaultAsync(e => e.Id == id);
            subject.ReviewerUserId = AbpSession.UserId.Value;
            subject.ReviewTime = Clock.Now;
            subject.ReviewStatus = SubjectReviewStatus.Rejected;

            await _subjectsRepository.UpdateAsync(subject);
        }
    }
}
