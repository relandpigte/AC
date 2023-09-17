using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.ServiceDiscussions.Dto;

namespace Academically.Services.ServiceDiscussions
{
    public interface IServiceDiscussionAppService : IApplicationService
    {
        Task<ServiceDiscussionDto> GetServiceDiscussion(Guid serviceId);
        Task CreateServiceDiscussion(CreateServiceDiscussionDto input);
    }
}