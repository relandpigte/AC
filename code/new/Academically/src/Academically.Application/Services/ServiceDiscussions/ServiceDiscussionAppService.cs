using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.ServiceDiscussions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.ServiceDiscussions
{
    public class ServiceDiscussionAppService : AcademicallyAppServiceBase, IServiceDiscussionAppService
    {
        private readonly IRepository<ServiceDiscussion, long> _serviceDiscussionRepository;

        public ServiceDiscussionAppService(
            IRepository<ServiceDiscussion, long> serviceDiscussionRepository
        )
        {
            _serviceDiscussionRepository = serviceDiscussionRepository;
        }
    
        public async Task<ServiceDiscussionDto> GetServiceDiscussion(Guid serviceId)
        {
            return await _serviceDiscussionRepository.GetAll()
                .Where(sd => sd.ServiceId == serviceId)
                .Select(sd => ObjectMapper.Map<ServiceDiscussionDto>(sd))
                .FirstOrDefaultAsync();
        }

        public async Task CreateServiceDiscussion(CreateServiceDiscussionDto input)
        {
            var serviceDiscussion = ObjectMapper.Map<ServiceDiscussion>(input);
            await _serviceDiscussionRepository.InsertAsync(serviceDiscussion);
        }
    }
}