using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Questions.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Questions
{
    public interface IQuestionsAppService : IApplicationService
    {
        Task<IEnumerable<QuestionDto>> GetAllAsync(GetQuestionsRequestDto input);
        Task<PagedResultDto<QuestionDto>> GetAllRepliesAsync(PagedQuestionResultRequestDto input);
        Task<QuestionDto> CreateAsync(QuestionDto input);
        Task<QuestionReactionDto> CreateReactionAsync(QuestionReactionDto input);
        Task DeleteReactionAsync(Guid id);
        Task<QuestionDto> GetAsync(Guid questionId);
        Task<IEnumerable<QuestionReactionDto>> GetReactionByReferenceAsync(Guid referenceId);
    }
}
