using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Services
{
    public class ServicesAppService : AcademicallyAppServiceBase, IServicesAppService
    {
        private readonly IRepository<Service, Guid> _servicesRepository;
        private readonly IRepository<ServiceMapping, Guid> _serviceMappingsRepository;
        private readonly IRepository<Service2, Guid> _service2sRepository;

        public ServicesAppService(
            IRepository<Service, Guid> servicesRepository,
            IRepository<ServiceMapping, Guid> serviceMappingsRepository,
            IRepository<Service2, Guid> service2sRepository
            )
        {
            _servicesRepository = servicesRepository;
            _serviceMappingsRepository = serviceMappingsRepository;
            _service2sRepository = service2sRepository;
        }

        public async Task<IEnumerable<ServiceDto>> GetCategories()
        {
            var categoryIds = await _serviceMappingsRepository.GetAll()
                .Select(e => e.Node1Id)
                .Distinct()
                .ToListAsync();

            var categories = await _servicesRepository.GetAll()
                .Where(e => categoryIds.Any(id => id == e.Id))
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ServiceDto>(e))
                .ToListAsync();

            return categories;
        }

        public async Task<IEnumerable<ServiceDto>> GetServices(Guid categoryId)
        {
            var serviceIds = await _serviceMappingsRepository.GetAll()
                .Where(e => e.Node1Id == categoryId && e.Node3Id == null)
                .Select(e => e.Node2Id)
                .Distinct()
                .ToListAsync();

            var services = await _servicesRepository.GetAll()
                .Where(e => serviceIds.Any(id => id == e.Id))
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ServiceDto>(e))
                .ToListAsync();

            return services;
        }

        public async Task<IEnumerable<ServiceMappingDto>> GetLevels(Guid categoryId, Guid serviceId)
        {
            var serviceMappings = await _serviceMappingsRepository.GetAll()
                .Where(e => e.Node1Id == categoryId && e.Node2Id == serviceId && e.Node3Id != null)
                .Include(e => e.Service)
                .Distinct()
                .OrderBy(e => e.Service.Name)
                .Select(e => ObjectMapper.Map<ServiceMappingDto>(e))
                .ToListAsync();

            return serviceMappings;
        }

        public async Task<IEnumerable<SubjectDto>> GetSubjects(string levelName)
        {
            var levelIds = await _servicesRepository.GetAll()
                .Where(e => e.Name.Equals(levelName))
                .Select(e => e.Id)
                .ToListAsync();

            return await _servicesRepository.GetAll()
                .Where(e => levelIds.Any(id => id == e.Id))
                .SelectMany(e => e.ServiceSubjects)
                .Where(e => e.Subject.ReviewStatus == SubjectReviewStatus.Approved
                    || (e.Subject.ReviewStatus != SubjectReviewStatus.Rejected && e.Subject.CreatorUserId == AbpSession.UserId.Value))
                .Select(e => ObjectMapper.Map<SubjectDto>(e.Subject))
                .Distinct()
                .ToListAsync();
        }

        // Using Service2 Table
        public async Task<IEnumerable<Service2Dto>> GetAllCategories()
        {
            return await _service2sRepository.GetAll()
                .OrderBy(s => s.Name)
                .Select(s => ObjectMapper.Map<Service2Dto>(s))
                .ToListAsync();
        }
    }
}
