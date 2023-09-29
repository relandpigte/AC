using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Reactions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Reactions
{
	public class ReactionsAppService : AcademicallyAppServiceBase, IReactionsAppService
	{
        private readonly IRepository<Reaction, Guid> _reactionsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public ReactionsAppService(
            IRepository<Reaction, Guid> reactionsRepository,
            IDocumentsDomainService documentsDomainService
            )
		{
            _reactionsRepository = reactionsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<IEnumerable<ReactionDto>> GetAllAsync(string referenceId)
        {
            var reactions = await _reactionsRepository.GetAll()
                .Include(r => r.CreatorUser)
                .Where(e => e.ReferenceId == referenceId)
                .Select(e => ObjectMapper.Map<ReactionDto>(e))
                .ToListAsync();

            foreach (var reaction in reactions)
            {
                if (reaction.CreatorUser.ProfilePictureDocumentId.HasValue)
                    reaction.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(reaction.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return reactions;
        }

        public async Task<ReactionDto> GetAsync(string referenceId, ReactionType type)
        {
            var reaction = await _reactionsRepository.GetAll()
                .Include(r => r.CreatorUser)
                .Where(e => e.ReferenceId == referenceId
                    && e.CreatorUserId == AbpSession.UserId
                    && e.Type == type)
                .Select(e => ObjectMapper.Map<ReactionDto>(e))
                .FirstOrDefaultAsync();

            if (reaction?.CreatorUser?.ProfilePictureDocumentId.HasValue == true)
                reaction.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(reaction.CreatorUser.ProfilePictureDocumentId.Value);

            return reaction;
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

