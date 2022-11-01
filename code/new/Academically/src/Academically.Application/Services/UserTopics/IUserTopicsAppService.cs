using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.UserTopics.Dto;

namespace Academically.Services.UserTopics
{
    public interface IUserTopicsAppService : IApplicationService
    {
        Task<IEnumerable<UserTopicDto>> GetAll(GetAllUserTopicResultRequestDto request);
        Task<PagedResultDto<UserTopicDto>> GetAllPaged(PagedUserTopicResultRequestDto request);
        Task Create(CreateUserTopicDto input);
        Task Delete(Guid id);
    }
}
