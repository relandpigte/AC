using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Subjects.Dto;

namespace Academically.Services.Subjects
{
    public interface ISubjectsAppService : IApplicationService
    {
        Task SuggestSubject(SuggestSubjectDto input);
        Task<IEnumerable<SubjectSuggestionDto>> GetSuggestions();
        Task ApproveSuggestion(Guid id);
        Task RejectSuggestion(Guid id);
    }
}
