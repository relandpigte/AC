using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserServices
{
    public class UserServicesAppService : AcademicallyAppServiceBase, IUserServicesAppService
    {
        private readonly IRepository<Service, Guid> _servicesRepository;
        private readonly IRepository<ServiceMapping, Guid> _serviceMappingsRepository;
        private readonly IRepository<UserService, Guid> _userServicesRespository;

        public UserServicesAppService(
            IRepository<Service, Guid> servicesRepository,
            IRepository<ServiceMapping, Guid> serviceMappingsRepository,
            IRepository<UserService, Guid> userServicesRespository
            )
        {
            _servicesRepository = servicesRepository;
            _serviceMappingsRepository = serviceMappingsRepository;
            _userServicesRespository = userServicesRespository;
        }

        public async Task<IEnumerable<UserServiceDto>> Get(long userId, Guid serviceId)
        {
            var userServices = await _userServicesRespository.GetAll()
                .Where(e => e.CreatorUserId == userId && e.ServiceMapping.Node3Id == serviceId)
                .Include(e => e.UserServiceSubjects)
                    .ThenInclude(e => e.Subject)
                .Include(e => e.UserServiceDisciplineTaxonomies)
                    .ThenInclude(e => e.DisciplineTaxonomy)
                 .Select(e => ObjectMapper.Map<UserServiceDto>(e))
                .ToListAsync();

            return userServices;
        }

        public async Task<IEnumerable<ServiceDto>> GetServiceTree(long userId)
        {
            var serviceMappings = await _userServicesRespository.GetAll()
                .Where(e => e.CreatorUserId == userId)
                .Select(e => e.ServiceMapping)
                .Distinct()
                .ToListAsync();

            var categoryIds = serviceMappings.Select(e => e.Node1Id.Value).Distinct();

            var categories = await _servicesRepository.GetAll()
                .Where(e => categoryIds.Any(id => id == e.Id))
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ServiceDto>(e))
                .ToListAsync();

            foreach (var category in categories)
            {
                var serviceIds = serviceMappings.Where(e => e.Node1Id == category.Id)
                    .Select(e => e.Node2Id)
                    .Distinct();
                category.Children = await _servicesRepository.GetAll()
                    .Where(e => serviceIds.Any(id => id == e.Id))
                    .OrderBy(e => e.Name)
                    .Select(e => ObjectMapper.Map<ServiceDto>(e))
                    .ToListAsync();
                foreach (var service in category.Children)
                {
                    var levelIds = serviceMappings.Where(e => e.Node1Id == category.Id && e.Node2Id == service.Id)
                        .Select(e => e.Node3Id)
                        .Distinct();
                    service.Children = await _servicesRepository.GetAll()
                        .Where(e => levelIds.Any(id => id == e.Id))
                        .OrderBy(e => e.Name)
                        .Select(e => ObjectMapper.Map<ServiceDto>(e))
                        .ToListAsync();
                }
            }

            return categories;
        }

        public async Task Create(UserServiceDto input)
        {
            var userService = ObjectMapper.Map<UserService>(input);

            if (input.Subjects != null && input.Subjects.Any())
            {
                userService.Title = string.Join(", ", input.Subjects.Select(e => e.Name));
                input.Subjects.ToList().ForEach(subject =>
                {
                    userService.UserServiceSubjects.Add(new UserServiceSubject()
                    {
                        SubjectId = subject.Id,
                    });
                });
            }
            else if (input.DisciplineTaxonomies != null && input.DisciplineTaxonomies.Any())
            {
                input.DisciplineTaxonomies.ToList().ForEach(disciplineTaxonomy =>
                {
                    userService.UserServiceDisciplineTaxonomies.Add(new UserServiceDisciplineTaxonomy()
                    {
                        DisciplineTaxonomyId = disciplineTaxonomy.Id,
                    });
                });
            }

            await _userServicesRespository.InsertAsync(userService);
        }
    }
}
