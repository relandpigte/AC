using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Forums.Dto;

namespace Academically.Services.Forums
{
	public interface IForumsAppService : IAsyncCrudAppService<ForumDto, Guid, PagedForumResultRequestDto, CreateForumDto, UpdateForumDto>
	{
		Task<ForumReplyDto> CreateReplyAsync(CreateForumReplyDto input);
	}
}

