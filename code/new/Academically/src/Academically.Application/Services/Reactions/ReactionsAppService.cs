using System;
using System.Collections.Generic;
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

        public async Task<IEnumerable<ReactionDto>> GetAllAsync(string referenceId)
        {
            return await _reactionsRepository.GetAll()
                .Where(e => e.ReferenceId == referenceId)
                .Select(e => ObjectMapper.Map<ReactionDto>(e))
                .ToListAsync();
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
                    && e.CreatorUserId == AbpSession.UserId);
            if (reaction?.Type == type) await _reactionsRepository.DeleteAsync(reaction);
            else
            {
                if (reaction == null) reaction = new Reaction();
                reaction.ReferenceId = referenceId;
                reaction.Type = type;
                await _reactionsRepository.InsertOrUpdateAsync(reaction);
            }
        }
    }
}

