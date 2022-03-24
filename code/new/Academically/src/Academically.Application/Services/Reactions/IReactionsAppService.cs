using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Reactions.Dto;

namespace Academically.Services.Reactions
{
	public interface IReactionsAppService : IApplicationService
	{
		Task<IEnumerable<ReactionDto>> GetAllAsync(string referenceId);
		Task<ReactionDto> GetAsync(string referenceId, ReactionType type);
		Task<int> GetCountAsync(string referenceId, ReactionType type);
		Task SaveAsync(string referenceId, ReactionType type);
	}
}

