using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserPublications.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserPublications
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchPublications,PermissionNames.Pages_TutorApplications_Research)]
    public class UserPublicationsAppService : AcademicallyAppServiceBase, IUserPublicationsAppService
    {
        private readonly IRepository<UserPublication, Guid> _userPublicationsRepository;
        private readonly IRepository<PublicationTag, Guid> _publicationTagsRepository;
        private readonly IRepository<UserPublicationTag, Guid> _userPublicationTagsRepository;

        public UserPublicationsAppService(
            IRepository<UserPublication, Guid> userPublicationsRepository,
            IRepository<PublicationTag, Guid> publicationTagsRepository,
            IRepository<UserPublicationTag, Guid> userPublicationTagsRepository
            )
        {
            _userPublicationsRepository = userPublicationsRepository;
            _publicationTagsRepository = publicationTagsRepository;
            _userPublicationTagsRepository = userPublicationTagsRepository;
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

        public async Task<PagedResultDto<UserPublicationDto>> GetPaged(PagedUserPublicationRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var query = _userPublicationsRepository.GetAll()
                .Where(e => e.CreatorUserId == input.UserIdFilter)
                .WhereIf(!input.SearchFilter.IsNullOrWhiteSpace(), e => e.Title.ToLower().Contains(input.SearchFilter)
                    || e.Publisher.Contains(input.SearchFilter)
                    || e.Abstract.Contains(input.SearchFilter)
                    || e.UserPublicationTags.Any(e => e.PublicationTag.Name.ToLower().Contains(input.SearchFilter)))
                .OrderByDescending(e => e.PublicationDate);

            var totalCount = await query.CountAsync();
            var userPublications = await query
                .Include(e => e.UserPublicationTags)
                    .ThenInclude(e => e.PublicationTag)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<UserPublicationDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserPublicationDto>(totalCount, userPublications);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchPublications_Create)]
        public async Task Create(UserPublicationDto input)
        {
            var userPublication = ObjectMapper.Map<UserPublication>(input);
            await CreateUserPublicationTags(userPublication, input.Tags);
            await _userPublicationsRepository.InsertAsync(userPublication);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchPublications_Update)]
        public async Task Update(UserPublicationDto input)
        {
            var userPublication = await _userPublicationsRepository.GetAsync(input.Id.Value);
            await _userPublicationTagsRepository.DeleteAsync(e => e.UserPublicationId == userPublication.Id);
            ObjectMapper.Map(input, userPublication);
            await CreateUserPublicationTags(userPublication, input.Tags);
            await _userPublicationsRepository.UpdateAsync(userPublication);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Research_ResearchPublications_Delete)]
        public async Task Delete(Guid id)
        {
            await _userPublicationTagsRepository.DeleteAsync(e => e.UserPublicationId == id);
            await _userPublicationsRepository.DeleteAsync(id);
        }

        private async Task CreateUserPublicationTags(UserPublication userPublication, IEnumerable<string> tags)
        {
            userPublication.UserPublicationTags = new HashSet<UserPublicationTag>();
            foreach (var tag in tags)
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
        }
    }
}
