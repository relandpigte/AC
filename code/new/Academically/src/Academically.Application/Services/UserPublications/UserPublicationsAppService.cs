using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.UserPublications.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserPublications
{
    public class UserPublicationsAppService : AcademicallyAppServiceBase, IUserPublicationsAppService
    {
        private readonly IRepository<UserPublication, Guid> _userPublicationsRepository;
        private readonly IRepository<PublicationTag, Guid> _publicationTagsRepository;

        public UserPublicationsAppService(
            IRepository<UserPublication, Guid> userPublicationsRepository,
            IRepository<PublicationTag, Guid> publicationTagsRepository
            )
        {
            _userPublicationsRepository = userPublicationsRepository;
            _publicationTagsRepository = publicationTagsRepository;
        }

        public async Task<IEnumerable<PublicationTagDto>> GetTags(string nameFilter)
        {
            nameFilter = nameFilter?.ToLower();
            var publicationTags = await _publicationTagsRepository.GetAll()
                .WhereIf(!nameFilter.IsNullOrWhiteSpace(), e => e.Name.ToLower().Contains(nameFilter))
                .OrderBy(e => e.Name)
                .Take(10)
                .Select(e => ObjectMapper.Map<PublicationTagDto>(e))
                .ToListAsync();
            return publicationTags;
        }

        public async Task Create(UserPublicationDto input)
        {
            var userPublication = ObjectMapper.Map<UserPublication>(input);
            foreach (var tag in input.Tags)
            {
                var sTag = tag.ToLower();
                var publicationTag = await _publicationTagsRepository.FirstOrDefaultAsync(e => e.Name.ToLower() == sTag);
                if (publicationTag == null)
                {
                    publicationTag = new PublicationTag()
                    {
                        Name = tag,
                    };
                    publicationTag = await _publicationTagsRepository.InsertAsync(publicationTag);
                }
                userPublication.UserPublicationTags.Add(new UserPublicationTag()
                {
                    PublicationTagId = publicationTag.Id,
                }); ;
            }
            await _userPublicationsRepository.InsertAsync(userPublication);
        }

        public async Task<PagedResultDto<UserPublicationDto>> GetPaged(PagedUserPublicationRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var query = _userPublicationsRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserIdFilter)
                .WhereIf(!input.SearchFilter.IsNullOrWhiteSpace(), e => e.Title.ToLower().Contains(input.SearchFilter)
                    || e.Publisher.Contains(input.SearchFilter)
                    || e.Abstract.Contains(input.SearchFilter));

            var totalCount = await query.CountAsync();
            var userPublications = await query
                .Include(e => e.UserPublicationTags)
                    .ThenInclude(e => e.PublicationTag)
                .Select(e => ObjectMapper.Map<UserPublicationDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserPublicationDto>(totalCount, userPublications);
        }
    }
}
