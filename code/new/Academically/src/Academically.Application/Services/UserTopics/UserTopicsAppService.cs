using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.UserTopics.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserTopics
{
    [AbpAuthorize(PermissionNames.Pages_Community_UserTopics)]
    public class UserTopicsAppService : AcademicallyAppServiceBase, IUserTopicsAppService
    {
        private readonly IRepository<UserTopic, Guid> _userTopicRepository;

        public UserTopicsAppService(IRepository<UserTopic, Guid> userTopicRepository)
        {
            _userTopicRepository = userTopicRepository;
        }

        public async Task<IEnumerable<UserTopicDto>> GetAll(GetAllUserTopicResultRequestDto request)
        {
            var query = _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Include(x => x.DisciplineTaxonomy.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.DisciplineTaxonomy.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.UserId == request.UserId)
                .Where(x => x.Type == request.Type);

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            return await query.Select(x => ObjectMapper.Map<UserTopicDto>(x)).ToListAsync();
        }

        public async Task<PagedResultDto<UserTopicDto>> GetAllPaged(PagedUserTopicResultRequestDto request)
        {
            var query = _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Include(x => x.DisciplineTaxonomy.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.DisciplineTaxonomy.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.UserId == request.UserId)
                .Where(x => x.Type == request.Type);

            var totalCount = await query.CountAsync();

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            query = query.PageBy(request);

            var userTopics = await query.Select(e => ObjectMapper.Map<UserTopicDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserTopicDto>()
            {
                TotalCount = totalCount,
                Items = userTopics
            };
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Create)]
        public async Task Create(CreateUserTopicDto input)
        {
            var userTopic = ObjectMapper.Map<UserTopic>(input);
            await _userTopicRepository.InsertAsync(userTopic);

            await CurrentUnitOfWork.SaveChangesAsync();
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Delete)]
        public async Task Delete(Guid id)
        {
            await _userTopicRepository.DeleteAsync(id);
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Delete)]
        public async Task DeleteByTopicId(Guid id)
        {
            await _userTopicRepository.DeleteAsync(t => t.DisciplineTaxonomyId == id);
        }

        private IQueryable<UserTopic> Sort(IQueryable<UserTopic> query, string sorting)
        {
            if (sorting.Contains("recent"))
                query = query.OrderByDescending(x => x.CreationTime);
            else if (sorting.Contains("popular"))
                query = query.OrderByDescending(x => x.DisciplineTaxonomy.UserTopics.Count());
            else if (sorting.Contains("foryou"))
                query = query.OrderBy(x => x.DisciplineTaxonomy.Name);
            else
                query = query.OrderBy(x => x.DisciplineTaxonomy.Name);
            return query;
        }

        #region Pub/Sub Notifications

        public async Task SubscribeUserTopicChanges()
        {

        }

        public async Task UnsubscribeUserTopicChanges()
        {
        
        }

        #endregion
    }
}
