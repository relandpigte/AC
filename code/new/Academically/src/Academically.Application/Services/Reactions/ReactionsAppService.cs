using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Reactions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Reactions
{
	public class ReactionsAppService : AcademicallyAppServiceBase, IReactionsAppService
	{
        private readonly IRepository<Reaction, Guid> _reactionsRepository;

		public ReactionsAppService(
            IRepository<Reaction, Guid> reactionsRepository
            )
		{
            _reactionsRepository = reactionsRepository;
        }

        public async Task<ReactionDto> GetAsync(string referenceId, ReactionType type)
        {
            return await _reactionsRepository.GetAll()
                .Where(e => e.ReferenceId == referenceId
                    && e.CreatorUserId == AbpSession.UserId
                    && e.Type == type)
                .Select(e => ObjectMapper.Map<ReactionDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetCountAsync(string referenceId, ReactionType type)
        {
            return await _reactionsRepository.CountAsync(e => e.ReferenceId == referenceId && e.Type == type);
        }

        public async Task SaveAsync(string referenceId, ReactionType type)
        {
            var reaction = await _reactionsRepository.GetAll()
                .FirstOrDefaultAsync(e => e.ReferenceId == referenceId
                    && e.CreatorUserId == AbpSession.UserId
                    && e.Type == type);
            if (reaction == null)
            {
                reaction = new Reaction()
                {
                    ReferenceId = referenceId,
                    Type = type,
                };
                await _reactionsRepository.InsertAsync(reaction);
            }
            else
            {
                await _reactionsRepository.DeleteAsync(reaction);
            }
        }
    }
}

