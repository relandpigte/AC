using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Comments.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.Comments
{
    public interface ICommentsAppService : IApplicationService
    {
        Task<IEnumerable<CommentDto>> GetAllAsync(string referenceId);
        Task<PagedResultDto<CommentDto>> GetAllRepliesAsync(PagedCommentResultRequestDto input);
        Task<CommentDto> CreateAsync(CommentDto input);
        Task<CommentReactionDto> CreateReactionAsync(CommentReactionDto input);
        Task DeleteReactionAsync(Guid id);
    }
}
