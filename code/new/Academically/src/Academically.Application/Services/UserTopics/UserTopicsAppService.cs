using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
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

        public async Task<List<UserTopicDto>> GetAll(long userId)
        {
            var userTopics = await _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Where(x => x.UserId == userId)
                .ToListAsync();
            return ObjectMapper.Map<List<UserTopicDto>>(userTopics);
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
