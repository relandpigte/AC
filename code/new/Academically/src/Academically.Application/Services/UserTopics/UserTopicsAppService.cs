using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
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

        public async Task<List<UserTopicDto>> GetAll(long userId, UserTopicType type)
        {
            var userTopics = await _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Where(x => x.UserId == userId)
                .Where(x => x.Type == type)
                .ToListAsync();
            return ObjectMapper.Map<List<UserTopicDto>>(userTopics);
        }

        public async Task<PagedResultDto<UserTopicDto>> GetAllPaged(PagedUserTopicResultRequestDto request)
        {
            var query = _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Where(x => x.UserId == request.UserId)
                .Where(x => x.Type == request.Type);

            var totalCount = await query.CountAsync();

            if (!string.IsNullOrWhiteSpace(request.Sorting))
            {
                query = query.OrderBy(request.Sorting);
            }
               
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
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Delete)]
        public async Task Delete(Guid id)
        {
            await _userTopicRepository.DeleteAsync(id);
        }
    }
}
