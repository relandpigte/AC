using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserTopics.Dto;

namespace Academically.Services.UserTopics
{
    public interface IUserTopicsAppService : IApplicationService
    {
        Task<List<UserTopicDto>> GetAll(long userId);
        Task Create(CreateUserTopicDto input);
        Task Delete(Guid id);
    }
}
